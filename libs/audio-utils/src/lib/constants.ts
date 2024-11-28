import { BornSlippyPatch, Patches, SimplePatch } from './patches';

export const LOW_PASS_MIN = 40;
export const BASE_NOTE = 3;

// note related
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export const SEMITONE_RATIO = Math.pow(2, 1 / 12);
export const ROMPLER_SAMPLES = {
  '303_1_g': { offset: BASE_NOTE - 5, name: '303 Open' },
  '303_2_g': { offset: BASE_NOTE - 5, name: '303 Closed' },
  'bass_a': { offset: 0, name: 'Bass' },
  'bass_chonk_c': { offset: BASE_NOTE - 12, name: 'Bass Chonk' },
  'bass_growl_c': { offset: BASE_NOTE - 12, name: 'Bass Growl' },
  'bass_long_f': { offset: BASE_NOTE - 7, name: 'Bass Long' },
  'bass_reese': { offset: BASE_NOTE, name: 'Reese Bass' },
  'pluck_bass_c': { offset: BASE_NOTE - 12, name: 'Pluck Bass' },
  'chase_synth_c': { offset: BASE_NOTE, name: 'Chase Synth' },
  'choir_c': { offset: BASE_NOTE - 12, name: 'Choir' },
  'efx_game': { offset: BASE_NOTE, name: 'Game Efx' },
  'funk_pad_c': { offset: BASE_NOTE, name: 'Funk Pad' },
  'grider_fsharp': { offset: BASE_NOTE - 6, name: 'Grooverider Grawl' },
  'lead_inner': { offset: BASE_NOTE, name: 'Inner Lead' },
  'organ_d': { offset: BASE_NOTE, name: 'Organ' },
  'piano_c': { offset: BASE_NOTE, name: 'Piano' },
  'tashepad_c': { offset: BASE_NOTE, name: 'Tasche Pad' },
};
export const ROMPLER_NAMES = Array.from(Object.keys(ROMPLER_SAMPLES)) as Array<keyof typeof ROMPLER_SAMPLES>;

// synths
export const PATCHES = new Map<string, Patches>([
  ['Born Slippy', BornSlippyPatch],
  ['Simple Triangle', SimplePatch]
]);
export const PATCH_NAMES = Array.from(PATCHES.keys());

// drums
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
