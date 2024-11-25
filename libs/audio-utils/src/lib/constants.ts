import { BornSlippyPatch, Patches, SimplePatch } from './patches';

export const LOW_PASS_MIN = 40;
export const BASE_NOTE = 3;

// note related
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export const SEMITONE_RATIO = Math.pow(2, 1 / 12);
export const ROMPLER_SAMPLES = [
  ['303_1_g', BASE_NOTE - 5, '303 Open'],
  ['303_2_g', BASE_NOTE - 5, '303 Closed'],
  ['bass_a', 0, 'Bass'],
  ['bass_chonk_c', BASE_NOTE - 12, 'Bass Chonk'],
  ['bass_growl_c', BASE_NOTE - 12, 'Bass Growl'],
  ['bass_long_f', BASE_NOTE - 7, 'Bass Long'],
  ['bass_reese', BASE_NOTE, 'Reese Bass'],
  ['pluck_bass_c', BASE_NOTE - 12, 'Pluck Bass'],
  ['chase_synth_c', BASE_NOTE, 'Chase Synth'],
  ['choir_c', BASE_NOTE - 12, 'Choir'],
  ['efx_game', BASE_NOTE, 'Game Efx'],
  ['funk_pad_c', BASE_NOTE, 'Funk Pad'],
  ['grider_fsharp', BASE_NOTE - 6, 'Grooverider Grawl'],
  ['lead_inner', BASE_NOTE, 'Inner Lead'],
  ['organ_d', BASE_NOTE, 'Organ'],
  ['piano_c', BASE_NOTE, 'Piano'],
  ['tashepad_c', BASE_NOTE, 'Tasche Pad'],
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
export const DRUM_SAMPLES = [
  'bd_phat',
  'bongo1',
  'bongo2',
  'clap_909',
  'clap_acoustic',
  'clap_photek',
  'conga_909',
  'djembe',
  'hh_808',
  'hh_909_2',
  'hh_909',
  'hh_brazil1',
  'hh_brazil2',
  'hh_chemical',
  'hh_photek',
  'hh_thin',
  'hhopen_909',
  'hhopen',
  'kick_brazil',
  'kick_dnb',
  'kick',
  'perc_dnb',
  'ride_909',
  'ride_r8',
  'sd_808_1',
  'sd_808_2',
  'sd_909',
  'sd_brazil',
  'sd_dnb',
  'sd_hard',
  'sd_linn',
  'sd_phat',
  'sd_rimshot',
  'shake_808',
  'vox_jah',
  'vox_yes'
] as const;
