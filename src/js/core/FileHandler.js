/**
 * File Handler - Mengelola drag & drop dan file upload
 */
class FileHandler {
    constructor() {
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        this.playlist = [];
        this.currentIndex = 0;
        this.onFilesAdded = null;
        
        this.init();
    }

    init() {
        // Prevent default behavior
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, (e) => e.preventDefault(), false);
            document.body.addEventListener(eventName, (e) => e.preventDefault(), false);
        });

        // Highlight drop zone
        ['dragenter', 'dragover'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, () => this.dropZone.classList.add('active'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, () => this.dropZone.classList.remove('active'), false);
        });

        // Handle drop
        this.dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });

        // Handle click to upload
        this.dropZone.addEventListener('click', () => {
            this.fileInput.click();
        });

        // Handle file input change
        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        console.log('✓ File Handler initialized');
    }

    handleFiles(files) {
        const audioFiles = Array.from(files).filter(file => 
            file.type.startsWith('audio/')
        );

        if (audioFiles.length === 0) {
            alert('Pilih file audio yang valid (MP3, WAV, OGG, dll)');
            return;
        }

        audioFiles.forEach(file => {
            const url = URL.createObjectURL(file);
            const item = {
                name: file.name.replace(/\.[^/.]+$/, ''),
                url: url,
                duration: 0,
                file: file
            };

            this.playlist.push(item);
        });

        // Trigger callback
        if (this.onFilesAdded) {
            this.onFilesAdded(this.playlist);
        }

        // Hide drop zone setelah file ditambahkan
        this.dropZone.style.display = 'none';

        console.log(`✓ ${audioFiles.length} file(s) added to playlist`);
    }

    getPlaylist() {
        return this.playlist;
    }

    getCurrentTrack() {
        return this.playlist[this.currentIndex] || null;
    }

    setCurrentIndex(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.currentIndex = index;
            return true;
        }
        return false;
    }

    getNextTrack() {
        if (this.currentIndex < this.playlist.length - 1) {
            this.currentIndex++;
            return this.getCurrentTrack();
        }
        return null;
    }

    getPreviousTrack() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.getCurrentTrack();
        }
        return null;
    }

    removeTrack(index) {
        this.playlist.splice(index, 1);
        if (this.currentIndex >= this.playlist.length) {
            this.currentIndex = Math.max(0, this.playlist.length - 1);
        }
    }

    clearPlaylist() {
        this.playlist = [];
        this.currentIndex = 0;
    }

    getCurrentIndex() {
        return this.currentIndex;
    }

    getPlaylistLength() {
        return this.playlist.length;
    }
}

const fileHandler = new FileHandler();
