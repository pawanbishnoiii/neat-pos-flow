// Sound effects utility using Web Audio API
const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;

let ctx: AudioContext | null = null;

const getCtx = () => {
  if (!ctx) ctx = new AudioCtx();
  return ctx;
};

const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, c.currentTime);
    gain.gain.setValueAtTime(volume, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
  } catch {
    // Silent fail
  }
};

/** Short beep for barcode scan */
export const playBeep = () => {
  playTone(1200, 0.15, 'square', 0.2);
};

/** Success chime for bill print / charge */
export const playSuccess = () => {
  const c = getCtx();
  const now = c.currentTime;
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    try {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0.25, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.3);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.3);
    } catch { /* */ }
  });
};

/** Error buzz */
export const playError = () => {
  playTone(200, 0.3, 'sawtooth', 0.15);
};
