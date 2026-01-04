/**
 * Main Application - Mengintegrasikan semua module
 */
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audio');
        this.isPlaying = false;
        this.currentPlaylist = [];
        this.currentIndex = 0;
        this.repeatMode = 0; 
        this.isShuffle = false;

        this.init();
    }

    init() {
        // Set audio engine
        audioEngine.setMedia(this.audio);

        // Setup listeners
        this.setupAudioEvents();
        this.setupUIEvents();
        
        // Memastikan fileHandler memberi tahu app jika ada lagu baru
        fileHandler.onFilesAdded = (playlist) => {
            console.log("Lagu baru diterima:", playlist);
            this.onPlaylistUpdated(playlist);
        };
    }

    setupAudioEvents() {
        this.audio.addEventListener('timeupdate', () => {
            domBuilder.updateProgress(this.audio.currentTime, this.audio.duration);
        });

        this.audio.addEventListener('ended', () => {
            this.nextTrack();
        });
    }

    setupUIEvents() {
        const ui = domBuilder.getElements();

        // LOGIKA UPLOAD (DIPERKETAT)
        if (ui.manualUploadBtn && ui.fileInput) {
            ui.manualUploadBtn.addEventListener('click', () => ui.fileInput.click());

            ui.fileInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                if (files.length > 0) {
                    // Masukkan ke fileHandler
                    fileHandler.handleFileSelect(e);
                    // Reset input agar bisa upload file yang sama lagi jika mau
                    ui.fileInput.value = ''; 
                }
            });
        }

        // Controls
        ui.playBtn.addEventListener('click', () => this.togglePlay());
        ui.nextBtn.addEventListener('click', () => this.nextTrack());
        ui.prevBtn.addEventListener('click', () => this.prevTrack());

        // Panel Toggles
        ui.eqBtn.addEventListener('click', () => domBuilder.togglePanel('equalizerPanel'));
        ui.themeBtn.addEventListener('click', () => domBuilder.togglePanel('themePanel'));
        ui.playlistBtn.addEventListener('click', () => domBuilder.togglePanel('playlistPanel'));
        
        // Volume
        ui.volumeSlider.addEventListener('input', (e) => {
            const val = e.target.value / 100;
            audioEngine.setVolume(val);
            domBuilder.updateVolumeValue(e.target.value);
        });
    }

    onPlaylistUpdated(playlist) {
        this.currentPlaylist = playlist;
        domBuilder.buildPlaylist(playlist);

        // JIKA sedang tidak memutar lagu, langsung putar lagu pertama yang baru diupload
        if (playlist.length > 0 && (!this.audio.src || this.audio.src === "")) {
            this.playTrack(0);
        }
    }

    playTrack(index) {
        if (index >= 0 && index < this.currentPlaylist.length) {
            this.currentIndex = index;
            const file = this.currentPlaylist[index];
            
            // Buat URL sementara untuk file lokal
            const url = URL.createObjectURL(file);
            this.audio.src = url;
            
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.updatePlayPauseIcon();
                domBuilder.updateTrackInfo(file.name, "Local Storage", 0, this.audio.duration);
                domBuilder.updateActivePlaylistItem(index);
                this.updateVisualizerData();
            }).catch(err => console.error("Gagal memutar:", err));
        }
    }

    togglePlay() {
        if (!this.audio.src) return;
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
        this.isPlaying = !this.isPlaying;
        this.updatePlayPauseIcon();
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

    nextTrack() {
        this.playTrack((this.currentIndex + 1) % this.currentPlaylist.length);
    }

    prevTrack() {
        this.playTrack((this.currentIndex - 1 + this.currentPlaylist.length) % this.currentPlaylist.length);
    }

    updateVisualizerData() {
        if (!this.isPlaying) return;
        const data = audioEngine.getFrequencyData();
        if (window.visualizer) visualizer.updateData(data);
        requestAnimationFrame(() => this.updateVisualizerData());
    }
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
});
