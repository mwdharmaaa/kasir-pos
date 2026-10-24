/**
 * @file sound.js
 * @description Generator efek suara menggunakan Web Audio API murni.
 * Tanpa perlu file MP3/WAV eksternal, kita mensintesis nada langsung dari browser.
 */

class SoundEffects {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
  }

  /**
   * Menginisialisasi AudioContext secara aman saat ada interaksi pengguna
   */
  _getContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Memainkan nada sederhana (sine wave beep) saat scan atau tambah barang
   */
  playBeep() {
    if (this.isMuted) return;
    try {
      const ctx = this._getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Nada A5 (880Hz)
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (err) {
      console.warn('Audio synthesis failed:', err);
    }
  }

  /**
   * Memainkan nada akord lonceng sukses kasir (Chime Checkout Success)
   */
  playSuccess() {
    if (this.isMuted) return;
    try {
      const ctx = this._getContext();
      if (!ctx) return;

      const freqs = [523.25, 659.25, 783.99, 1046.50]; // Akord C Major (C5, E5, G5, C6)
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.35);
      });
    } catch (err) {
      console.warn('Audio synthesis failed:', err);
    }
  }

  /**
   * Memainkan nada peringatan error (stok habis / uang kurang)
   */
  playError() {
    if (this.isMuted) return;
    try {
      const ctx = this._getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(160, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (err) {
      console.warn('Audio synthesis failed:', err);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const sound = new SoundEffects();
