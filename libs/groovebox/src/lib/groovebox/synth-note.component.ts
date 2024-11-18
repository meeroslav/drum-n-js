import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NOTES, SynthNote } from './sequencer';
import { calculateOctave, calculatePosition, indexToFrequency } from './helper-functions';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'synth-note',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="border border-fd-foreground/10 rounded inline-block p-1 text-center text-sm w-8 h-8" (click)="showPopup = !showPopup">
     {{ visualNote() }}
    </button>
    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" *ngIf="showPopup">
      <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
      <button class="fixed inset-0 z-10 w-screen overflow-y-auto" (click)="showPopup = false">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" >
          <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 class="text-base font-semibold text-gray-900" id="modal-title">Change note</h3>
                  <div class="mt-2">
                    <button (click)="changeNote('-')">Extend previous</button>
                    <button (click)="changeNote(undefined)">Clear</button>
                    <button (click)="changeNote(3)">C</button>
                  </div>
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
        console.log(Math.abs((note - 3) % 12), (note - 3) % 12);
        return this.NOTES[calculatePosition(note)] + calculateOctave(note);
      }
    }
    return '';
  });

  changeNote = (note: number | undefined | '-') => {
    this.setNote.emit({ note, frequency: note !== undefined && note !== '-' ? indexToFrequency(note) : 0 });
  };
}
