
/**
 * audioHapticService.ts
 * 
 * Provides procedural sound effects using Web Audio API (no external assets required)
 * and Haptic Feedback via the Navigator Vibration API.
 */

class AudioHapticManager {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {
    // AudioContext is initialized on first user interaction to comply with browser policies
  }

  private initAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = 0.3; // Global volume
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // --- Haptics ---
  
  public vibrate(pattern: number | number[]) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }

  // --- Synthesized SFX ---

  public playClick(type: 'soft' | 'hard' = 'soft') {
    this.initAudio();
    if (this.isMuted || !this.audioCtx || !this.masterGain) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    if (type === 'soft') {
      // Soft UI Tick
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.05);
      
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
      this.vibrate(5); // Micro vibration
    } else {
      // Hard Button Press (Mechanical)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.8, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.1);
      this.vibrate(15);
    }
  }

  public playHover() {
    this.initAudio();
    if (this.isMuted || !this.audioCtx || !this.masterGain) return;
    
    // Very subtle high frequency tick
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2000, this.audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.03);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.03);
  }

  public playSuccess() {
    this.initAudio();
    if (this.isMuted || !this.audioCtx || !this.masterGain) return;

    // Ascending arpeggio
    const now = this.audioCtx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A Major
    
    notes.forEach((freq, i) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.5, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.3);
    });
    
    this.vibrate([10, 30, 10]);
  }

  public playError() {
    this.initAudio();
    if (this.isMuted || !this.audioCtx || !this.masterGain) return;

    // Dissonant buzz
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.audioCtx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.3);
    
    this.vibrate([50, 50, 50]); // Heavy vibration
  }

  public playLevelUp() {
    this.initAudio();
    if (this.isMuted || !this.audioCtx || !this.masterGain) return;
    
    // Sci-fi powerup sound (Sweep)
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = 'square';
    osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, this.audioCtx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.5);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.5);
    this.vibrate(200);
  }
}

export const audioHaptic = new AudioHapticManager();
