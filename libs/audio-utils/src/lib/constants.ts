import { BornSlippyPatch, Patches, SimplePatch } from './patches';

export const LOW_PASS_MIN = 40;

// note related
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export const SEMITONE_RATIO = Math.pow(2, 1 / 12);
export const BASE_NOTE = 3;
export const ROMPLER_SAMPLES = [
  ['bass_c', BASE_NOTE, 'Slap Bass'],
  ['bass_long_f', BASE_NOTE + 5, 'Long Bass'],
  ['bass_reese', BASE_NOTE, 'Reese Bass'],
  ['lead_inner', BASE_NOTE, 'Lead Inner'],
  ['pad_hit_dmaj', BASE_NOTE + 2, 'Chord D-maj'],
  ['pad_hit_dmaj_tail', BASE_NOTE + 2, 'Chord D-maj Tail'],
  ['piano_c', BASE_NOTE, 'Piano'],
] as const;
export const ROMPLER_INDEX_SAMPLE = 0;
export const ROMPLER_INDEX_KEY = 1;
export const ROMPLER_INDEX_NAME = 2;

// synth related
export const PATCHES = [
  ['Born Slippy', BornSlippyPatch],
  ['Simple Triangle', SimplePatch]
] as const;
export const PATCH_INDEX_NAME = 0;
export const PATCH_INDEX_FUNCTION = 1;
export const PatchMap = new Map<string, Patches>(PATCHES);

// drum related
export const DRUM_SAMPLES = ['djembe_high', 'djembe_low', 'djembe_mid', 'hihat_1', 'hihat_2', 'kick', 'kicksnare', 'perc', 'vox'] as const;
