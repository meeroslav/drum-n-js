import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { calculateOctave, calculatePosition } from './helper-functions';
import { indexToFrequency, NOTES, SynthNote } from '@drum-n-js/audio-utils';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'synth-note',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="border border-fd-foreground/10 rounded inline-block p-2 text-center text-sm w-full h-11" (click)="showPopup = !showPopup"
      [ngClass]="note() === undefined || note().note === undefined ? 'bg-fd-background/30' : 'bg-slate-500'"
    >
     {{ visualNote() }}
    </button>
    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" *ngIf="showPopup">
      <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
      <button class="fixed inset-0 z-10 w-screen overflow-y-auto" (click)="showPopup = false">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" >
          <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div class="bg-dark-blue px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div class="text-left">
                <h3 class="text-base font-semibold text-white-900" id="modal-title">Change note</h3>
                <div class="mt-2 mb-2 flex space-x-1">
                  <button class="border border-fd-foreground/10 bg-slate-500 rounded text-xs p-2" (click)="changeNote('-')">Extend</button>
                  <button class="border border-fd-foreground/10 bg-red-500 rounded text-xs p-2" (click)="changeNote(undefined)">Clear</button>
                </div>
                <label class="text-slate-500" for="note">Octave 2</label>
                <div class="mt-2 grid grid-cols-12 gap-1">
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-21)">C</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-20)">C#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-19)">D</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-18)">D#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-17)">E</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-16)">F</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-15)">F#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-14)">G</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-13)">G#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-12)">A</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-11)">A#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-10)">B</button>
                </div>
                <label class="text-slate-500" for="note">Octave 3</label>
                <div class="mt-2 grid grid-cols-12 gap-1">
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-9)">C</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-8)">C#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-7)">D</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-6)">D#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-5)">E</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-4)">F</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-3)">F#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-2)">G</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(-1)">G#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(0)">A</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(1)">A#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(2)">B</button>
                </div>
                <label class="text-slate-500" for="note">Octave 4</label>
                <div class="mt-2 grid grid-cols-12 gap-1">
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(3)">C</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(4)">C#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(5)">D</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(6)">D#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(7)">E</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(8)">F</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(9)">F#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(10)">G</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(11)">G#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(12)">A</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(13)">A#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(14)">B</button>
                </div>
                <label class="text-slate-500" for="note">Octave 5</label>
                <div class="mt-2 grid grid-cols-12 gap-1">
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(15)">C</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(16)">C#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(17)">D</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(18)">D#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(19)">E</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(20)">F</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(21)">F#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(22)">G</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(23)">G#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(24)">A</button>
                  <button class="border border-fd-foreground/30 slate-950 rounded text-xs p-1 w-full" (click)="changeNote(25)">A#</button>
                  <button class="border border-fd-foreground/30 bg-slate-200 text-slate-950 rounded text-xs p-1 w-full" (click)="changeNote(26)">B</button>
                </div>
              </div>
            </div>
          </div>
        </div>
</button>
    </div>
  `
})
export class SynthNoteComponent {
  note = input.required<SynthNote>();
  setNote = output<SynthNote>();
  showPopup = false;
  NOTES = NOTES;
  visualNote = computed(() => {
    if (this.note() !== undefined) {
      const note = this.note().note;
      if (note === undefined) {
        return '';
      }
      if (note === '-') {
        return '-';
      } else {
        return this.NOTES[calculatePosition(note)] + calculateOctave(note);
      }
    }
    return '';
  });

  changeNote = (note: number | undefined | '-') => {
    this.setNote.emit({ note, frequency: note !== undefined && note !== '-' ? indexToFrequency(note) : 0 });
  };
}
