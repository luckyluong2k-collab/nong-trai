// js/audio.js - Quản lý nhạc nền lãng mạn & âm thanh hiệu ứng cute

class LoveAudio {
    constructor() {
        this.isPlaying = false;
        this.audioCtx = null;
        this.bgmTimer = null;
        this.customAudio = null;
        this.volume = 0.6;
        this.isCustom = false;
        this.init();
    }

    init() {
        const savedCustomUrl = window.loveStorage.get('custom_bgm_url', null);
        if (savedCustomUrl) {
            this.setCustomAudio(savedCustomUrl, false);
        }
    }

    getAudioContext() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        return this.audioCtx;
    }

    // Giai điệu Piano Lofi ngọt ngào bằng Web Audio API (Tự tạo, không phụ thuộc mạng/link ngoài)
    playProceduralBGM() {
        const ctx = this.getAudioContext();
        
        // Hợp âm lãng mạn: Cmaj7 -> Am7 -> Dm7 -> G7sus4 -> Cmaj9
        const chords = [
            [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
            [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4)
            [293.66, 349.23, 440.00, 523.25], // Dm7 (D4, F4, A4, C5)
            [196.00, 261.63, 293.66, 392.00], // G7sus4 (G3, C4, D4, G4)
            [261.63, 329.63, 392.00, 587.33]  // Cmaj9 (C4, E4, G4, D5)
        ];

        let chordIndex = 0;

        const playChord = () => {
            if (!this.isPlaying || this.isCustom) return;

            const now = ctx.currentTime;
            const currentChord = chords[chordIndex];
            chordIndex = (chordIndex + 1) % chords.length;

            currentChord.forEach((freq, i) => {
                // Arpeggio nhẹ nhàng
                const noteTime = now + (i * 0.28);
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                // Dạng sóng ấm áp (kết hợp sine & triangle)
                osc.type = i % 2 === 0 ? 'sine' : 'triangle';
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0, noteTime);
                gain.gain.linearRampToValueAtTime(0.08 * this.volume, noteTime + 0.12);
                gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 2.8);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(noteTime);
                osc.stop(noteTime + 3.0);
            });

            // Bass note trầm ấm
            const bassOsc = ctx.createOscillator();
            const bassGain = ctx.createGain();
            bassOsc.type = 'sine';
            bassOsc.frequency.setValueAtTime(currentChord[0] / 2, now);
            bassGain.gain.setValueAtTime(0.12 * this.volume, now);
            bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
            bassOsc.connect(bassGain);
            bassGain.connect(ctx.destination);
            bassOsc.start(now);
            bassOsc.stop(now + 3.5);

            this.bgmTimer = setTimeout(playChord, 3600);
        };

        playChord();
    }

    toggleBGM() {
        this.getAudioContext();

        if (this.isPlaying) {
            this.stopBGM();
            return false;
        } else {
            this.startBGM();
            return true;
        }
    }

    startBGM() {
        this.isPlaying = true;
        this.updateVinyl(true);

        if (this.isCustom && this.customAudio) {
            this.customAudio.play().catch(e => {
                console.warn('Lỗi phát custom audio, chuyển sang nhạc synth:', e);
                this.isCustom = false;
                this.playProceduralBGM();
            });
        } else {
            this.playProceduralBGM();
        }
    }

    stopBGM() {
        this.isPlaying = false;
        this.updateVinyl(false);
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
        if (this.customAudio) {
            this.customAudio.pause();
        }
    }

    setCustomAudio(url, autoPlay = true) {
        if (this.customAudio) {
            this.customAudio.pause();
            this.customAudio = null;
        }
        if (!url) {
            this.isCustom = false;
            window.loveStorage.remove('custom_bgm_url');
            if (this.isPlaying) this.playProceduralBGM();
            return;
        }

        try {
            this.customAudio = new Audio(url);
            this.customAudio.loop = true;
            this.customAudio.volume = this.volume;
            this.isCustom = true;
            window.loveStorage.set('custom_bgm_url', url);

            if (autoPlay && this.isPlaying) {
                if (this.bgmTimer) clearTimeout(this.bgmTimer);
                this.customAudio.play();
            }
        } catch (e) {
            console.error('Không thể load file âm thanh:', e);
        }
    }

    updateVinyl(spinning) {
        const vinyls = document.querySelectorAll('.vinyl-record, .music-btn');
        vinyls.forEach(v => {
            if (spinning) {
                v.classList.add('playing');
            } else {
                v.classList.remove('playing');
            }
        });
    }

    // Hiệu ứng âm thanh ngọt ngào (Sound FX)
    playPop() {
        try {
            const ctx = this.getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const now = ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(540, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
        } catch (e) {}
    }

    playHeartSound() {
        try {
            const ctx = this.getAudioContext();
            const now = ctx.currentTime;
            
            // Nhịp đập tim thình thịch 2 nhịp (Lub-Dub)
            [0, 0.18].forEach(offset => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(85, now + offset);
                osc.frequency.exponentialRampToValueAtTime(45, now + offset + 0.12);

                gain.gain.setValueAtTime(0.25, now + offset);
                gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.14);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + offset);
                osc.stop(now + offset + 0.15);
            });
        } catch (e) {}
    }

    playWin() {
        try {
            const ctx = this.getAudioContext();
            const now = ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const noteTime = now + (idx * 0.12);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0.2, noteTime);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(noteTime);
                osc.stop(noteTime + 0.45);
            });
        } catch (e) {}
    }
}

window.loveAudio = new LoveAudio();
