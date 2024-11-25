import { Component, ElementRef, ViewChild, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-loop-with-visualizer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 class="text-4xl font-extrabold mb-4">Analyzer</h2>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" (click)="togglePlay()">
      {{ isPlaying ? 'Stop' : 'Play' }}
    </button>
    <canvas class="mt-2" #canvas width="800" height="200"></canvas>
  `,
})
export class LoopWithVisualizerComponent implements OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef;

  ctx!: AudioContext;
  master!: GainNode;
  source!: AudioBufferSourceNode;
  analyzer!: AnalyserNode;
  audioBuffer!: AudioBuffer;
  drawHandle!: number;
  isPlaying = false;

  constructor() {
    const AudioContext = getAudioContext();
    if (AudioContext) {
      this.ctx = new AudioContext();
      // create nodes
      this.master = this.ctx.createGain();
      this.analyzer = this.ctx.createAnalyser();
      // configure nodes
      this.analyzer.fftSize = 64;
      // connect sources
      this.master.connect(this.analyzer);
      this.analyzer.connect(this.ctx.destination);
      // fetch audio
      fetchAndDecodeAudio('loop.wav', this.ctx).then(audioBuffer => {
        this.audioBuffer = audioBuffer;
      });
    }
  }

  ngOnDestroy() {
    this.stopSource();
  }

  createSourceAndPlay() {
    this.source = this.ctx.createBufferSource();
    this.source.buffer = this.audioBuffer;
    this.source.connect(this.master);
    this.source.start(0);
    this.drawVisualizer();
  }

  stopSource() {
    if (this.source) {
      this.source.stop();
    }
    if (this.drawHandle) {
      cancelAnimationFrame(this.drawHandle);
    }
  }

  drawVisualizer() {
    const canvas = this.canvas.nativeElement;
    const canvasCtx = canvas.getContext('2d');
    const bufferLength = this.analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const draw = () => {
      this.drawHandle = requestAnimationFrame(draw);

      // clean canvas
      canvasCtx.fillStyle = "rgb(8, 10, 18)";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(0, 0, 0)";
      const barWidth = (canvas.width / bufferLength);
      let barHeight;
      let x = 0;
      // get data
      this.analyzer.getByteFrequencyData(dataArray);
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        canvasCtx.fillStyle = `rgb(30 46 ${barHeight * 4})`;
        canvasCtx.fillRect(x, canvas.height - barHeight / 1.5, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.createSourceAndPlay();
    } else {
      this.stopSource();
    }
  }
}

async function fetchAndDecodeAudio(url: string, context: AudioContext): Promise<AudioBuffer> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await context.decodeAudioData(arrayBuffer);
}

function getAudioContext() {
  return globalThis.window?.AudioContext || (globalThis.window as any)?.webkitAudioContext;
}
