'use strict';

/**
 * Global Configuration for ToolHlp
 * Update this file to change site-wide information
 */
window.CONFIG = {
    appName: "ToolHlp",
    version: "1.0.2",
    author: "Muhtasim Rahman",
    portfolioUrl: "https://mdturzo.web.app",
    repoUrl: "https://github.com/muhtasim-rahman/toolhlp",
    
    // UI Settings
    theme: {
        defaultMode: 'dark',
        primaryColor: '#10b981', // Emerald Green
    },

    // Navigation Categories
    categories: {
        git: { label: 'Git Tools', icon: 'fa-solid fa-code-branch' },
        image: { label: 'Image Tools', icon: 'fa-solid fa-image' },
        dev: { label: 'Dev Tools', icon: 'fa-solid fa-terminal' }
    }
};
