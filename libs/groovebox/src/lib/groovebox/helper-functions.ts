export function calculateOctave(note: number) {
  return Math.floor((note - 3) / 12) + 4;
}

export function calculatePosition(note: number) {
  let position = (note - 3) % 12;
  if (position < 0) {
    position = 12 + position;
  }
  return position;
}

