import { DRUM_SAMPLES, ROMPLER_SAMPLES } from './constants';

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

export async function loadSamples(context: AudioContext): Promise<Record<string, AudioBuffer>> {
  const sampleLoaders: Record<string, AudioBuffer> = {};
  DRUM_SAMPLES.forEach(async sample => sampleLoaders[sample] = await fetchAndDecodeAudio(`samples/drums/${sample}.wav`, context));
  ROMPLER_SAMPLES.forEach(async sound => sampleLoaders[sound.sample] = await fetchAndDecodeAudio(`samples/instruments/${sound.sample}.wav`, context));
  return sampleLoaders;
}
