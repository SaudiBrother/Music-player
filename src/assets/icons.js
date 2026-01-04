/**
 * Icons - Semua SVG icons sebagai string untuk inline rendering
 * Menggunakan data URI untuk menghindari HTTP request tambahan
 */

const Icons = {
    play: `<svg viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>`,

    pause: `<svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
    </svg>`,

    previous: `<svg viewBox="0 0 24 24" fill="currentColor">
        <polygon points="19 5 9 12 19 19 19 5"></polygon>
        <line x1="5" y1="5" x2="5" y2="19"></line>
    </svg>`,

    next: `<svg viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 5 15 12 5 19 5 5"></polygon>
        <line x1="19" y1="5" x2="19" y2="19"></line>
    </svg>`,

    shuffle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="23 1 23 7 17 7"></polyline>
        <polyline points="1 23 1 17 7 17"></polyline>
        <path d="M20 10a5 5 0 0 0-8.3-2.8L3 16m21-7a5 5 0 0 1-9.8 1.8L3 8"></path>
    </svg>`,

    repeat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="17 2 21 6 17 10"></polyline>
        <path d="M3 11v-1a4 4 0 0 1 4-4h14"></path>
        <polyline points="7 22 3 18 7 14"></polyline>
        <path d="M21 13v1a4 4 0 0 1-4 4H3"></path>
    </svg>`,

    volume: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>`,

    volumeMute: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
    </svg>`,

    equalizer: `<svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="5" width="2" height="14"></rect>
        <rect x="9" y="3" width="2" height="16"></rect>
        <rect x="15" y="7" width="2" height="12"></rect>
    </svg>`,

    theme: `<svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 18a6 6 0 0 0 0-12"></path>
    </svg>`,

    playlist: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>`,

    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`,

    delete: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>`,

    upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>`,

    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>`,

    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`,

    music: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 18v-13l12-2v13a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v11a2 2 0 1 1-4 0Z"></path>
    </svg>`,

    loading: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2a10 10 0 0 1 0 20" stroke-linecap="round"></path>
    </svg>`
};

// Export untuk penggunaan global
if (typeof window !== 'undefined') {
    window.Icons = Icons;
}

// Export untuk CommonJS (jika digunakan)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Icons;
}

console.log('✓ Icons library loaded');
