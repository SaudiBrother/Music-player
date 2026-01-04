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
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, (e) => e.preventDefault(), false);
            document.body.addEventListener(eventName, (e) => e.preventDefault(), false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, () => this.dropZone.classList.add('active'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, () => this.dropZone.classList.remove('active'), false);
        });

        this.dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });

        this.dropZone.addEventListener('click', () => this.fileInput.click());

        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }

    handleFiles(files) {
        const audioFiles = Array.from(files).filter(file => file.type.startsWith('audio/'));
        if (audioFiles.length === 0) {
            alert('Pilih file audio yang valid!');
            return;
        }

        audioFiles.forEach(file => {
            const url = URL.createObjectURL(file);
            this.playlist.push({
                name: file.name.replace(/\.[^/.]+$/, ''),
                url: url,
                file: file
            });
        });

        if (this.onFilesAdded) this.onFilesAdded(this.playlist);
        this.dropZone.style.display = 'none';
    }

    getPlaylist() { return this.playlist; }
    getCurrentTrack() { return this.playlist[this.currentIndex] || null; }
}
