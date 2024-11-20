
export const LOW_PASS_MIN = 40;

// note related
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export const SEMITONE_RATIO = Math.pow(2, 1 / 12);
export const BASE_NOTE = 3;
export const ROMPLER_SAMPLES = [
  { sample: 'bass_c', key: BASE_NOTE, name: 'Slap Bass' },
  { sample: 'bass_long_f', key: BASE_NOTE + 5, name: 'Long Bass' },
  { sample: 'bass_reese', key: BASE_NOTE, name: 'Reese Bass' },
  { sample: 'lead_inner', key: BASE_NOTE, name: 'Lead Inner' },
  { sample: 'pad_hit_dmaj', key: BASE_NOTE + 2, name: 'Chord D-maj' },
  { sample: 'pad_hit_dmaj_tail', key: BASE_NOTE + 2, name: 'Chord D-maj Tail' },
  { sample: 'piano_c', key: BASE_NOTE, name: 'Piano' },
] as const;

// synth related
export const PATCHES = ['bass', 'pad'] as const;

// drum related
export const DRUM_SAMPLES = ['djembe_high', 'djembe_low', 'djembe_mid', 'hihat_1', 'hihat_2', 'kick', 'kicksnare', 'perc', 'vox'] as const;
