/**
 * DOM Builder - Membuat elemen UI secara dinamis
 */
class DOMBuilder {
    static createPlaylistItem(track, index, isActive = false) {
        const div = document.createElement('div');
        div.className = `playlist-item ${isActive ? 'active' : ''}`;
        div.dataset.index = index;
        
        div.innerHTML = `
            <div class="item-info">
                <span class="item-number">${index + 1}</span>
                <div class="item-details">
                    <span class="item-name">${track.name}</span>
                </div>
            </div>
            <div class="item-duration">--:--</div>
        `;
        
        return div;
    }

    static updateActiveTrack(index) {
        const items = document.querySelectorAll('.playlist-item');
        items.forEach(item => {
            item.classList.toggle('active', parseInt(item.dataset.index) === index);
        });
    }
}
