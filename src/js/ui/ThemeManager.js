/**
 * Theme Manager - Mengelola tema dengan instant switching dan persistent storage
 */
class ThemeManager {
    constructor() {
        this.currentTheme = this.loadTheme();
        this.themes = [
            // Dark Themes
            { id: 'dark', name: 'Dark', class: 'theme-dark', gradient: 'linear-gradient(135deg, #0f0f0f, #1a1a1a)' },
            { id: 'neon-dark', name: 'Neon Dark', class: 'theme-neon-dark', gradient: 'linear-gradient(135deg, #0a0e27, #16213e)' },
            { id: 'purple-night', name: 'Purple Night', class: 'theme-purple-night', gradient: 'linear-gradient(135deg, #1a0033, #330066)' },
            { id: 'ocean-deep', name: 'Ocean Deep', class: 'theme-ocean-deep', gradient: 'linear-gradient(135deg, #001a4d, #003d99)' },
            { id: 'cyberpunk', name: 'Cyberpunk', class: 'theme-cyberpunk', gradient: 'linear-gradient(135deg, #0d0221, #1d0047)' },
            { id: 'forest', name: 'Forest', class: 'theme-forest', gradient: 'linear-gradient(135deg, #0d2f0d, #1a4d1a)' },
            { id: 'sunset', name: 'Sunset', class: 'theme-sunset', gradient: 'linear-gradient(135deg, #2d1b00, #4d3000)' },
            
            // Light Themes
            { id: 'light', name: 'Light', class: 'theme-light', gradient: 'linear-gradient(135deg, #f5f5f5, #e8e8e8)' },
            { id: 'minimal-light', name: 'Minimal Light', class: 'theme-minimal-light', gradient: 'linear-gradient(135deg, #ffffff, #f0f0f0)' },
            { id: 'pastel', name: 'Pastel', class: 'theme-pastel', gradient: 'linear-gradient(135deg, #fff5f7, #f0e6ff)' },
            { id: 'mint', name: 'Mint', class: 'theme-mint', gradient: 'linear-gradient(135deg, #e0f7f4, #cce5e0)' },
            { id: 'peach', name: 'Peach', class: 'theme-peach', gradient: 'linear-gradient(135deg, #ffe5d9, #ffd9c4)' },
            
            // Mixed Themes
            { id: 'glass-dark', name: 'Glass Dark', class: 'theme-glass-dark', gradient: 'linear-gradient(135deg, #0f0f0f, #1a1a1a)' },
            { id: 'glass-light', name: 'Glass Light', class: 'theme-glass-light', gradient: 'linear-gradient(135deg, #ffffff, #f5f5f5)' },
            { id: 'neumorphism', name: 'Neumorphism', class: 'theme-neumorphism', gradient: 'linear-gradient(135deg, #e0e5ec, #f8f9fa)' },
            { id: 'contrast-dark', name: 'Contrast Dark', class: 'theme-contrast-dark', gradient: 'linear-gradient(135deg, #000000, #1a1a1a)' },
            { id: 'contrast-light', name: 'Contrast Light', class: 'theme-contrast-light', gradient: 'linear-gradient(135deg, #ffffff, #f5f5f5)' },
            { id: 'retro-80s', name: 'Retro 80s', class: 'theme-retro-80s', gradient: 'linear-gradient(135deg, #ff006e, #ffbe0b)' },
            { id: 'vaporwave', name: 'Vaporwave', class: 'theme-vaporwave', gradient: 'linear-gradient(135deg, #ff006e, #0099ff)' },
            { id: 'monochrome', name: 'Monochrome', class: 'theme-monochrome', gradient: 'linear-gradient(135deg, #2d2d2d, #5a5a5a)' }
        ];

        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        console.log('✓ Theme Manager initialized with theme:', this.currentTheme);
    }

    applyTheme(themeId) {
        const body = document.body;
        const theme = this.themes.find(t => t.id === themeId);

        if (!theme) {
            console.warn(`Theme ${themeId} not found`);
            return false;
        }

        // Remove semua theme classes
        this.themes.forEach(t => {
            body.classList.remove(t.class);
        });

        // Apply new theme class
        body.classList.add(theme.class);

        // Update current theme
        this.currentTheme = themeId;

        // Save to localStorage
        this.saveTheme(themeId);

        // Update CSS variable
        document.documentElement.style.setProperty('--theme-color', theme.gradient);

        console.log('✓ Theme applied:', themeId);
        return true;
    }

    saveTheme(themeId) {
        try {
            localStorage.setItem('music-player-theme', themeId);
        } catch (error) {
            console.warn('LocalStorage not available:', error);
        }
    }

    loadTheme() {
        try {
            const saved = localStorage.getItem('music-player-theme');
            return saved || 'dark';
        } catch (error) {
            console.warn('LocalStorage not available:', error);
            return 'dark';
        }
    }

    getThemes() {
        return this.themes;
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemeById(id) {
        return this.themes.find(t => t.id === id);
    }

    /**
     * Auto detect system theme preference
     */
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.applyTheme('dark');
        } else {
            this.applyTheme('light');
        }
    }

    /**
     * Listen to system theme changes
     */
    listenToSystemTheme() {
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                this.applyTheme(e.matches ? 'dark' : 'light');
            });
        }
    }
}

const themeManager = new ThemeManager();
