import { DRUM_SAMPLES } from '@drum-n-js/audio-utils';

export type GrooveboxTrack = SynthTrack | DrumTrack;

export type TrackBase = {
  id: string;
  volume: number;
  reverb: number;
  solo: boolean;
  mute: boolean;
}

export type SynthTrack = {
  type: 'SYNTH';
  patch: ArrayElement<typeof PATCHES>;
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  sequence: SynthNote[];
} & TrackBase;

export type SynthNote = {
  note: number | undefined | '-';
  frequency?: number;
};

export type DrumTrack = {
  type: 'DRUM';
  sample: ArrayElement<typeof DRUM_SAMPLES>;
  sequence: boolean[];
} & TrackBase;

export type Sequencer = {
  tempo: number;
  volume: number;
  tracks: GrooveboxTrack[];
};

export const PATCHES = ['bass', 'pad'];
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Helper Typescript type
type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;


