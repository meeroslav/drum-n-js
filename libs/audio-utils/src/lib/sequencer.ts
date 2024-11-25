import { DRUM_SAMPLES, PATCHES, ROMPLER_SAMPLES, ROMPLER_INDEX_SAMPLE, PATCH_INDEX_NAME } from './constants';

export type GrooveboxTrack = SynthTrack | DrumTrack | SamplerTrack;

export type TrackBase = {
  id: string;
  volume: number;
  reverb: number;
  solo: boolean;
  mute: boolean;
  gain: GainNode;
}

export type SynthTrack = {
  type: 'SYNTH';
  patch: (typeof PATCHES)[number][typeof PATCH_INDEX_NAME];
  sequence: SynthNote[];
} & TrackBase;

export type SynthNote = {
  note: number | undefined | '-';
  frequency?: number;
};

export type DrumTrack = {
  type: 'DRUM';
  sample: (typeof DRUM_SAMPLES)[number];
  sequence: boolean[];
} & TrackBase;

export type SamplerTrack = {
  type: 'SAMPLER';
  sample: (typeof ROMPLER_SAMPLES)[number][typeof ROMPLER_INDEX_SAMPLE];
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  sequence: SynthNote[];
} & TrackBase;

export type Sequencer = {
  tempo: number;
  volume: number;
  tracks: GrooveboxTrack[];
};

export function createDrumTrack(context: AudioContext): DrumTrack {
  return {
    id: Math.random().toString(36),
    type: 'DRUM',
    volume: 0.8,
    reverb: 0,
    solo: false,
    mute: false,
    sample: 'kick',
    gain: context.createGain(),
    sequence: []
  }
}
export function createSynthTrack(context: AudioContext): SynthTrack {
  return {
    id: Math.random().toString(36),
    type: 'SYNTH',
    volume: 0.8,
    reverb: 0,
    solo: false,
    mute: false,
    patch: 'Born Slippy',
    gain: context.createGain(),
    sequence: []
  }
}
export function createSamplerTrack(context: AudioContext): SamplerTrack {
  return {
    id: Math.random().toString(36),
    type: 'SAMPLER',
    volume: 0.8,
    reverb: 0,
    solo: false,
    mute: false,
    envelope: {
      attack: 0,
      decay: 0,
      sustain: 1,
      release: 2
    },
    sample: 'piano_c',
    gain: context.createGain(),
    sequence: [
      // { note: 6 }, { note: 1 }, { note: -2 }, { note: 6 }, { note: 1 }, { note: -2 }, { note: 6 }, { note: 1 },
      // { note: 4 }, { note: 1 }, { note: -4 }, { note: 4 }, { note: 1 }, { note: -4 }, { note: 4 }, { note: 1 }
    ]
  }
}

