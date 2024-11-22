import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PATCHES, SynthNote, SynthTrack, TrackBase } from '@drum-n-js/audio-utils';
import { SynthNoteComponent } from './synth-note.component';
import { AudioWaveform, LucideAngularModule } from 'lucide-angular';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'synth-track',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, SynthNoteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <ng-container *ngIf="synthTrack() as synthTrack">
  <div class="grid grid-col-1 space-y-1">
    <div class="flex items-center space-x-2">
      <h3 class="font-bold bg-blue-500 px-2">
        <i-lucide [img]="AudioWaveformIcon" class="inline-block w-4 h-4 -mt-1 mr-1"></i-lucide>
      </h3>
      <span class="text-slate-500">Patch</span>
      <select
        [(ngModel)]="synthTrack.patch"
        class="bg-slate-500 border border-fd-foreground/10 text-white text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-1 w-48">
        <option *ngFor="let patch of PATCHES" [value]="patch.name">{{ patch.name }}</option>
      </select>
      <label class="mr-4 text-slate-500" for="volume">Volume</label>
      <input class="w-32" type="range" min="0" max="1" step="0.01" [(ngModel)]="synthTrack.volume" />
    </div>
    <div class="grid grid-cols-16 gap-1">
      <synth-note [note]="synthTrack.sequence[0]" (setNote)="setNote(0, $event)"></synth-note>
      <synth-note [note]="synthTrack.sequence[1]" (setNote)="setNote(1, $event)"></synth-note>
      <synth-note [note]="synthTrack.sequence[2]" (setNote)="setNote(2, $event)"></synth-note>
      <synth-note [note]="synthTrack.sequence[3]" (setNote)="setNote(3, $event)"></synth-note>
      <synth-note [note]="synthTrack.sequence[4]" (setNote)="setNote(4, $event)"></synth-note>
      <synth-note [note]="synthTrack.sequence[5]" (setNote)="setNote(5, $event)"></synth-note>
      <synth-note [note]="synthTrack.sequence[6]" (setNote)="setNote(6, $event)"></synth-note>
      <synth-note [note]="synthTrack.sequence[7]" (setNote)="setNote(7, $event)"></synth-note>
      <synth-note [note]="synthTrack.sequence[8]" (setNote)="setNote(8, $event)"></synth-note>
      <synth-note [note]="synthTrack.sequence[9]" (setNote)="setNote(9, $event)"></synth-note>
      <synth-note [note]="synthTrack.sequence[10]" (setNote)="setNote(10, $event)"></synth-note>
      <synth-note [note]="synthTrack.sequence[11]" (setNote)="setNote(11, $event)"></synth-note>
      <synth-note [note]="synthTrack.sequence[12]" (setNote)="setNote(12, $event)"></synth-note>
      <synth-note [note]="synthTrack.sequence[13]" (setNote)="setNote(13, $event)"></synth-note>
      <synth-note [note]="synthTrack.sequence[14]" (setNote)="setNote(14, $event)"></synth-note>
      <synth-note [note]="synthTrack.sequence[15]" (setNote)="setNote(15, $event)"></synth-note>
    </div>
  </div>
  </ng-container>
  `
})
export class SynthTrackComponent {
  readonly AudioWaveformIcon = AudioWaveform;
  PATCHES = PATCHES;
  track = input.required<TrackBase>();
  synthTrack = computed(() => this.track() as SynthTrack);

  setNote = (index: number, note: SynthNote) => {
    this.synthTrack().sequence[index] = note;
  };
}
