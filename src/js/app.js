/**
 * Main App Controller
 */
document.addEventListener('DOMContentLoaded', () => {
    const fileHandler = new FileHandler();
    const themeManager = new ThemeManager();
    const playBtn = document.querySelector('.btn-play');
    const iconPlay = playBtn.querySelector('.icon-play');
    const iconPause = playBtn.querySelector('.icon-pause');

    // Inisialisasi Audio saat interaksi pertama
    const startAudio = () => {
        audioEngine.init();
        document.removeEventListener('click', startAudio);
    };
    document.addEventListener('click', startAudio);

    fileHandler.onFilesAdded = (playlist) => {
        const firstTrack = playlist[0];
        if (firstTrack) {
            audioEngine.load(firstTrack.url);
            document.querySelector('.track-title').textContent = firstTrack.name;
            document.querySelector('.track-artist').textContent = "Local File";
        }
    };

    playBtn.addEventListener('click', () => {
        if (audioEngine.audioElement.paused) {
            audioEngine.play();
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        } else {
            audioEngine.pause();
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
        }
    });

    // Volume Slider
    const volumeSlider = document.querySelector('.volume-slider');
    volumeSlider.addEventListener('input', (e) => {
        const val = e.target.value / 100;
        audioEngine.setVolume(val);
        document.querySelector('.volume-value').textContent = e.target.value;
    });
});
