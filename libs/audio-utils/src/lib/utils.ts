export function indexToFrequency(index: number): number {
  return 440 * Math.pow(2, index / 12);
}

export function frequencyToDetune(frequency = 440): number {
  return (frequency - 440) * 100;
}

export function stepBpmDuration(bpm: number): number {
  return 60 / bpm / 4;
}
