import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sequencer } from './sequencer';
import { SequencerTrackComponent } from './track.component';
import { createAudioContext, loadDrumSamples } from '@drum-n-js/audio-utils';

// TODO:
// -- Add synth track
// -- Add sample track
// -- Handle track volume and pan
// -- Handle track reverberation
// -- Add master cutoff
// -- Prepare patches

@Component({
  selector: 'lib-groovebox',
  standalone: true,
  imports: [CommonModule, FormsModule, SequencerTrackComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-4xl font-extrabold mb-4">Groovebox</h2>
    <div class="flex items-center space-x-2">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" (click)="togglePlay()">
        {{ isPlaying ? 'Stop' : 'Play' }}
      </button>
      <label class="mr-4 text-slate-500" for="tempo">BPM</label>
      <input class="w-16 rounded bg-slate-500 p-1" type="number" [ngModel]="sequencer().tempo" (ngModelChange)="updateTempo($event)" />
      <label class="mr-4 text-slate-500" for="volume">Volume</label>
      <input class="w-32" type="range" min="0" max="1" step="0.01" [ngModel]="sequencer().volume" (ngModelChange)="updateVolume($event)" />
      <canvas class="rounded" #canvas width="100" height="32"></canvas>
    </div>
    @if (noContextError) {
      <h1 class="text-red-500 text-4xl rounded bg-slate-200">Web Audio API is not supported in this browser</h1>
    } @else if (loadingSamplesWarning) {
      <h1 class="text-yellow-500 text-4xl rounded bg-slate-200">Loading drum samples...</h1>
    }
    <div class="flex items-center space-x-2 mt-4">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" (click)="addSynthTrack()">Add Synth Track</button>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" (click)="addDrumTrack()">Add Drum Track</button>
    </div>
    <div class="mt-4 grid grid-cols-1 gap-2">
      @for (track of sequencer().tracks; track track.id) {
        <sequencer-track [track]="track" (deleteTrack)="deleteTrack($event)"></sequencer-track>
      }
    </div>
  `
})
export class GrooveboxComponent {
  audioContext!: AudioContext | undefined;
  master!: GainNode;
  buffers!: Record<string, AudioBuffer>;
  isPlaying = false;
  sequencer!: WritableSignal<Sequencer>;
  // consts
  DEFAULT_TEMPO = 123;
  // errors
  noContextError = false;
  loadingSamplesWarning = true;
  // note scheduling
  clock!: number;
  noteTime!: number;
  startTime!: number;
  currentStep!: number;
  // computed values
  tic!: number;

  constructor() {
    this.sequencer = signal({
      volume: 0.8,
      tempo: this.DEFAULT_TEMPO,
      tracks: []
    });
    this.calculateTic();
    this.audioContext = createAudioContext();
    if (this.audioContext) {
      this.noContextError = false;
      loadDrumSamples(this.audioContext).then(buffers => {
        this.loadingSamplesWarning = false;
        this.buffers = buffers;
      });
      // set master gain
      this.master = this.audioContext.createGain();
      this.master.gain.value = this.sequencer().volume;
      this.master.connect(this.audioContext.destination);
    } else {
      this.noContextError = true;
    }
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying && this.audioContext) {
      this.noteTime = 0.0;
      this.startTime = this.audioContext.currentTime + 0.005;
      this.currentStep = 0;
      this.scheduleNotes();
    } else {
      clearTimeout(this.clock);
    }
    console.log(this.sequencer());
  }

  scheduleNotes() {
    if (!this.audioContext) {
      return;
    }
    console.log('scheduling notes');
    let currentTime = this.audioContext.currentTime;
    currentTime -= this.startTime;

    while (this.noteTime < currentTime + 0.1) {
      const playTime = this.noteTime + this.startTime;
      this.playPatternStep(playTime);
      this.currentStep++;
      if (this.currentStep === 16) {
        this.currentStep = 0;
      }
      this.noteTime += this.tic;
    }

    this.clock = window.setTimeout(this.scheduleNotes.bind(this), 0);
  }

  playPatternStep(playTime: number) {
    this.sequencer().tracks.forEach(track => {
      if (track.type === 'SYNTH') {
        // this.playSynthTrack(track, playTime);
      } else if (track.type === 'DRUM' && track.sequence[this.currentStep]) {
        this.playSample(track.sample, playTime);
      }
    });
    // this.noteTime += 60 / this.sequencer().tempo;
  }

  playSample(sample: string, when: number) {
    if (!this.audioContext) {
      return;
    }
    const source = this.audioContext.createBufferSource();
    source.buffer = this.buffers[sample];
    source.connect(this.master);
    source.start(when || 0);
  }

  addSynthTrack() {
    this.sequencer().tracks.push({
      id: Math.random().toString(36),
      type: 'SYNTH',
      volume: 1,
      reverb: 0,
      solo: false,
      mute: false,
      patch: 'base',
      envelope: {
        attack: 0.1,
        decay: 0.1,
        sustain: 0.1,
        release: 0.1
      },
      sequence: [{ note: 3, frequency: 220 }, { note: '-' }, { note: 23, frequency: 1400 }, { note: 2, frequency: 1400 }]
    });
  }

  addDrumTrack() {
    this.sequencer().tracks.push({
      id: Math.random().toString(36),
      type: 'DRUM',
      volume: 1,
      reverb: 0,
      solo: false,
      mute: false,
      sample: 'kick',
      sequence: []
    });
  }

  deleteTrack(id: string) {
    this.sequencer().tracks = this.sequencer().tracks.filter(track => track.id !== id);
  }

  updateVolume(volume: number) {
    this.sequencer().volume = volume;
    this.master.gain.value = volume;
  }

  updateTempo(tempo: number) {
    this.sequencer().tempo = tempo;
    this.calculateTic();
  }

  private calculateTic() {
    this.tic = 60 / this.sequencer().tempo / 4;
  }
}
