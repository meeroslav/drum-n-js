import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Tuna from 'tunajs';
import { FormsModule } from '@angular/forms';
import e from 'express';

@Component({
  selector: 'lib-oscillator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <h2 class="text-4xl font-extrabold mb-4">Oscillators</h2>
  <div class="flex flex-row border rounded border-fd-foreground/10 border-opacity-20 p-2">
    <div class="basis-1/4 ml-2">
      <input id="osc1" type="checkbox" checked disabled />
      <label for="osc1" class="ml-2">Osc 1</label>
    </div>
    <div class="basis-1/4 ml-2">
      <input id="osc2" type="checkbox" [(ngModel)]="osc2Enabled" />
      <label for="osc2" class="ml-2">Osc 2</label>
    </div>
    <div class="basis-1/4 ml-2">
      <input id="osc3" type="checkbox" [(ngModel)]="osc3Enabled" />
      <label for="osc3" class="ml-2">Osc 3</label>
    </div>
  </div>
  <h3 class="text-xl font-bold mt-4 mb-2">Envelope</h3>
  <div class="flex flex-row border rounded border-fd-foreground/10 border-opacity-20 p-2">
    <div class="basis-1/2 ml-2">
      <canvas #canvas width="200" height="100"></canvas>
    </div>
    <div class="basis-1/4 ml-2">
      <div>
        <input
          class="mr-2"
          id="attack"
          [(ngModel)]="envAttack"
          type="range" min="0" max="5" step="0.01" />
          <label for="attact">Attack</label>
      </div>
      <div>
        <input
          class="mr-2"
          id="decay"
          [(ngModel)]="envDecay"
          type="range" min="0" max="5" step="0.01" />
          <label for="decay">Decay</label>
      </div>
      <div>
        <input
          class="mr-2"
          id="sustain"
          [(ngModel)]="envSustain"
          type="range" min="0" max="1" step="0.01" />
          <label for="sustain">Sustain</label>
      </div>
      <div>
        <input
          class="mr-2"
          id="release"
          [(ngModel)]="envRelease"
          type="range" min="0" max="5" step="0.01" />
          <label for="release">Release</label>
      </div>
    </div>
  </div>
  <h3 class="text-xl font-bold mt-4 mb-2">Effects</h3>
  <div class="flex flex-row border rounded border-fd-foreground/10 border-opacity-20 p-2">
    <div class="basis-1/4 ml-2">
      <input id="osc2" type="checkbox" [ngModel]="reverbEnabled" (ngModelChange)="setReverb($event)" />
      <label for="osc2" class="ml-2">Reverb</label>
    </div>
    <div class="basis-1/4 ml-2">
      <input id="osc2" type="checkbox" [ngModel]="delayEnabled" (ngModelChange)="setDelay($event)" />
      <label for="osc2" class="ml-2">Delay</label>
    </div>
    <div class="basis-1/4 ml-2">
      <input id="osc3" type="checkbox" [ngModel]="moogEnabled" (ngModelChange)="setMoog($event)" />
      <label for="osc3" class="ml-2">Moog Ladder</label>
    </div>
  </div>
  <h3 class="mt-4">{{ selectedNote || 'Press any key to play note' }}</h3>
  `
})
export class OscillatorComponent {
  @ViewChild('canvas') canvas!: ElementRef;

  ctx!: AudioContext;
  master!: GainNode;
  noteMap = new Map<string, [OscillatorNode[], GainNode]>();
  selectedNote = '';
  selectedNotes = new Set<string>();
  moog!: Tuna.TunaAudioNode;
  reverb!: Tuna.TunaAudioNode;
  compressor!: Tuna.TunaAudioNode;
  delay!: Tuna.TunaAudioNode;
  envAttack = 0;
  envDecay = 0;
  envSustain = 1;
  envRelease = 0;
  osc2Enabled = false;
  osc3Enabled = false;
  moogEnabled = false;
  reverbEnabled = false;
  delayEnabled = false;

  constructor() {
    const AudioContext = getAudioContext();
    if (AudioContext) {
      this.ctx = new AudioContext();
      const tuna = new Tuna(this.ctx);
      // create nodes
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.channelCount = 10;
      this.moog = new tuna.MoogFilter({
        cutoff: 0.165,    // 0 to 1
        resonance: 1.5,   // 0 to 4
        bufferSize: 4096,  // 256 to 16384, NOT INCLUDED AS EDITABLE!
        bypass: true
      });
      this.delay = new tuna.Delay({
        delayTime: 300,    // 1 to 10000 milliseconds
        feedback: 0.45,    // 0 to 1+
        dryLevel: 1,                            // 0 to 1+
        wetLevel: 0.6,                            // 0 to 1+
        bypass: true,    // the value 1 starts the effect as bypassed, 0 or 1
      });
      this.reverb = new tuna.Convolver({
        highCut: 10000,                         // 20 to 22050
        lowCut: 440,                             // 20 to 22050
        dryLevel: 1,                            // 0 to 1+
        wetLevel: 0.6,                            // 0 to 1+
        level: 1,                               // 0 to 1+, adjusts total output of both wet and dry
        impulse: 'impulse_rev.wav',            // the path to your impulse response
        bypass: true
      });
      this.compressor = new tuna.Compressor({
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
      this.master.connect(this.moog);
      this.moog.connect(this.delay);
      this.delay.connect(this.compressor);
      this.compressor.connect(this.reverb);
      this.reverb.connect(this.ctx.destination);
    }
  }

  @HostListener('document:keydown', ['$event'])
  @HostListener('document:keyup', ['$event'])
  handleKeyEvent(event: KeyboardEvent) {
    const note = this.noteMap.get(event.key);
    if (event.type === 'keydown') {
      if (!note) {
        const noteIndex = KEYS.indexOf(event.key);
        if (noteIndex >= 0) {
          this.selectedNotes.add(NOTES[noteIndex + 3]);
          const freq = getHz(noteIndex - 21);
          const oscillators = [this.createOscillator(freq)];
          if (this.osc2Enabled) {
            const osc2 = this.createOscillator(freq);
            osc2.detune.value = 6;
            oscillators.push(osc2);
          }
          if (this.osc3Enabled) {
            const osc3 = this.createOscillator(freq);
            osc3.detune.value = -6;
            oscillators.push(osc3);
          }
          // set volume
          this.master.gain.value = 0.7 - (oscillators.length * 0.2);
          // set envelope
          const envelope = this.ctx.createGain();
          envelope.gain.setValueAtTime(0, this.ctx.currentTime);
          envelope.gain.linearRampToValueAtTime(1, this.ctx.currentTime + this.envAttack);
          envelope.gain.linearRampToValueAtTime(this.envSustain, this.ctx.currentTime + this.envAttack + this.envDecay);
          envelope.connect(this.master);
          // start sound
          oscillators.forEach(o => o.connect(envelope));
          oscillators.forEach(o => o.start(this.ctx.currentTime));
          this.noteMap.set(event.key, [oscillators, envelope]);
        }
      }
    } else {
      if (note) {
        const [oscillators, envelope] = note;
        envelope.gain.linearRampToValueAtTime(0, this.ctx.currentTime + this.envRelease);
        oscillators.forEach(o => {
          o.stop(this.ctx.currentTime + this.envRelease);
        });
        this.noteMap.delete(event.key);
        this.selectedNotes.delete(NOTES[KEYS.indexOf(event.key) + 3]);
      }
    }
    this.selectedNote = Array.from(this.selectedNotes).sort((a, b) => NOTES.indexOf(a) > NOTES.indexOf(b) ? 1 : -1).join(' + ');
  }

  setMoog(enabled: boolean) {
    this.moog.bypass = !enabled;
  }

  setReverb(enabled: boolean) {
    this.reverb.bypass = !enabled;
  }

  setDelay(enabled: boolean) {
    this.delay.bypass = !enabled;
  }

  createOscillator(freq: number) {
    const oscNode = this.ctx.createOscillator()
    oscNode.type = 'triangle';
    oscNode.frequency.value = freq;
    return oscNode
  }
}

function getAudioContext() {
  return globalThis.window?.AudioContext || (globalThis.window as any)?.webkitAudioContext;
}

const getHz = (n = 0) => 440 * Math.pow(2, n / 12);
const NOTES = ['A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5'];
const KEYS = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 'p', ';', "'"];
