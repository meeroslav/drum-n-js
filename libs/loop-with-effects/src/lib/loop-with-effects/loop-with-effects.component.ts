import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-loop-with-effects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 class="text-4xl font-extrabold mb-4">Effects</h2>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" (click)="togglePlay()">
        {{ isPlaying ? 'Stop' : 'Play' }}
    </button>
    <h3 class="text-xl font-bold mt-4 mb-2">Low Pass Filter</h3>
    <div class="flex flex-row border rounded p-2">
      <div class="basis-1/4 ml-2">
        <label for="lowPassFrequency">Cut off Frequency</label>
        <input
          [ngModel]="lowPassFrequency"
          (ngModelChange)="setLowPassFrequency($event)"
          type="range" min="40" [max]="lowPassMax" />
      </div>
      <div class="basis-1/4 ml-2">
        <label for="lowPassQuality">Resonance</label>
        <input
          [ngModel]="lowPassQuality"
          (ngModelChange)="setLowPassQuality($event)"
          type="range" min="0.0001" max="20" step="0.0001" />
      </div>
    </div>
    <h3 class="text-xl font-bold mt-4 mb-2">Volume</h3>
    <div class="flex flex-row border rounded p-2">
      <div class="basis-1/4 ml-2">
        <label for="masterGain">Volume</label>
        <input class="w-full"
          [ngModel]="masterGain"
          (ngModelChange)="setMasterGain($event)"
          type="range" min="0" max="1" step="0.01" />
      </div>
    </div>

  `,
})
export class LoopWithEffectsComponent implements OnDestroy {
  ctx!: AudioContext;
  master!: GainNode;
  source!: AudioBufferSourceNode;
  audioBuffer!: AudioBuffer;
  lowPassFilter!: BiquadFilterNode;
  isPlaying = false;
  lowPassFrequency = 2000;
  lowPassQuality = 1;
  lowPassMax = 20000;
  masterGain = 0.8;

  constructor() {
    const AudioContext = getAudioContext();
    if (AudioContext) {
      this.ctx = new AudioContext();
      // create nodes
      this.master = this.ctx.createGain();
      this.master.gain.value = this.masterGain;
      // low pass filter
      this.lowPassFilter = this.ctx.createBiquadFilter();
      this.lowPassFilter.type = 'lowpass';
      this.lowPassMax = this.ctx.sampleRate / 2;
      this.lowPassFrequency = this.lowPassMax;
      this.lowPassFilter.frequency.value = this.lowPassFrequency;
      this.lowPassFilter.Q.value = this.lowPassQuality;
      // connect sources
      this.master.connect(this.lowPassFilter);
      this.lowPassFilter.connect(this.ctx.destination);
      // fetch audio
      fetchAndDecodeAudio('loop.wav', this.ctx).then(audioBuffer => {
        this.audioBuffer = audioBuffer;
      });
    }
  }

  ngOnDestroy() {
    this.stopSource();
  }

  setLowPassFrequency(frequency: number) {
    this.lowPassFilter.frequency.value = frequency;
  }

  setLowPassQuality(quality: number) {
    this.lowPassFilter.Q.value = quality;
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
    console.log('Stopping source');
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
