/**
 * Theme Manager - Mengelola 20+ Tema dan Variabel CSS
 */
class ThemeManager {
    constructor() {
        this.themes = [
            { id: 'dark', name: 'Dark Default', class: 'theme-dark' },
            { id: 'neon', name: 'Neon Green', class: 'theme-neon-dark' },
            { id: 'cyberpunk', name: 'Cyberpunk', class: 'theme-cyberpunk' },
            { id: 'purple', name: 'Purple Night', class: 'theme-purple-night' },
            { id: 'light', name: 'Classic Light', class: 'theme-light' }
        ];
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('player-theme') || 'dark';
        this.applyTheme(savedTheme);
        this.renderThemeOptions();
    }

    applyTheme(themeId) {
        const theme = this.themes.find(t => t.id === themeId) || this.themes[0];
        
        // Hapus semua kelas tema lama dari body
        this.themes.forEach(t => document.body.classList.remove(t.class));
        
        // Tambah kelas tema baru
        document.body.classList.add(theme.class);
        localStorage.setItem('player-theme', themeId);
        
        console.log(`Tema aktif: ${theme.name}`);
    }

    renderThemeOptions() {
        const grid = document.querySelector('.theme-grid');
        if (!grid) return;

        this.themes.forEach(theme => {
            const opt = document.createElement('div');
            opt.className = `theme-option ${localStorage.getItem('player-theme') === theme.id ? 'active' : ''}`;
            opt.onclick = () => {
                this.applyTheme(theme.id);
                document.querySelectorAll('.theme-option').forEach(el => el.classList.remove('active'));
                opt.classList.add('active');
            };
            grid.appendChild(opt);
        });
    }
}
