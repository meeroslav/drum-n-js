import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrumTrack, TrackBase } from '../../../../audio-utils/src/lib/sequencer';
import { DRUM_SAMPLES } from '@drum-n-js/audio-utils';
import { LucideAngularModule, Drum } from 'lucide-angular';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'drum-track',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<ng-container *ngIf="drumTrack() as drumTrack">
  <div class="grid grid-col-1 space-y-1">
    <div class="flex items-center space-x-2 mb-1">
      <h3 class="font-bold bg-red-500 px-2">
        <i-lucide [img]="DrumIcon" class="inline-block w-4 h-4 -mt-1 mr-1"></i-lucide>
      </h3>
      <span class="text-slate-500">Sample</span>
      <select
        [(ngModel)]="drumTrack.sample"
        class="bg-slate-500 border border-fd-foreground/10 text-white text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-1 w-48">
        <option *ngFor="let sample of SAMPLES" [value]="sample">{{ sample }}</option>
      </select>
      <label class="mr-4 text-slate-500" for="volume">Volume</label>
      <input class="w-32" type="range" min="0" max="1" step="0.01" [(ngModel)]="drumTrack.volume" />
    </div>
    <div class="grid grid-cols-16 gap-1">
      <button class="border border-fd-foreground/30 rounded p-2"
        [ngClass]="drumTrack.sequence[0] ? 'bg-slate-400': 'bg-fd-background/30'"
        (click)="toggleStep(0)">
        1
      </button>
      <button class="border border-fd-foreground/10 rounded p-2"
        [ngClass]="drumTrack.sequence[1] ? 'bg-slate-500': ''"
        (click)="toggleStep(1)">
        2
      </button>
      <button class="border border-fd-foreground/10 rounded p-2"
        [ngClass]="drumTrack.sequence[2] ? 'bg-slate-500': ''"
        (click)="toggleStep(2)">
        3
      </button>
      <button class="border border-fd-foreground/10 rounded p-2"
        [ngClass]="drumTrack.sequence[3] ? 'bg-slate-500': ''"
        (click)="toggleStep(3)">
        4
      </button>
      <button class="border border-fd-foreground/30 rounded p-2"
        [ngClass]="drumTrack.sequence[4] ? 'bg-slate-400': 'bg-fd-background/30'"
        (click)="toggleStep(4)">
        5
      </button>
      <button class="border border-fd-foreground/10 rounded p-2"
        [ngClass]="drumTrack.sequence[5] ? 'bg-slate-500': ''"
        (click)="toggleStep(5)">
        6
      </button>
      <button class="border border-fd-foreground/10 rounded p-2"
        [ngClass]="drumTrack.sequence[6] ? 'bg-slate-500': ''"
        (click)="toggleStep(6)">
        7
      </button>
      <button class="border border-fd-foreground/10 rounded p-2"
        [ngClass]="drumTrack.sequence[7] ? 'bg-slate-500': ''"
        (click)="toggleStep(7)">
        8
      </button>
      <button class="border border-fd-foreground/30 rounded p-2"
        [ngClass]="drumTrack.sequence[8] ? 'bg-slate-400': 'bg-fd-background/30'"
        (click)="toggleStep(8)">
        9
      </button>
      <button class="border border-fd-foreground/10 rounded p-2"
        [ngClass]="drumTrack.sequence[9] ? 'bg-slate-500': ''"
        (click)="toggleStep(9)">
        10
      </button>
      <button class="border border-fd-foreground/10 rounded p-2"
        [ngClass]="drumTrack.sequence[10] ? 'bg-slate-500': ''"
        (click)="toggleStep(10)">
        11
      </button>
      <button class="border border-fd-foreground/10 rounded p-2"
        [ngClass]="drumTrack.sequence[11] ? 'bg-slate-500': ''"
        (click)="toggleStep(11)">
        12
      </button>
      <button class="border border-fd-foreground/30 rounded p-2"
        [ngClass]="drumTrack.sequence[12] ? 'bg-slate-400': 'bg-fd-background/30'"
        (click)="toggleStep(12)">
        13
      </button>
      <button class="border border-fd-foreground/10 rounded p-2"
        [ngClass]="drumTrack.sequence[13] ? 'bg-slate-500': ''"
        (click)="toggleStep(13)">
        14
      </button>
      <button class="border border-fd-foreground/10 rounded p-2"
        [ngClass]="drumTrack.sequence[14] ? 'bg-slate-500': ''"
        (click)="toggleStep(14)">
        15
      </button>
      <button class="border border-fd-foreground/10 rounded p-2"
        [ngClass]="drumTrack.sequence[15] ? 'bg-slate-500': ''"
        (click)="toggleStep(15)">
        16
      </button>
    </div>
  </div>
</ng-container>
  `
})
export class DrumTrackComponent {
  readonly DrumIcon = Drum;
  track = input.required<TrackBase>();
  drumTrack = computed(() => this.track() as DrumTrack);
  arr = new Array(16);
  SAMPLES = DRUM_SAMPLES;

  toggleStep(index: number) {
    this.drumTrack().sequence[index] = !this.drumTrack().sequence[index];
  }
}
