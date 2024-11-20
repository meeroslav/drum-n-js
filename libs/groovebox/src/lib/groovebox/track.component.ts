import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrumTrack, SamplerTrack, SynthTrack } from '@drum-n-js/audio-utils';
import { SynthTrackComponent } from './synth-track.component';
import { DrumTrackComponent } from './drum-track.component';
import { SamplerTrackComponent } from './sampler-track.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'sequencer-track',
  standalone: true,
  imports: [CommonModule, FormsModule, DrumTrackComponent, SynthTrackComponent, SamplerTrackComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-top space-x-2 border rounded border-fd-foreground/10 border-opacity-20 p-2 bg-gradient-to-b from-dark-blue to-light-blue">
      <div class="grid grid-col-1 space-y-1">
      <button class="border border-green-500 text-white font-bold py-1 px-2 rounded"
        [ngClass]="track().mute ? 'bg-green-500 text-dark-blue': 'text-green-500 hover:bg-green-700 text-dark-blue'"
        (click)="toggleMute()">M</button>
      <button class="border border-yellow-500 text-white font-bold py-1 px-2 rounded"
        [ngClass]="track().solo ? 'bg-yellow-500 text-dark-blue': 'text-yellow-500 hover:bg-yellow-700 text-dark-blue'"
        (click)="toggleSolo()">S</button>
      </div>
      @if (isSynth(track())) {
        <synth-track [track]="track()" class="flex-1"></synth-track>
      } @else if (isSampler(track())) {
        <sampler-track [track]="track()" class="flex-1"></sampler-track>
      } @else {
        <drum-track [track]="track()" class="flex-1"></drum-track>
      }
      <button class="border border-red-500 hover:bg-red-700 text-red-500 font-bold py-1 px-2 rounded" (click)="toggleTrack()">X</button>
    </div>
  `
})
export class SequencerTrackComponent {
  track = input.required<DrumTrack | SynthTrack | SamplerTrack>();
  deleteTrack = output<string>();

  toggleMute() {
    this.track().mute = !this.track().mute;
    if (this.track().mute) {
      this.track().solo = false;
    }
  }

  toggleSolo() {
    this.track().solo = !this.track().solo;
    console.log(this.track().solo);
    if (this.track().solo) {
      this.track().mute = false;
    }
  }

  toggleTrack() {
    this.deleteTrack.emit(this.track().id);
  }

  isSynth(track: DrumTrack | SynthTrack | SamplerTrack): track is SynthTrack {
    return track.type === 'SYNTH';
  }

  isSampler(track: DrumTrack | SynthTrack | SamplerTrack): track is SamplerTrack {
    return track.type === 'SAMPLER';
  }
}
