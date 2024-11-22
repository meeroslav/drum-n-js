import Tuna from 'tunajs';

export function startEnvelope(envelopeNode: GainNode, attack: number, decay: number, sustain: number, when?: number) {
  const startTime = when ?? envelopeNode.context.currentTime;
  envelopeNode.gain.setValueAtTime(0, startTime);
  envelopeNode.gain.linearRampToValueAtTime(1, startTime + attack);
  envelopeNode.gain.linearRampToValueAtTime(sustain, startTime + attack + decay);
}

export function endEnvelope(envelopeNode: GainNode, release: number, when?: number) {
  const endTime = when ?? envelopeNode.context.currentTime;
  envelopeNode.gain.linearRampToValueAtTime(0, endTime + release);
}

// Most basic audio patch
export class SimplePatch {
  private _frequency = 0;
  private _osc: OscillatorNode;
  private _master: GainNode;

  constructor(context: AudioContext, type: OscillatorNode['type'] = 'triangle') {
    this._osc = context.createOscillator();
    this._osc.type = type;
    this._master = context.createGain();
    this._osc.connect(this._master);
  }

  start(when?: number) {
    when = when ?? this._master.context.currentTime;
    this._osc.start(when);
  }

  stop(when?: number) {
    when = when ?? this._master.context.currentTime;
    this._osc.stop(when);
  }

  connect(target: AudioNode) {
    this._master.connect(target);
  }

  disconnect(target: AudioNode) {
    this._master.connect(target);
  }

  get frequency() {
    return this._frequency;
  }

  set frequency(newFrequency: number) {
    this._frequency = newFrequency;
    this._osc.frequency.value = newFrequency;
  }
}

export class BornSlippyPatch {
  private _frequency = 0;
  private _oscillators: OscillatorNode[];
  private _master: GainNode;
  private _envelope: GainNode;

  constructor(context: AudioContext) {
    this._oscillators = [
      createOscillator('triangle', context),
      createOscillator('triangle', context),
      createOscillator('triangle', context),
    ];
    this._oscillators[1].detune.value = -6;
    this._oscillators[2].detune.value = 6;
    this._master = context.createGain();
    this._master.gain.value = 0.7;
    this._envelope = context.createGain();
    const tuna = new Tuna(context);
    const moog = new tuna.MoogFilter({
      cutoff: 0.165,    // 0 to 1
      resonance: 1.5,   // 0 to 4
      bufferSize: 4096,  // 256 to 16384, NOT INCLUDED AS EDITABLE!
    });
    const delay = new tuna.Delay({
      delayTime: 300,    // 1 to 10000 milliseconds
      feedback: 0.45,    // 0 to 1+
      dryLevel: 1,                            // 0 to 1+
      wetLevel: 0.6,                            // 0 to 1+
    });
    this._oscillators.forEach(osc => {
      osc.connect(this._envelope);
    });
    this._envelope.connect(moog);
    moog.connect(delay);
    delay.connect(this._master);
  }

  start(when?: number) {
    when = when ?? this._master.context.currentTime;
    this._oscillators.forEach(osc => {
      startEnvelope(this._envelope, 0.01, 0.5, 0.5);
      // start
      osc.start(when);
    });
  }

  stop(when?: number) {
    when = when ?? this._master.context.currentTime;
    this._oscillators.forEach(osc => {
      endEnvelope(this._envelope, 1);
      osc.stop(when + 1);
    });
  }

  connect(target: AudioNode) {
    this._master.connect(target);
  }

  disconnect(target: AudioNode) {
    this._master.connect(target);
  }

  get frequency() {
    return this._frequency;
  }

  set frequency(newFrequency: number) {
    this._frequency = newFrequency;
    this._oscillators.forEach(osc => {
      osc.frequency.value = newFrequency;
    });
  }
}

// helper function
function createOscillator(type: OscillatorNode['type'], context: AudioContext): OscillatorNode {
  const oscNode = context.createOscillator()
  oscNode.type = type;
  return oscNode
}
