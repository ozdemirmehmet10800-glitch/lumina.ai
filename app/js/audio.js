/**
 * LUMINA AUDIO ENGINE
 * Procedural ambient soundscapes & chimes using pure Web Audio API.
 * No external audio files or internet connection required.
 */

class LuminaAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.activeNodes = {
      rain: null,
      fire: null,
      wind: null,
      binaural: null
    };
    this.volumes = {
      rain: 0.5,
      fire: 0.5,
      wind: 0.5,
      binaural: 0.5
    };
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Rain Generator (Filtered Pink Noise with modulation) ---
  toggleRain(enable, volume = this.volumes.rain) {
    this.initContext();
    if (this.activeNodes.rain) {
      this.stopSound('rain');
      if (!enable) return false;
    }

    if (enable) {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      whiteNoise.start(0);
      this.activeNodes.rain = { source: whiteNoise, gain, filter };
      return true;
    }
    return false;
  }

  // --- Fireplace Generator (Crackles and warmth) ---
  toggleFire(enable, volume = this.volumes.fire) {
    this.initContext();
    if (this.activeNodes.fire) {
      this.stopSound('fire');
      if (!enable) return false;
    }

    if (enable) {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);

      // Low rumble
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 2.5;
        // Random micro pops
        if (Math.random() < 0.0006) {
          data[i] += (Math.random() * 1.5 - 0.75);
        }
      }

      const source = this.ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.6, this.ctx.currentTime);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      source.start(0);
      this.activeNodes.fire = { source, gain };
      return true;
    }
    return false;
  }

  // --- Forest Wind Generator ---
  toggleWind(enable, volume = this.volumes.wind) {
    this.initContext();
    if (this.activeNodes.wind) {
      this.stopSound('wind');
      if (!enable) return false;
    }

    if (enable) {
      const bufferSize = this.ctx.sampleRate * 3;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const source = this.ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(450, this.ctx.currentTime);
      bandpass.Q.setValueAtTime(2.0, this.ctx.currentTime);

      // LFO for gentle wind oscillation
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(bandpass.frequency);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.35, this.ctx.currentTime);

      source.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.masterGain);

      source.start(0);
      lfo.start(0);
      this.activeNodes.wind = { source, lfo, gain };
      return true;
    }
    return false;
  }

  // --- Binaural Alpha Focus Wave (14 Hz Alpha beat) ---
  toggleBinaural(enable, volume = this.volumes.binaural) {
    this.initContext();
    if (this.activeNodes.binaural) {
      this.stopSound('binaural');
      if (!enable) return false;
    }

    if (enable) {
      const merger = this.ctx.createChannelMerger(2);

      const oscL = this.ctx.createOscillator();
      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(216, this.ctx.currentTime); // Left ear

      const oscR = this.ctx.createOscillator();
      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(230, this.ctx.currentTime); // Right ear (14Hz Alpha difference)

      const gainL = this.ctx.createGain();
      gainL.gain.setValueAtTime(0.12 * volume, this.ctx.currentTime);
      const gainR = this.ctx.createGain();
      gainR.gain.setValueAtTime(0.12 * volume, this.ctx.currentTime);

      oscL.connect(gainL);
      gainL.connect(merger, 0, 0);

      oscR.connect(gainR);
      gainR.connect(merger, 0, 1);

      const masterWaveGain = this.ctx.createGain();
      masterWaveGain.gain.setValueAtTime(volume * 0.5, this.ctx.currentTime);

      merger.connect(masterWaveGain);
      masterWaveGain.connect(this.masterGain);

      oscL.start();
      oscR.start();

      this.activeNodes.binaural = { oscL, oscR, gain: masterWaveGain };
      return true;
    }
    return false;
  }

  setVolume(soundType, val) {
    this.volumes[soundType] = val;
    if (this.activeNodes[soundType] && this.activeNodes[soundType].gain) {
      const multiplier = soundType === 'rain' ? 0.4 : soundType === 'wind' ? 0.35 : 0.5;
      this.activeNodes[soundType].gain.gain.setTargetAtTime(val * multiplier, this.ctx.currentTime, 0.05);
    }
  }

  stopSound(type) {
    const node = this.activeNodes[type];
    if (node) {
      try {
        if (node.source) node.source.stop();
        if (node.lfo) node.lfo.stop();
        if (node.oscL) node.oscL.stop();
        if (node.oscR) node.oscR.stop();
      } catch (e) {
        // Node might already be stopped
      }
      this.activeNodes[type] = null;
    }
  }

  stopAll() {
    Object.keys(this.activeNodes).forEach(type => this.stopSound(type));
  }

  // --- Pleasant Bell Chime (for task completion or timer finish) ---
  playChime(type = 'complete') {
    this.initContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'complete') {
      // Ascending chord (C5 -> E5 -> G5)
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, now + idx * 0.08);

        g.gain.setValueAtTime(0, now + idx * 0.08);
        g.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.8);

        o.connect(g);
        g.connect(this.masterGain);

        o.start(now + idx * 0.08);
        o.stop(now + idx * 0.08 + 0.85);
      });
    } else if (type === 'timerEnd') {
      // Gentle meditation bell
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 2.6);
    }
  }
}

// Global Audio Engine Instance
window.LuminaAudio = new LuminaAudioEngine();
