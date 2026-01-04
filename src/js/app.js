/**
 * Main Application - Mengintegrasikan semua module
 */
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audio');
        this.isPlaying = false;
        this.currentPlaylist = [];
        this.currentIndex = 0;
        this.repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one
        this.isShuffle = false;

        // Initialization
        this.init();
    }

    init() {
        console.log('🎵 Music Player Pro - Initializing...');

        // Set audio engine
        audioEngine.setMedia(this.audio);

        // Setup event listeners
        this.setupAudioEvents();
        this.setupUIEvents();
        this.setupKeyboardShortcuts();

        // Build UI
        this.buildUI();

        // Initialize file handler
        fileHandler.onFilesAdded = (playlist) => this.onPlaylistUpdated(playlist);

        console.log('✓ Music Player initialized successfully');
        console.log('✓ Ready for audio playback');
    }

    setupAudioEvents() {
        // Metadata loaded
        this.audio.addEventListener('loadedmetadata', () => {
            const duration = this.audio.duration;
            const track = fileHandler.getCurrentTrack();
            if (track) {
                domBuilder.updateTrackInfo(
                    track.name,
                    'Music Player Pro',
                    0,
                    duration
                );
            }
        });

        // Time update - optimized dengan RAF
        let lastUpdateTime = 0;
        this.audio.addEventListener('timeupdate', () => {
            const now = performance.now();
            if (now - lastUpdateTime > 100) { // Update setiap 100ms max
                lastUpdateTime = now;
                domBuilder.updateProgress(this.audio.currentTime, this.audio.duration);
            }
        });

        // Play
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            domBuilder.updatePlayButton(true);
            visualizer.start();
            audioEngine.resumeContext();

            // Update frequency data continuously
            this.updateVisualizerData();
        });

        // Pause
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            domBuilder.updatePlayButton(false);
            visualizer.stop();
        });

        // Ended
        this.audio.addEventListener('ended', () => {
            this.playNext();
        });

        // Error handling
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            alert('Error loading audio file');
        });
    }

    setupUIEvents() {
        const elements = domBuilder.getElements();

        // Play/Pause
        elements.playBtn.addEventListener('click', () => {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        });

        // Previous/Next
        elements.prevBtn.addEventListener('click', () => this.playPrevious());
        elements.nextBtn.addEventListener('click', () => this.playNext());

        // Shuffle
        elements.shuffleBtn.addEventListener('click', () => {
            this.toggleShuffle();
        });

        // Repeat
        elements.repeatBtn.addEventListener('click', () => {
            this.toggleRepeat();
        });

        // Volume
        elements.volumeSlider.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            audioEngine.setVolume(volume);
            domBuilder.updateVolume(volume);
        });

        // Progress bar
        document.querySelector('.progress-bar').addEventListener('click', (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.audio.currentTime = percent * this.audio.duration;
        });

        // Panel buttons
        elements.eqBtn.addEventListener('click', () => {
            domBuilder.togglePanel('eq');
        });

        elements.themeBtn.addEventListener('click', () => {
            domBuilder.togglePanel('theme');
        });

        elements.playlistBtn.addEventListener('click', () => {
            domBuilder.togglePanel('playlist');
        });

        // EQ sliders (delegated)
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('eq-slider')) {
                const index = parseInt(e.target.closest('.eq-slider-group').getAttribute('data-index'));
                const gain = parseFloat(e.target.value);
                audioEngine.setEQGain(index, gain);
                domBuilder.updateEQValue(index, gain);
            }
        });

        // EQ presets
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('preset-btn')) {
                const preset = e.target.getAttribute('data-preset');
                audioEngine.applyPreset(preset);
                this.updateEQSliders();

                // Visual feedback
                document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            }
        });

        // Theme options (delegated)
        document.addEventListener('click', (e) => {
            const themeOption = e.target.closest('.theme-option');
            if (themeOption) {
                const themeId = themeOption.getAttribute('data-theme');
                themeManager.applyTheme(themeId);
                domBuilder.updateActiveTheme(themeId);
            }
        });

        // Playlist items (delegated)
        document.addEventListener('click', (e) => {
            const playlistItem = e.target.closest('.playlist-item');
            if (playlistItem && !e.target.closest('.playlist-item-remove')) {
                const index = parseInt(playlistItem.getAttribute('data-index'));
                this.playTrack(index);
            }

            const removeBtn = e.target.closest('.playlist-item-remove');
            if (removeBtn) {
                const index = parseInt(removeBtn.closest('.playlist-item').getAttribute('data-index'));
                fileHandler.removeTrack(index);
                this.onPlaylistUpdated(fileHandler.getPlaylist());
            }
        });

        // Clear playlist
        document.querySelector('.btn-clear')?.addEventListener('click', () => {
            if (confirm('Hapus semua musik dari playlist?')) {
                fileHandler.clearPlaylist();
                this.audio.src = '';
                this.isPlaying = false;
                domBuilder.updatePlayButton(false);
                domBuilder.buildPlaylist([]);
                domBuilder.updateTrackInfo('Pilih musik untuk dimulai', 'Music Player Pro', 0, 0);
                document.getElementById('dropZone').style.display = 'flex';
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ignore jika focus di input
            if (document.activeElement.tagName === 'INPUT') return;

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    this.isPlaying ? this.pause() : this.play();
                    break;
                case 'ArrowRight':
                    this.playNext();
                    break;
                case 'ArrowLeft': 
                    this.playPrevious();
                    break;
            }
        });
    }

    /**
     * Build initial UI
     */
    buildUI() {
        // Build equalizer
        domBuilder.buildEqualizer(audioEngine.frequencies);

        // Build theme grid
        domBuilder.buildThemeGrid(themeManager.getThemes());

        // Update active theme
        domBuilder.updateActiveTheme(themeManager.getCurrentTheme());

        // Build empty playlist
        domBuilder.buildPlaylist([]);
    }

    /**
     * Play track by index
     */
    playTrack(index) {
        if (!fileHandler.setCurrentIndex(index)) {
            console.warn('Invalid track index');
            return;
        }

        const track = fileHandler.getCurrentTrack();
        if (!track) return;

        this.audio.src = track.url;
        this.audio.play().catch(e => {
            console.error('Play error:', e);
            audioEngine.resumeContext();
            this.audio.play();
        });

        domBuilder.updateActivePlaylistItem(index);
        console.log(`▶ Playing: ${track.name}`);
    }

    /**
     * Play current track
     */
    play() {
        if (!this.audio.src) {
            console.warn('No track selected');
            return;
        }

        this.audio.play().catch(e => {
            console.error('Play error:', e);
            audioEngine.resumeContext();
            this.audio.play();
        });
    }

    /**
     * Pause
     */
    pause() {
        this.audio.pause();
    }

    /**
     * Next track
     */
    playNext() {
        let nextIndex = this.currentIndex + 1;

        if (this.isShuffle) {
            nextIndex = Math.floor(Math.random() * fileHandler.getPlaylistLength());
        } else if (nextIndex >= fileHandler.getPlaylistLength()) {
            if (this.repeatMode === 1) { // Repeat all
                nextIndex = 0;
            } else {
                return; // Stop at end
            }
        }

        this.currentIndex = nextIndex;
        this.playTrack(nextIndex);
    }

    /**
     * Previous track
     */
    playPrevious() {
        let prevIndex = this.currentIndex - 1;

        if (prevIndex < 0) {
            if (this.repeatMode === 1) { // Repeat all
                prevIndex = fileHandler.getPlaylistLength() - 1;
            } else {
                return;
            }
        }

        this.currentIndex = prevIndex;
        this.playTrack(prevIndex);
    }

    /**
     * Toggle shuffle
     */
    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        domBuilder.updateButtonState(
            domBuilder.getElement('shuffleBtn'),
            this.isShuffle
        );
        console.log(`🔀 Shuffle: ${this.isShuffle ? 'ON' : 'OFF'}`);
    }

    /**
     * Toggle repeat
     */
    toggleRepeat() {
        this.repeatMode = (this.repeatMode + 1) % 3;
        const repeatBtn = domBuilder.getElement('repeatBtn');

        if (this.repeatMode === 0) {
            repeatBtn.classList.remove('active');
        } else if (this.repeatMode === 1) {
            repeatBtn.classList.add('active');
        } else {
            repeatBtn.classList.add('active');
        }

        const modes = ['OFF', 'ALL', 'ONE'];
        console.log(`🔁 Repeat: ${modes[this.repeatMode]}`);
    }

    /**
     * Update visualizer data continuously
     */
    updateVisualizerData() {
        if (!this.isPlaying) return;

        const dataArray = audioEngine.getFrequencyData();
        visualizer.updateData(dataArray);

        requestAnimationFrame(() => this.updateVisualizerData());
    }

    /**
     * Update EQ sliders display
     */
    updateEQSliders() {
        const values = audioEngine.getEQValues();
        document.querySelectorAll('.eq-slider').forEach((slider, index) => {
            slider.value = values[index];
            domBuilder.updateEQValue(index, values[index]);
        });
    }

    /**
     * Handle playlist update
     */
    onPlaylistUpdated(playlist) {
        this.currentPlaylist = playlist;
        domBuilder.buildPlaylist(playlist);
        if (playlist.length > 0) {
            this.playTrack(0);
        }
    }
}

// Initialize app saat DOM siap
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MusicPlayer();

    // Expose to window for debugging
    window.musicPlayer = app;
    window.audioEngine = audioEngine;
    window.fileHandler = fileHandler;
    window.themeManager = themeManager;
    window.visualizer = visualizer;

    console.log('%c🎵 Music Player Pro', 'font-size:20px; font-weight:bold; color:#00d4ff;');
    console.log('%cReady to play music!', 'color:#00ff88; font-size:14px;');
});
