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
    }

    setupAudioEvents() {
        // Metadata loaded
        this.audio.addEventListener('loadedmetadata', () => {
            const duration = this.audio.duration;
            const track = this.currentPlaylist[this.currentIndex];
            if (track) {
                domBuilder.updateTrackInfo(track.name, 'Music Player Pro', 0, duration);
            }
        });

        // Time update
        this.audio.addEventListener('timeupdate', () => {
            if (!this.audio.paused) {
                domBuilder.updateProgress(this.audio.currentTime, this.audio.duration);
            }
        });

        // Track ended
        this.audio.addEventListener('ended', () => {
            if (this.repeatMode === 2) {
                this.playTrack(this.currentIndex);
            } else {
                this.nextTrack();
            }
        });
    }

    setupUIEvents() {
        const ui = domBuilder.getElements();

        // --- FITUR UPLOAD MANUAL (PERBAIKAN) ---
        if (ui.manualUploadBtn && ui.fileInput) {
            ui.manualUploadBtn.addEventListener('click', () => {
                ui.fileInput.click(); // Trigger jendela file browser
            });

            ui.fileInput.addEventListener('change', (e) => {
                // Mengirim file yang dipilih ke FileHandler
                fileHandler.handleFileSelect(e);
            });
        }

        // Play/Pause
        ui.playBtn.addEventListener('click', () => this.togglePlay());

        // Navigation
        ui.nextBtn.addEventListener('click', () => this.nextTrack());
        ui.prevBtn.addEventListener('click', () => this.prevTrack());

        // Shuffle & Repeat
        ui.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        ui.repeatBtn.addEventListener('click', () => this.toggleRepeat());

        // Volume
        ui.volumeSlider.addEventListener('input', (e) => {
            const val = e.target.value / 100;
            audioEngine.setVolume(val);
            domBuilder.updateVolumeValue(e.target.value);
        });

        // Panel Toggles
        ui.eqBtn.addEventListener('click', () => domBuilder.togglePanel('equalizerPanel'));
        ui.themeBtn.addEventListener('click', () => domBuilder.togglePanel('themePanel'));
        ui.playlistBtn.addEventListener('click', () => domBuilder.togglePanel('playlistPanel'));

        // Clear Playlist
        ui.clearPlaylistBtn.addEventListener('click', () => {
            this.currentPlaylist = [];
            domBuilder.buildPlaylist([]);
            this.audio.src = '';
            this.isPlaying = false;
            this.updatePlayPauseIcon();
        });
    }

    togglePlay() {
        if (this.currentPlaylist.length === 0) return;

        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
        this.isPlaying = !this.isPlaying;
        this.updatePlayPauseIcon();
        this.updateVisualizerData();
    }

    updatePlayPauseIcon() {
        const ui = domBuilder.getElements();
        const playIcon = ui.playBtn.querySelector('.icon-play');
        const pauseIcon = ui.playBtn.querySelector('.icon-pause');

        if (this.isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }

    playTrack(index) {
        if (index >= 0 && index < this.currentPlaylist.length) {
            this.currentIndex = index;
            const track = this.currentPlaylist[index];
            
            const objectUrl = URL.createObjectURL(track);
            this.audio.src = objectUrl;
            this.audio.play();
            
            this.isPlaying = true;
            this.updatePlayPauseIcon();
            domBuilder.updateActivePlaylistItem(index);
            this.updateVisualizerData();
        }
    }

    nextTrack() {
        let nextIndex = this.currentIndex + 1;
        if (nextIndex >= this.currentPlaylist.length) {
            nextIndex = 0;
        }
        this.playTrack(nextIndex);
    }

    prevTrack() {
        let prevIndex = this.currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.currentPlaylist.length - 1;
        }
        this.playTrack(prevIndex);
    }

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        domBuilder.getElements().shuffleBtn.classList.toggle('active', this.isShuffle);
    }

    toggleRepeat() {
        this.repeatMode = (this.repeatMode + 1) % 3;
        const ui = domBuilder.getElements();
        ui.repeatBtn.classList.toggle('active', this.repeatMode > 0);
    }

    updateVisualizerData() {
        if (!this.isPlaying) return;
        const dataArray = audioEngine.getFrequencyData();
        if (window.visualizer) {
            visualizer.updateData(dataArray);
        }
        requestAnimationFrame(() => this.updateVisualizerData());
    }

    onPlaylistUpdated(playlist) {
        this.currentPlaylist = playlist;
        domBuilder.buildPlaylist(playlist);
        if (playlist.length > 0 && this.audio.src === '') {
            this.playTrack(0);
        }
    }

    buildUI() {
        themeManager.init();
        // Generate EQ & Theme Grid jika diperlukan
    }

    setupKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlay();
            }
        });
    }
}

// Initialize app saat DOM siap
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MusicPlayer();
    window.musicPlayer = app; // Expose ke window agar bisa diakses DOMBuilder
});
