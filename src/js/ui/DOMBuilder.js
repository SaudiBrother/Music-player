/**
 * DOM Builder - Membangun UI secara dinamis
 */
class DOMBuilder {
    constructor() {
        this.elements = {};
        this.cacheElements();
    }

    /**
     * Mengambil dan menyimpan referensi elemen DOM agar tidak perlu mencari ulang
     */
    cacheElements() {
        this.elements = {
            // Track Info
            trackTitle: document.querySelector('.track-title'),
            trackArtist: document.querySelector('.track-artist'),
            currentTime: document.querySelector('.current-time'),
            duration: document.querySelector('.duration'),
            progressFill: document.querySelector('.progress-fill'),
            progressHandle: document.querySelector('.progress-handle'),
            volumeValue: document.querySelector('.volume-value'),

            // Player Controls
            playBtn: document.querySelector('.btn-play-large'),
            prevBtn: document.querySelector('.btn-previous'),
            nextBtn: document.querySelector('.btn-next'),
            shuffleBtn: document.querySelector('.btn-shuffle'),
            repeatBtn: document.querySelector('.btn-repeat'),
            volumeSlider: document.querySelector('.volume-slider'),

            // Upload Elements (Kunci perbaikan agar tombol + berfungsi)
            manualUploadBtn: document.getElementById('manualUploadBtn'),
            fileInput: document.getElementById('fileInput'),

            // Panels
            equalizerPanel: document.getElementById('equalizerPanel'),
            themePanel: document.getElementById('themePanel'),
            playlistPanel: document.getElementById('playlistPanel'),
            eqSliders: document.querySelector('.eq-sliders'),
            themeGrid: document.querySelector('.theme-grid'),
            playlistItems: document.querySelector('.playlist-items'),

            // Action Buttons
            eqBtn: document.getElementById('eqBtn'),
            themeBtn: document.getElementById('themeBtn'),
            playlistBtn: document.getElementById('playlistBtn'),
            clearPlaylistBtn: document.querySelector('.btn-clear')
        };
    }

    /**
     * Memperbarui informasi lagu di layar
     */
    updateTrackInfo(title, artist, current, duration) {
        if (this.elements.trackTitle) this.elements.trackTitle.textContent = title;
        if (this.elements.trackArtist) this.elements.trackArtist.textContent = artist;
        
        this.updateProgress(current, duration);
    }

    /**
     * Memperbarui bar progress lagu
     */
    updateProgress(current, duration) {
        const percent = (current / duration) * 100 || 0;
        if (this.elements.progressFill) this.elements.progressFill.style.width = `${percent}%`;
        if (this.elements.currentTime) this.elements.currentTime.textContent = this.formatTime(current);
        if (this.elements.duration) this.elements.duration.textContent = this.formatTime(duration);
    }

    /**
     * Membangun daftar playlist secara dinamis
     */
    buildPlaylist(playlist) {
        if (!this.elements.playlistItems) return;
        
        this.elements.playlistItems.innerHTML = '';
        
        if (playlist.length === 0) {
            this.elements.playlistItems.innerHTML = '<div class="empty-playlist">Belum ada lagu</div>';
            return;
        }

        playlist.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.innerHTML = `
                <div class="track-index">${index + 1}</div>
                <div class="track-info">
                    <div class="track-name">${track.name}</div>
                    <div class="track-meta">Audio File</div>
                </div>
            `;
            item.addEventListener('click', () => {
                if (window.musicPlayer) window.musicPlayer.playTrack(index);
            });
            this.elements.playlistItems.appendChild(item);
        });
    }

    /**
     * Menampilkan/Menyembunyikan Panel (EQ, Theme, Playlist)
     */
    togglePanel(panelId) {
        const panels = ['equalizerPanel', 'themePanel', 'playlistPanel'];
        
        panels.forEach(id => {
            const panel = this.elements[id];
            if (id === panelId) {
                panel.classList.toggle('active');
            } else {
                panel.classList.remove('active');
            }
        });
    }

    /**
     * Memperbarui tampilan volume
     */
    updateVolumeValue(value) {
        if (this.elements.volumeValue) {
            this.elements.volumeValue.textContent = value;
        }
    }

    /**
     * Menandai lagu yang sedang diputar di playlist
     */
    updateActivePlaylistItem(index) {
        const items = this.elements.playlistItems.querySelectorAll('.playlist-item');
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }

    /**
     * Format detik ke MM:SS
     */
    formatTime(seconds) {
        if (!seconds || seconds === Infinity) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Mengambil semua elemen yang telah disimpan
     */
    getElements() {
        return this.elements;
    }
}

// Inisialisasi secara global
const domBuilder = new DOMBuilder();
