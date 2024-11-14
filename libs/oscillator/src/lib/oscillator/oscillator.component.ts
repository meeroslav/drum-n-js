import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-oscillator',
  standalone: true,
  imports: [CommonModule],
  template: `
  <h2 class="text-4xl font-extrabold mb-4">Oscillator</h2>
  `
})
export class OscillatorComponent {
  ctx!: AudioContext;
  master!: GainNode;

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

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event.key);
  }
}

function getAudioContext() {
  return globalThis.window?.AudioContext || (globalThis.window as any)?.webkitAudioContext;
}
