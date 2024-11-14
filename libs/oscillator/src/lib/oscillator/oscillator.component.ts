import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import Tuna from 'tunajs';

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
      const tuna = new Tuna(this.ctx);
      // create nodes
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      const chorus = new tuna.Chorus({
        rate: 1.5,
        feedback: 0.2,
        delay: 0.0045,
        bypass: false,
      });
      const moog = new tuna.MoogFilter({
        cutoff: 0.065,    // 0 to 1
        resonance: 3.5,   // 0 to 4
        bufferSize: 4096,  // 256 to 16384, NOT INCLUDED AS EDITABLE!
        bypass: false
      });
      const reverb = new tuna.Convolver({
        highCut: 10000,                         // 20 to 22050
        lowCut: 440,                             // 20 to 22050
        dryLevel: 1,                            // 0 to 1+
        wetLevel: 0.6,                            // 0 to 1+
        level: 1,                               // 0 to 1+, adjusts total output of both wet and dry
        impulse: 'impulse_rev.wav',            // the path to your impulse response
        bypass: false
      });
      const compressor = new tuna.Compressor({
        threshold: -10,    //-100 to 0
        makeupGain: 1,     //0 and up (in decibels)
        attack: 1,         //0 to 1000
        release: 1200,        //0 to 3000
        ratio: 4,          //1 to 20
        knee: 5,           //0 to 40
        automakeup: true,  //true/false
        bypass: false
      });
      // connect sources
      this.master.connect(chorus);
      chorus.connect(moog);
      moog.connect(compressor);
      compressor.connect(reverb);
      reverb.connect(this.ctx.destination);
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
          const freq = getHz(noteIndex - 21);
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
const KEYS = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 'p', ';', "'"];
