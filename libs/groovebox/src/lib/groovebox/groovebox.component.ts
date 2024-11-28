import { ChangeDetectionStrategy, Component, signal, WritableSignal, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SequencerTrackComponent } from './track.component';
import {
  createAudioContext, loadSamples, stepBpmDuration, DrumTrack,
  GrooveboxTrack, SamplerTrack, Sequencer, createDrumTrack,
  createSynthTrack, createSamplerTrack, SynthTrack,
  BornSlippyPatch,
  startEnvelope,
  endEnvelope,
  PATCHES,
  Patches,
} from '@drum-n-js/audio-utils';
import { LucideAngularModule, AudioWaveform, Drum, AudioLines, Play, Square, TriangleRight, Gauge, Activity, ArrowLeftToLine } from 'lucide-angular';

// TODO:
// -- Add more patches
// -- Handle track reverberation

@Component({
  selector: 'lib-groovebox',
  standalone: true,
  imports: [CommonModule, FormsModule,
    LucideAngularModule,
    SequencerTrackComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-4xl font-extrabold mb-4">Groovebox</h2>
    <div class="flex items-center space-x-2">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" (click)="togglePlay()">
        @if (isPlaying) {
          <i-lucide [img]="StopIcon" class="inline-block w-4 h-4 -mt-1 mr-1"></i-lucide>
        } @else {
          <i-lucide [img]="PlayIcon" class="inline-block w-4 h-4 -mt-1 mr-1"></i-lucide>
        }
      </button>
      <i-lucide [img]="GaugeIcon" class="inline-block w-4 h-4 -mt-1 mr-1 ml-1"></i-lucide>
      <label class="mr-4 text-slate-500" for="tempo">BPM</label>
      <input class="w-16 rounded bg-slate-500 p-1" type="number" [ngModel]="sequencer().tempo" (ngModelChange)="updateTempo($event)" />
      <canvas class="rounded" #canvas width="100" height="32"></canvas>
    </div>
    <div class="flex flex-row border rounded border-fd-foreground/10 border-opacity-20 mt-2 p-2">
      <div class="basis-1/5 ml-2">
        <i-lucide [img]="VolumeIcon" class="inline-block w-4 h-4 -mt-1 mr-2"></i-lucide>
        <label for="volume">Volume</label>
        <input type="range" class="w-full" min="0" max="1" step="0.01"
          [ngModel]="sequencer().volume"
          (ngModelChange)="updateMasterVolume($event)" />
      </div>
      <div class="basis-1/5 ml-2">
        <i-lucide [img]="ArrowLeftToLine" class="inline-block w-4 h-4 -mt-1 mr-2"></i-lucide>
        <label for="lowPassFrequency">Cut off</label>
        <input class="w-full"
          [ngModel]="lowPassFrequency"
          (ngModelChange)="setLowPassFrequency($event)"
          type="range" min="40" [max]="LOW_PASS_MAX" />
      </div>
      <div class="basis-1/5 ml-2">
        <i-lucide [img]="Activity" class="inline-block w-4 h-4 -mt-1 mr-2"></i-lucide>
        <label for="lowPassQuality">Resonance</label>
        <input class="w-full"
          [ngModel]="lowPassQuality"
          (ngModelChange)="setLowPassQuality($event)"
          type="range" min="0.0001" max="20" step="0.0001" />
      </div>
    </div>
    @if (noContextError()) {
      <h1 class="text-red-500 text-4xl rounded bg-slate-200">Web Audio API is not supported in this browser</h1>
    } @else if (loadingSamplesWarning()) {
      <h1 class="text-yellow-500 text-4xl rounded bg-slate-200">Loading drum samples...</h1>
    } @else {
      <div class="flex items-center space-x-2 mt-4">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" (click)="addSynthTrack()">
          <i-lucide [img]="AudioWaveformIcon" class="inline-block w-4 h-4 -mt-1 mr-1"></i-lucide>
          Add Synth Track</button>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" (click)="addSamplerTrack()">
          <i-lucide [img]="AudioLinesIcon" class="inline-block w-4 h-4 -mt-1 mr-1"></i-lucide>
          Add Sampler Track</button>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" (click)="addDrumTrack()">
          <i-lucide [img]="DrumIcon" class="inline-block w-4 h-4 -mt-1 mr-1"></i-lucide>
          Add Drum Track</button>
      </div>
    }
    <div class="mt-4 grid grid-cols-1 gap-2">
      @for (track of sequencer().tracks; track track.id) {
        <sequencer-track [track]="track" (deleteTrack)="deleteTrack($event)" (clearTrack)="clearTrack($event)"></sequencer-track>
      }
    </div>
  `
})
export class GrooveboxComponent implements OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef;
  // icons
  readonly AudioWaveformIcon = AudioWaveform;
  readonly DrumIcon = Drum;
  readonly AudioLinesIcon = AudioLines;
  readonly PlayIcon = Play;
  readonly StopIcon = Square;
  readonly VolumeIcon = TriangleRight;
  readonly GaugeIcon = Gauge;
  readonly ArrowLeftToLine = ArrowLeftToLine;
  readonly Activity = Activity;
  // state
  audioContext!: AudioContext | undefined;
  master!: GainNode;
  lowPassFilter!: BiquadFilterNode;
  analyzer!: AnalyserNode;
  buffers!: Map<string, { buffer: AudioBuffer, offset: number }>;
  isPlaying = false;
  sequencer!: WritableSignal<Sequencer>;
  lowPassFrequency = 2000;
  lowPassQuality = 1;
  // consts
  DEFAULT_TEMPO = 125;
  LOW_PASS_MAX = 20000;
  // errors
  noContextError = signal(true);
  loadingSamplesWarning = signal(true);
  // note scheduling
  clock!: number;
  noteTime!: number;
  startTime!: number;
  currentStep!: number;
  // analyzer
  drawHandle!: number;
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
      this.noContextError.set(false);
      loadSamples(this.audioContext).then(buffers => {
        this.loadingSamplesWarning.set(false);
        this.buffers = buffers;
      });
      // set master gain
      this.master = this.audioContext.createGain();
      this.master.gain.value = this.sequencer().volume;
      // set low pass filter
      this.lowPassFilter = this.audioContext.createBiquadFilter();
      this.lowPassFilter.type = 'lowpass';
      this.LOW_PASS_MAX = this.audioContext.sampleRate / 2;
      this.lowPassFrequency = this.LOW_PASS_MAX;
      this.lowPassFilter.frequency.value = this.lowPassFrequency;
      this.lowPassFilter.Q.value = this.lowPassQuality;
      // set analyzer
      this.analyzer = this.audioContext.createAnalyser();
      this.analyzer.fftSize = 32;
      this.analyzer.maxDecibels = -10;
      // connect nodes
      this.master.connect(this.lowPassFilter);
      this.lowPassFilter.connect(this.analyzer);
      this.analyzer.connect(this.audioContext.destination);
    }
  }

  ngOnDestroy() {
    clearTimeout(this.clock);
    if (this.drawHandle) {
      cancelAnimationFrame(this.drawHandle);
    }
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying && this.audioContext) {
      this.noteTime = 0.0;
      this.startTime = this.audioContext.currentTime + 0.005;
      this.currentStep = 0;
      this.scheduleNotes();
      this.drawVisualizer();
    } else {
      clearTimeout(this.clock);
      if (this.drawHandle) {
        cancelAnimationFrame(this.drawHandle);
      }
    }
  }

  scheduleNotes() {
    if (!this.audioContext) {
      return;
    }
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
    const tracks = this.sequencer().tracks;
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (track.mute) {
        this.muteTrack(track);
        continue;
      }
      if (!track.solo && tracks.some(t => t.solo)) {
        this.muteTrack(track);
        continue;
      }
      this.setTrackVolume(track);
      if (track.type === 'SYNTH') {
        this.playSynth(playTime, track);
      } else if (track.type === 'SAMPLER' && track.sequence[this.currentStep]) {
        this.playRomplerSample(playTime, track);
      } else if (track.type === 'DRUM' && track.sequence[this.currentStep]) {
        this.playSample(playTime, track);
      }
    }
  }

  private muteTrack(track: GrooveboxTrack) {
    if (track.gain) {
      track.gain.gain.value = 0;
    }
  }

  private setTrackVolume(track: GrooveboxTrack) {
    if (track.gain) {
      track.gain.gain.value = track.volume;
    }
  }

  playSample(when: number, track: DrumTrack) {
    if (!this.audioContext) {
      return;
    }
    const source = this.audioContext.createBufferSource();
    source.buffer = this.buffers.get(track.sample)?.buffer || null;
    source.connect(track.gain);
    track.gain.connect(this.master);
    source.start(when || 0);
  }

  playRomplerSample(when: number, track: SamplerTrack) {
    const note = track.sequence[this.currentStep];
    if (!this.audioContext || !note.note) {
      return;
    }
    if (note.note === '-') {
      return;
    }
    const source = this.audioContext.createBufferSource();
    const { buffer, offset } = this.buffers.get(track.sample) || { buffer: null, offset: 0 };
    source.buffer = buffer;
    // pitch by offset
    source.detune.value = (note.note - offset) * 100;
    const envelope = this.audioContext.createGain();
    envelope.gain.value = 0;
    source.connect(envelope);
    envelope.connect(track.gain);
    track.gain.connect(this.master);
    // set start
    source.start(when || 0);
    startEnvelope(envelope, track.envelope.attack, track.envelope.decay, track.envelope.sustain, when);
    // set end
    const duration = this.calculateNoteDuration(track);
    endEnvelope(envelope, track.envelope.release, when + duration);
    source.stop(when + duration + track.envelope.release);
  }

  playSynth(when: number, track: SynthTrack) {
    const note = track.sequence[this.currentStep];
    if (!this.audioContext || !note?.note) {
      return;
    }
    if (note.note === '-') {
      return;
    }
    const Patch: Patches = PATCHES.get(track.patch) || BornSlippyPatch;
    const source = new Patch(this.audioContext);
    source.connect(track.gain);
    source.frequency = note.frequency || 440;
    track.gain.connect(this.master);
    source.start(when || 0);
    source.stop(when + this.calculateNoteDuration(track));
  }

  private calculateNoteDuration(track: SynthTrack | SamplerTrack) {
    let nextPos = (this.currentStep + 1) % 16;
    let duration = this.tic;
    while (track.sequence[nextPos] && track.sequence[nextPos].note === '-') {
      duration += this.tic;
      nextPos = (nextPos + 1) % 16;
    }
    return duration;
  }

  addSynthTrack() {
    if (this.audioContext) {
      this.sequencer().tracks.push(createSynthTrack(this.audioContext));
    }
  }

  addDrumTrack() {
    if (this.audioContext) {
      this.sequencer().tracks.push(createDrumTrack(this.audioContext));
    }
  }

  addSamplerTrack() {
    if (this.audioContext) {
      this.sequencer().tracks.push(createSamplerTrack(this.audioContext));
    }
  }

  deleteTrack(id: string) {
    const track = this.sequencer().tracks.find(track => track.id === id);
    if (track) {
      track.gain.disconnect();
      this.sequencer().tracks = this.sequencer().tracks.filter(track => track.id !== id);
    }
  }

  clearTrack(id: string) {
    const index = this.sequencer().tracks.findIndex(track => track.id === id);
    if (index !== -1) {
      // intentional slow operation that creates immutable state
      this.sequencer().tracks[index] = {
        ...this.sequencer().tracks[index],
        sequence: []
      }
    }
  }

  updateMasterVolume(volume: number) {
    this.sequencer().volume = volume;
    this.master.gain.value = volume;
  }

  updateTempo(tempo: number) {
    this.sequencer().tempo = tempo;
    this.calculateTic();
  }

  setLowPassFrequency(frequency: number) {
    this.lowPassFilter.frequency.value = frequency;
  }

  setLowPassQuality(quality: number) {
    this.lowPassFilter.Q.value = quality;
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
        barHeight = dataArray[i] / 4;

        canvasCtx.fillStyle = `rgb(30 46 ${barHeight * 4})`;
        canvasCtx.fillRect(x, canvas.height - barHeight / 1.5, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();
  }

  private calculateTic() {
    this.tic = stepBpmDuration(this.sequencer().tempo);
  }
}
