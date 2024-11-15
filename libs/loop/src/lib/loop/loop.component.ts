import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-loop',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-4xl font-extrabold mb-4">Basic player</h2>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" (click)="togglePlay()">
      {{ isPlaying ? 'Stop' : 'Play' }}
    </button>
  `,
})
export class LoopComponent implements OnDestroy {
  ctx!: AudioContext;
  source!: AudioBufferSourceNode;
  audioBuffer!: AudioBuffer;
  isPlaying = false;

  constructor() {
    const AudioContext = getAudioContext();
    if (AudioContext) {
      this.ctx = new AudioContext();
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
    this.source.connect(this.ctx.destination);
    this.source.start(0);
  }

  stopSource() {
    if (this.source) {
      this.source.stop();
    }
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
