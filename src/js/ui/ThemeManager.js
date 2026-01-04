class ThemeManager {
    constructor() {
        this.themes = [
            { id: 'dark', name: 'Dark', class: 'theme-dark' },
            { id: 'light', name: 'Light', class: 'theme-light' },
            { id: 'neon-dark', name: 'Neon Dark', class: 'theme-neon-dark' }
        ];
        this.currentTheme = this.loadTheme();
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
    }

    applyTheme(themeId) {
        const theme = this.themes.find(t => t.id === themeId);
        if (!theme) return;
        
        this.themes.forEach(t => document.body.classList.remove(t.class));
        document.body.classList.add(theme.class);
        this.currentTheme = themeId;
        localStorage.setItem('music-player-theme', themeId);
    }

    loadTheme() {
        return localStorage.getItem('music-player-theme') || 'dark';
    }
}
