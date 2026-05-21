'use strict';

/**
 * ToolHlp — Central Configuration
 * ─────────────────────────────────
 * Change values here to update the entire site.
 * All scripts and HTML pull from window.CONFIG.
 */
window.CONFIG = {
  /* ── Identity ── */
  appName:      "ToolHlp",
  nameSplit:    3,            // chars from end highlighted in accent color ("Hlp")
  tagline:      "Developer Tools Collection",
  version:      "1.0.4",
  releaseDate:  "2026-05-20",

  /* ── Author ── */
  author:       "Muhtasim Rahman",
  authorHandle: "muhtasim-rahman",
  portfolioUrl: "https://mdturzo.web.app",
  contactEmail: "mdturzo.dev@gmail.com",

  /* ── Repository ── */
  repoUrl:      "https://github.com/muhtasim-rahman/toolhlp",
  repoName:     "toolhlp",
  liveUrl:      "https://muhtasim-rahman.github.io/toolhlp",

  /* ── Theme defaults ── */
  theme: {
    defaultMode:   'dark',
    primaryColor:  '#10b981',   // Emerald 500
    primaryDark:   '#059669',   // Emerald 600
  },

  /* ── Tool categories ── */
  categories: {
    git:   { label: 'Git Tools',   icon: 'fa-solid fa-code-branch' },
    image: { label: 'Image Tools', icon: 'fa-solid fa-image'       },
    dev:   { label: 'Dev Tools',   icon: 'fa-solid fa-terminal'    }
  },

  /* ── Stats shown on Hero / About ── */
  stats: {
    tools:     7,
    categories: 3,
  }
};
