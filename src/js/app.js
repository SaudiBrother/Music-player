/**
 * Main Application Entry Point
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi semua komponen
    const engine = new AudioEngine();
    const files = new FileHandler();
    const themes = new ThemeManager();
    const ui = new DOMBuilder(files, engine);
    const visualizer = new Visualizer('visualizer', engine.getAnalyser());

    // Elemen UI
    const playBtn = document.querySelector('.btn-play-large');
    const prevBtn = document.querySelector('.btn-previous');
    const nextBtn = document.querySelector('.btn-next');
    const volumeSlider = document.querySelector('.volume-slider');
    const themeBtn = document.getElementById('themeBtn');
    const eqBtn = document.getElementById('eqBtn');

    // 2. Handle Upload File
    files.onFilesAdded = (playlist) => {
        ui.updatePlaylist(playlist);
        // Sembunyikan drop zone setelah file masuk
        document.getElementById('dropZone').classList.add('hidden');
        
        // Load lagu pertama secara otomatis
        if (playlist.length > 0) {
            ui.playTrack(0);
        }
    };

    // 3. Kontrol Player
    playBtn.addEventListener('click', () => {
        engine.init(); // Pastikan AudioContext aktif
        if (engine.audioElement.paused) {
            engine.play();
            visualizer.start();
            playBtn.innerHTML = Icons.pause;
        } else {
            engine.pause();
            visualizer.stop();
            playBtn.innerHTML = Icons.play;
        }
    });

    nextBtn.addEventListener('click', () => {
        let nextIndex = files.currentIndex + 1;
        if (nextIndex >= files.playlist.length) nextIndex = 0;
        ui.playTrack(nextIndex);
    });

    prevBtn.addEventListener('click', () => {
        let prevIndex = files.currentIndex - 1;
        if (prevIndex < 0) prevIndex = files.playlist.length - 1;
        ui.playTrack(prevIndex);
    });

    // 4. Kontrol Volume
    volumeSlider.addEventListener('input', (e) => {
        const val = e.target.value / 100;
        engine.setVolume(val);
        document.querySelector('.volume-value').textContent = e.target.value;
    });

    // 5. Toggle Panel (Tema & EQ)
    themeBtn.addEventListener('click', () => {
        document.querySelector('.theme-panel').classList.toggle('active');
        document.querySelector('.equalizer-panel').classList.remove('active');
    });

    eqBtn.addEventListener('click', () => {
        document.querySelector('.equalizer-panel').classList.toggle('active');
        document.querySelector('.theme-panel').classList.remove('active');
    });
});
