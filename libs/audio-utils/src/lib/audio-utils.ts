export const createContext = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (AudioContext) {
    return new AudioContext();
  }
  return null;
};

export const loadBuffer = async (url: string, context: AudioContext): Promise<AudioBuffer | undefined> => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await context.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.error(`Could not decode audio data in ${url}`, error);
    return undefined;
  }
};

export const createGain = (context: AudioContext, volume = 1): GainNode => {
  const filter = context.createGain();
  filter.gain.value = volume;
  return filter;
};

export const setGain = (filter: GainNode, volume: number) => {
  filter.gain.value = volume;
}

export const createPanner = (context: AudioContext, pan = 0): StereoPannerNode => {
  const filter = context.createStereoPanner();
  filter.pan.value = pan;
  return filter;
};

export const setPanner = (filter: StereoPannerNode, pan: number) => {
  filter.pan.value = pan;
}

export const createLowPass = (context: AudioContext, frequency?: number): BiquadFilterNode => {
  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = frequency || context.sampleRate / 2;
  return filter;
};

export const setLowPass = (filter: BiquadFilterNode, frequency: number) => {
  filter.frequency.value = frequency;
}

export interface EchoNode extends AudioNode {
  time: AudioParam;
  volume: AudioParam;
}

export const createEcho = (context: AudioContext, time = 0, volume = 0): EchoNode => {
  const input = context.createGain();
  const output = context.createGain();
  const delay = context.createDelay();
  const delayGain = context.createGain();
  // connect sources
  input.connect(output);
  input.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(output);
  delayGain.connect(delay);

  const setTime = (newTime: number) => {
    delay.delayTime.value = newTime;
  };

  const setVolume = (newVolume: number) => {
    delayGain.gain.value = newVolume;
  };

  setTime(time);
  setVolume(volume);

  Object.defineProperty(input, 'time', {
    get: () => delay.delayTime,
  });

  Object.defineProperty(input, 'volume', {
    get: () => delayGain.gain,
  });

  input.connect = (destination: AudioParam | AudioNode) => {
    if (destination instanceof AudioNode) {
      output.connect(destination);
      return destination;
    }
    return output;
  };

  return (input as any) as EchoNode;
};

export const setDelayTime = (echo: EchoNode, time: number) => {
  echo.time.value = time;
};

export const setDelayGain = (echo: EchoNode, volume: number) => {
  echo.volume.value = volume;
}

// export const createReverb = (context: AudioContext, time = 3, decay = 2, reverse = false): ConvolverNode => {
//   const input = context.createConvolver();
//   const output = context.createConvolver();
//   // connect sources
//   input.connect(output);

//   const setTime = (newTime: number) => {

//   };
// };

export const createOscillator = (context: AudioContext, frequency = 440): OscillatorNode => {
  const oscillator = context.createOscillator();
  oscillator.frequency.value = frequency;
  return oscillator;
};
