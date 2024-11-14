import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-oscillator',
  standalone: true,
  imports: [CommonModule],
  template: `
  <h2 class="text-4xl font-extrabold mb-4">Oscillator</h2>
  <h3>{{ selectedNote || 'Press any key to play note' }}</h3>
  `
})
export class OscillatorComponent {
  ctx!: AudioContext;
  master!: GainNode;
  noteMap = new Map<string, OscillatorNode>();
  selectedNote = '';

  constructor() {
    const AudioContext = getAudioContext();
    if (AudioContext) {
      this.ctx = new AudioContext();
      // create nodes
      this.master = this.ctx.createGain();
      // connect sources
      this.master.connect(this.ctx.destination);
    }
  }

  @HostListener('document:keydown', ['$event'])
  @HostListener('document:keyup', ['$event'])
  handleKeyEvent(event: KeyboardEvent) {
    const osc = this.noteMap.get(event.key);
    if (event.type === 'keydown') {
      if (!osc) {
        const noteIndex = KEYS.indexOf(event.key);
        this.selectedNote = NOTES[noteIndex + 3];
        if (noteIndex >= 0) {
          const freq = getHz(noteIndex - 9);
          const osc = this.createOscillator(freq);
          osc.start();
          this.noteMap.set(event.key, osc);
        }
      }
    } else {
      if (osc) {
        osc.stop();
        this.noteMap.delete(event.key);
        this.selectedNote = '';
      }
    }
  }

  createOscillator(freq: number) {
    const oscNode = this.ctx.createOscillator()
    oscNode.type = 'sawtooth';
    oscNode.frequency.value = freq;
    oscNode.connect(this.master);
    return oscNode
  }
}

function getAudioContext() {
  return globalThis.window?.AudioContext || (globalThis.window as any)?.webkitAudioContext;
}

const getHz = (n = 0) => 440 * Math.pow(2, n / 12);
const NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const KEYS = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j'];
