import { DRUM_SAMPLES } from './constants';

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

export async function loadDrumSamples(context: AudioContext): Promise<Record<string, AudioBuffer>> {
  const sampleLoaders: Record<string, AudioBuffer> = {};
  DRUM_SAMPLES.forEach(async sample => sampleLoaders[sample] = await fetchAndDecodeAudio(`samples/drums/${sample}.wav`, context));
  return sampleLoaders;
}

export function createSourceAndPlay(ctx: AudioContext, audioBuffer: AudioBuffer): AudioBufferSourceNode {
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ctx.destination);
  source.start(0);
  return source;
}

export function stopSource(source: AudioBufferSourceNode) {
  if (source) {
    source.stop();
  }
}

export function stepBpmDuration(bpm: number): number {
  return 60 / bpm;
}
