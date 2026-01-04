/**
 * Audio Engine - Mengelola pemutaran audio dan Web Audio API
 */
class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.audioElement = new Audio();
        this.source = null;
        this.analyser = null;
        this.gainNode = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.source = this.audioContext.createMediaElementSource(this.audioElement);
        this.gainNode = this.audioContext.createGain();

        this.source.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        this.analyser.fftSize = 256;
        this.initialized = true;
    }

    load(url) {
        this.audioElement.src = url;
        this.audioElement.load();
    }

    play() {
        if (this.audioContext?.state === 'suspended') {
            this.audioContext.resume();
        }
        return this.audioElement.play();
    }

    pause() {
        this.audioElement.pause();
    }

    setVolume(value) {
        if (this.gainNode) {
            this.gainNode.gain.value = value;
        }
    }

    getAnalyser() {
        return this.analyser;
    }
}

const audioEngine = new AudioEngine();
