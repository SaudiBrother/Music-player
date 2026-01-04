/**
 * DOM Builder - Membangun UI secara dinamis
 */
class DOMBuilder {
    constructor() {
        this.elements = {};
        this.cacheElements();
    }

    cacheElements() {
        // Cache semua element yang sering diakses
        this.elements = {
            // Info
            trackTitle: document.querySelector('.track-title'),
            trackArtist: document.querySelector('.track-artist'),
            currentTime: document.querySelector('.current-time'),
            duration: document.querySelector('.duration'),
            progressFill: document.querySelector('.progress-fill'),
            progressHandle: document.querySelector('.progress-handle'),
            volumeValue: document.querySelector('.volume-value'),

            // Controls
            playBtn: document.querySelector('.btn-play-large'),
            prevBtn: document.querySelector('.btn-previous'),
            nextBtn: document.querySelector('.btn-next'),
            shuffleBtn: document.querySelector('.btn-shuffle'),
            repeatBtn: document.querySelector('.btn-repeat'),
            volumeSlider: document.querySelector('.volume-slider'),

            // Panels
            equalizerPanel: document.getElementById('equalizerPanel'),
            themePanel: document.getElementById('themePanel'),
            playlistPanel: document.getElementById('playlistPanel'),
            eqSliders: document.querySelector('.eq-sliders'),
            themeGrid: document.querySelector('.theme-grid'),
            playlistItems: document.querySelector('.playlist-items'),

            // Buttons
            eqBtn: document.getElementById('eqBtn'),
            themeBtn: document.getElementById('themeBtn'),
            playlistBtn: document.getElementById('playlistBtn'),

            // Visualizer
            canvas: document.getElementById('visualizer'),
            dropZone: document.getElementById('dropZone')
        };

        console.log('✓ DOM Elements cached');
    }

    /**
     * Build Equalizer UI
     */
    buildEqualizer(frequencies) {
        const container = this.elements.eqSliders;
        container.innerHTML = ''; // Clear previous

        // Use fragment untuk batch DOM operations
        const fragment = document.createDocumentFragment();

        frequencies.forEach((freq, index) => {
            const group = document.createElement('div');
            group.className = 'eq-slider-group';
            group.setAttribute('data-index', index);

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.className = 'eq-slider';
            slider.min = '-12';
            slider.max = '12';
            slider.value = '0';
            slider.id = `eq-slider-${index}`;

            const label = document.createElement('div');
            label.className = 'eq-label';
            label.textContent = freq >= 1000 ? `${(freq / 1000).toFixed(1)}k` : freq;

            const value = document.createElement('div');
            value.className = 'eq-value';
            value.id = `eq-value-${index}`;
            value.textContent = '0dB';

            group.appendChild(slider);
            group.appendChild(label);
            group.appendChild(value);
            fragment.appendChild(group);
        });

        container.appendChild(fragment);
        console.log('✓ Equalizer UI built');
    }

    /**
     * Build Theme Grid
     */
    buildThemeGrid(themes) {
        const container = this.elements.themeGrid;
        container.innerHTML = '';

        const fragment = document.createDocumentFragment();

        themes.forEach(theme => {
            const option = document.createElement('div');
            option.className = 'theme-option';
            option.setAttribute('data-theme', theme.id);
            option.title = theme.name;

            const preview = document.createElement('div');
            preview.className = 'theme-preview';
            preview.style.setProperty('--preview-gradient', theme.gradient);
            preview.textContent = '●';

            option.appendChild(preview);
            fragment.appendChild(option);
        });

        container.appendChild(fragment);
        console.log('✓ Theme Grid UI built');
    }

    /**
     * Build Playlist
     */
    buildPlaylist(playlist) {
        const container = this.elements.playlistItems;
        container.innerHTML = '';

        if (playlist.length === 0) {
            const empty = document.createElement('div');
            empty.style.cssText = 'text-align: center; opacity:0.5; padding:20px;';
            empty.textContent = 'Playlist kosong. Upload musik untuk memulai!';
            container.appendChild(empty);
            return;
        }

        const fragment = document.createDocumentFragment();

        playlist.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.setAttribute('data-index', index);

            const title = document.createElement('div');
            title.className = 'playlist-item-title';
            title.textContent = track.name;

            const duration = document.createElement('div');
            duration.className = 'playlist-item-duration';
            duration.textContent = this.formatTime(track.duration || 0);

            const removeBtn = document.createElement('button');
            removeBtn.className = 'playlist-item-remove';
            removeBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            `;

            item.appendChild(title);
            item.appendChild(duration);
            item.appendChild(removeBtn);
            fragment.appendChild(item);
        });

        container.appendChild(fragment);
        console.log(`✓ Playlist UI built with ${playlist.length} items`);
    }

    /**
     * Update track info
     */
    updateTrackInfo(title, artist, currentTime, duration) {
        // Batch updates untuk minimize reflow
        requestAnimationFrame(() => {
            this.elements.trackTitle.textContent = title;
            this.elements.trackArtist.textContent = artist;
            this.elements.currentTime.textContent = this.formatTime(currentTime);
            this.elements.duration.textContent = this.formatTime(duration);
        });
    }

    /**
     * Update progress bar
     */
    updateProgress(currentTime, duration) {
        if (duration === 0) return;

        const percentage = (currentTime / duration) * 100;
        this.elements.progressFill.style.width = percentage + '%';
        this.elements.progressHandle.style.left = percentage + '%';
    }

    /**
     * Update volume display
     */
    updateVolume(volume) {
        this.elements.volumeValue.textContent = Math.round(volume);
    }

    /**
     * Update EQ value display
     */
    updateEQValue(index, value) {
        const element = document.getElementById(`eq-value-${index}`);
        if (element) {
            element.textContent = `${value > 0 ? '+' : ''}${value}dB`;
        }
    }

    /**
     * Toggle panel visibility
     */
    togglePanel(panelName) {
        const panelMap = {
            'eq': this.elements.equalizerPanel,
            'theme': this.elements.themePanel,
            'playlist': this.elements.playlistPanel
        };

        const panel = panelMap[panelName];
        if (!panel) return;

        // Close other panels
        Object.values(panelMap).forEach(p => {
            if (p && p !== panel) {
                p.classList.remove('active');
            }
        });

        // Toggle current panel
        panel.classList.toggle('active');
    }

    /**
     * Update play button state
     */
    updatePlayButton(isPlaying) {
        const iconPlay = this.elements.playBtn.querySelector('.icon-play');
        const iconPause = this.elements.playBtn.querySelector('.icon-pause');

        if (isPlaying) {
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        } else {
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
        }
    }

    /**
     * Update active theme option
     */
    updateActiveTheme(themeId) {
        const options = this.elements.themeGrid.querySelectorAll('.theme-option');
        options.forEach(option => {
            if (option.getAttribute('data-theme') === themeId) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    /**
     * Update active playlist item
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
     * Update button active state
     */
    updateButtonState(btn, isActive) {
        if (isActive) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }

    /**
     * Format waktu
     */
    formatTime(seconds) {
        if (!seconds || seconds === Infinity) return '0:00';

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Get element
     */
    getElement(key) {
        return this.elements[key];
    }

    /**
     * Get all cached elements
     */
    getElements() {
        return this.elements;
    }
}

const domBuilder = new DOMBuilder();
