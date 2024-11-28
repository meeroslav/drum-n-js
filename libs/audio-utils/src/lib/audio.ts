import { DRUM_SAMPLES, ROMPLER_NAMES, ROMPLER_SAMPLES } from './constants';

export function createAudioContext() {
  const AudioContext = globalThis.window?.AudioContext || (globalThis.window as any)?.webkitAudioContext;
  if (AudioContext) {
    return new AudioContext();
  }
  return undefined;
};

export async function fetchAndDecodeAudio(url: string, context: AudioContext): Promise<AudioBuffer> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await context.decodeAudioData(arrayBuffer);
}

export async function loadSamples(context: AudioContext): Promise<Map<string, { buffer: AudioBuffer, offset: number }>> {
  const sampleLoaders: Map<string, { buffer: AudioBuffer, offset: number }> = new Map();
  for (let i = 0; i < DRUM_SAMPLES.length; i++) {
    const sample = DRUM_SAMPLES[i];
    const buffer = await fetchAndDecodeAudio(`samples/drums/${sample}.wav`, context);
    sampleLoaders.set(sample, { buffer, offset: 0 });
  }
  for (let i = 0; i < ROMPLER_NAMES.length; i++) {
    const sample = ROMPLER_NAMES[i];
    const buffer = await fetchAndDecodeAudio(`samples/instruments/${sample}.wav`, context);
    sampleLoaders.set(sample, { buffer, offset: ROMPLER_SAMPLES[sample]?.offset || 0 });
  }
  return sampleLoaders;
}
