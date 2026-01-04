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
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.body.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        // Highlight drop zone saat file diseret
        window.addEventListener('dragenter', () => {
            if(this.dropZone) this.dropZone.classList.add('active');
        });

        if (this.dropZone) {
            this.dropZone.addEventListener('dragleave', (e) => {
                if (e.relatedTarget === null) this.dropZone.classList.remove('active');
            });

            this.dropZone.addEventListener('drop', (e) => {
                const files = e.dataTransfer.files;
                this.handleFiles(files);
            });

            // Klik pada area drop zone juga bisa upload
            this.dropZone.addEventListener('click', () => {
                this.fileInput.click();
            });
        }
    }

    // Fungsi utama yang dipanggil oleh app.js atau input change
    handleFileSelect(e) {
        const files = e.target.files;
        this.handleFiles(files);
    }

    handleFiles(files) {
        const audioFiles = Array.from(files).filter(file => file.type.startsWith('audio/'));
        
        if (audioFiles.length === 0) {
            alert('Mohon pilih file audio saja (MP3, WAV, dll)');
            return;
        }

        // Tambahkan ke playlist yang sudah ada
        audioFiles.forEach(file => {
            this.playlist.push(file);
        });

        console.log(`Berhasil menambahkan ${audioFiles.length} lagu.`);

        // Panggil callback agar app.js tahu ada lagu baru
        if (typeof this.onFilesAdded === 'function') {
            this.onFilesAdded(this.playlist);
        }

        // Sembunyikan drop zone jika aktif
        if(this.dropZone) this.dropZone.classList.remove('active');
    }

    getPlaylist() {
        return this.playlist;
    }

    clearPlaylist() {
        this.playlist = [];
        this.currentIndex = 0;
    }
}

// Inisialisasi secara global
const fileHandler = new FileHandler();
