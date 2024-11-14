import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-loop-with-effects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 class="text-4xl font-extrabold mb-4">Effects</h2>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" (click)="togglePlay()">
      {{ isPlaying ? 'Stop' : 'Play' }}
    </button>
    <input class="ml-2 mr-2"
      [ngModel]="lowPassFrequency"
      (ngModelChange)="setLowPassFrequency($event)"
      id="customRange1" type="range" min="40" [max]="lowPassMax" />
    <input class="ml-2 mr-2"
      [ngModel]="masterGain"
      (ngModelChange)="setMasterGain($event)"
      id="customRange1" type="range" min="0" max="1" step="0.01" />
  `,
})
export class LoopWithEffectsComponent {
  ctx!: AudioContext;
  master!: GainNode;
  source!: AudioBufferSourceNode;
  audioBuffer!: AudioBuffer;
  lowPassFilter!: BiquadFilterNode;
  isPlaying = false;
  lowPassFrequency = 2000;
  lowPassMax = 20000;
  masterGain = 0.8;

  constructor() {
    const AudioContext = getAudioContext();
    if (AudioContext) {
      this.ctx = new AudioContext();
      // create nodes
      this.master = this.ctx.createGain();
      this.master.gain.value = this.masterGain;
      this.lowPassFilter = this.ctx.createBiquadFilter();
      this.lowPassFilter.type = 'lowpass';
      this.lowPassMax = this.ctx.sampleRate / 2;
      this.lowPassFrequency = this.lowPassMax;
      this.lowPassFilter.frequency.value = this.lowPassFrequency;
      // connect sources
      this.master.connect(this.lowPassFilter);
      this.lowPassFilter.connect(this.ctx.destination);
      // fetch audio
      fetchAndDecodeAudio('loop.wav', this.ctx).then(audioBuffer => {
        this.audioBuffer = audioBuffer;
      });
    }
  }

  onDestroy() {
    this.stopSource();
  }

  setLowPassFrequency(frequency: number) {
    this.lowPassFilter.frequency.value = frequency;
  }

  setMasterGain(volume: number) {
    this.master.gain.value = volume;
  }

  createSourceAndPlay() {
    this.source = this.ctx.createBufferSource();
    this.source.buffer = this.audioBuffer;
    this.source.connect(this.master);
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
