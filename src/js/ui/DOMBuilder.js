/**
 * DOM Builder - Membangun elemen UI Playlist
 */
class DOMBuilder {
    constructor(fileHandler, audioEngine) {
        this.fileHandler = fileHandler;
        this.audioEngine = audioEngine;
        this.container = document.querySelector('.playlist-items');
    }

    updatePlaylist(playlist) {
        if (!this.container) return;
        this.container.innerHTML = '';

        playlist.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.innerHTML = `
                <div class="playlist-item-title">${track.name}</div>
                <div class="playlist-item-duration">0:00</div>
            `;
            
            item.addEventListener('click', () => {
                this.playTrack(index);
            });

            this.container.appendChild(item);
        });
    }

    playTrack(index) {
        const track = this.fileHandler.playlist[index];
        if (track) {
            this.audioEngine.load(track.url);
            this.audioEngine.play();
            document.querySelector('.track-title').textContent = track.name;
            
            // Tandai item aktif di UI
            const allItems = document.querySelectorAll('.playlist-item');
            allItems.forEach(el => el.classList.remove('playing'));
            allItems[index].classList.add('playing');
        }
    }
}
