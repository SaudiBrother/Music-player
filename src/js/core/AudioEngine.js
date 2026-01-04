/**
 * Audio Engine - Mengelola Web Audio API & Equalizer
 */
class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.media = null;
        this.filters = [];
        this.gainNode = null;
        this.isInitialized = false;
        
        // Equalizer frequencies (Hz)
        this.frequencies = [60, 150, 400, 1000, 2400, 6000, 8000, 10000, 12000, 16000];
        
        // EQ Presets
        this.presets = {
            flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bass: [10, 8, 5, 2, 0, -2, -3, -2, 0, 0],
            treble: [-2, -3, -2, 0, 2, 5, 8, 10, 8, 6],
            vocal: [0, -3, -2, 2, 4, 3, 1, -1, -2, -3],
            pop: [3, 2, 0, -2, -2, 0, 2, 5, 4, 2],
            rock: [5, 3, 1, 0, -2, -1, 2, 5, 6, 5]
        };
        
        // Current EQ values
        this.eqValues = [...this.presets.flat];
        
        this.init();
    }

    init() {
        try {
            const audioContextClass = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new audioContextClass({
                sampleRate: 44100,
                latencyHint: 'playback'
            });

            // Create nodes
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = 0.85;

            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = 0.7;

            // Initialize filters
            this.initializeFilters();

            // Connect nodes
            this.gainNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);

            this.isInitialized = true;
            console.log('✓ Audio Engine initialized');
        } catch (error) {
            console.error('✗ Audio context error:', error);
        }
    }

    initializeFilters() {
        // Create biquad filter untuk setiap frekuensi
        this.filters = this.frequencies.map((freq, index) => {
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'peaking';
            filter.frequency.value = freq;
            filter.Q.value = 1.0;
            filter.gain.value = 0;

            // Connect filters in series
            if (index === 0) {
                filter.connect(this.gainNode);
            } else {
                filter.connect(this.filters[index - 1]);
            }

            return filter;
        });
    }

    setMedia(audioElement) {
        if (!this.isInitialized) {
            console.warn('Audio Engine not initialized');
            return;
        }

        try {
            if (this.source) {
                this.source.disconnect();
            }

            this.media = audioElement;
            this.source = this.audioContext.createMediaElementSource(audioElement);
            
            // Connect ke filter chain
            this.source.connect(this.filters[this.filters.length - 1]);
            
            console.log('✓ Media connected');
        } catch (error) {
            console.error('✗ Media connection error:', error);
        }
    }

    /**
     * Set EQ gain untuk frequency tertentu
     * @param {number} index - Index filter (0-9)
     * @param {number} gain - Gain value (-12 to +12 dB)
     */
    setEQGain(index, gain) {
        if (index < 0 || index >= this.filters.length) return;

        // Smooth gain transition
        const now = this.audioContext.currentTime;
        this.filters[index].gain.setTargetAtTime(gain, now, 0.01);
        this.eqValues[index] = gain;
    }

    /**
     * Apply EQ preset
     */
    applyPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) return;

        preset.forEach((gain, index) => {
            this.setEQGain(index, gain);
        });

        this.eqValues = [...preset];
    }

    /**
     * Reset semua EQ ke flat
     */
    resetEQ() {
        this.applyPreset('flat');
    }

    /**
     * Get frequency data untuk visualizer
     */
    getFrequencyData() {
        if (!this.analyser) return new Uint8Array(0);
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);
        return dataArray;
    }

    /**
     * Get time domain data untuk visualizer
     */
    getWaveformData() {
        if (!this.analyser) return new Uint8Array(0);
        const dataArray = new Uint8Array(this.analyser.fftSize);
        this.analyser.getByteTimeDomainData(dataArray);
        return dataArray;
    }

    /**
     * Set volume (0-100)
     */
    setVolume(value) {
        const normalized = value / 100;
        const now = this.audioContext.currentTime;
        this.gainNode.gain.setTargetAtTime(normalized, now, 0.01);
    }

    /**
     * Resume audio context jika diperlukan
     */
    resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('✓ Audio context resumed');
            });
        }
    }

    /**
     * Get current EQ values
     */
    getEQValues() {
        return [...this.eqValues];
    }

    /**
     * Get current volume (0-100)
     */
    getVolume() {
        return this.gainNode.gain.value * 100;
    }

    /**
     * Get analyser
     */
    getAnalyser() {
        return this.analyser;
    }
}

// Singleton instance
const audioEngine = new AudioEngine();
