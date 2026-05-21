<div align="center">
  <img src="logo.svg" width="72" height="72" alt="ToolHlp Logo" />
  <h1>ToolHlp</h1>
  <p><strong>Developer Tools Collection — v1.0.4</strong></p>
  <p>A curated set of browser-based utilities for developers.<br/>
  Fast, private, zero-dependency. No sign-up, no data leaves your browser.</p>

  <p>
    <a href="https://muhtasim-rahman.github.io/toolhlp">Live Demo</a> ·
    <a href="https://github.com/muhtasim-rahman/toolhlp/issues/new?template=bug_report.md">Report Bug</a> ·
    <a href="https://github.com/muhtasim-rahman/toolhlp/issues/new?template=feature_request.md">Request Feature</a>
  </p>

  <img src="https://img.shields.io/badge/version-1.0.4-10b981?style=flat-square" alt="version" />
  <img src="https://img.shields.io/badge/license-MIT-3b82f6?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/vanilla-JS-f59e0b?style=flat-square" alt="vanilla js" />
  <img src="https://img.shields.io/badge/zero-dependencies-10b981?style=flat-square" alt="zero deps" />
</div>

---

## ✨ Features

- **100% Browser-Based** — All processing runs client-side. No backend, no server.
- **Privacy First** — Images and text never leave your device (except URL Metadata).
- **Zero Install** — Open and use. No npm, no build step, no login.
- **Hash Routing SPA** — Smooth page transitions, bookmarkable tool URLs.
- **Dark + Light Mode** — Preference saved to localStorage.
- **Fully Responsive** — Works on mobile, tablet, and desktop.

---

## 🛠 Tools

### Git Tools
| Tool | Description |
|------|-------------|
| [Commit Generator](https://muhtasim-rahman.github.io/toolhlp/#commit-generator) | Build multi-line git commit commands for CMD, PowerShell, and Bash with Conventional Commits |
| [Git Log Visualizer](https://muhtasim-rahman.github.io/toolhlp/#git-log-visualizer) | Paste `git log` output and get a color-coded commit timeline |

### Image Tools
| Tool | Description |
|------|-------------|
| [EXIF Remover](https://muhtasim-rahman.github.io/toolhlp/#image-exif-remover) | Strip GPS, dates, and camera metadata from images in-browser |
| [Batch Renamer](https://muhtasim-rahman.github.io/toolhlp/#image-batch-renamer) | Upload, drag-reorder, apply naming patterns, download as ZIP |

### Dev Tools
| Tool | Description |
|------|-------------|
| [URL Metadata](https://muhtasim-rahman.github.io/toolhlp/#url-metadata) | Extract Open Graph tags, thumbnails, and keywords from any URL |
| [JSON Formatter](https://muhtasim-rahman.github.io/toolhlp/#json-formatter) | Prettify, minify, and validate JSON with syntax highlighting |
| [Regex Tester](https://muhtasim-rahman.github.io/toolhlp/#regex-tester) | Live match highlighting, capture groups, and a cheat sheet |

---

## 🏗 Tech Stack

- **HTML5** — Single-file SPA (`index.html`)
- **CSS3** — Custom properties, no utility framework
- **ES6+ JavaScript** — Vanilla, no frameworks
- **Font Awesome 6** — Icons (CDN)
- **Google Fonts** — Syne, DM Sans, JetBrains Mono (CDN)
- **JSZip 3.10** — Client-side ZIP creation (CDN)

---

## 🚀 Getting Started

```bash
# Option 1 — Open directly
open index.html   # or double-click in Explorer

# Option 2 — Local server (better for development)
npx serve .
# or
python -m http.server 8080
```

---

## 📁 Project Structure

```
toolhlp/
├── index.html                  # SPA shell — all views
├── logo.svg                    # Brand logo + favicon
├── assets/
│   ├── css/main.css            # All styles
│   └── js/
│       ├── config.js           # Site-wide config (version, name, URLs)
│       ├── app.js              # Router, theme, navbar, sidebar
│       └── tools/              # One file per tool
├── .github/workflows/
│   ├── deploy.yml              # Auto-deploy to GitHub Pages on main push
│   └── release.yml             # Create GitHub Release on tag push
└── .files-for-ai/              # [gitignored] AI context and rules
```

---

## 🔒 Privacy

All tools run entirely in your browser. The only exception is **URL Metadata**, which sends the provided URL to public metadata APIs (Microlink, Dub.co) to extract Open Graph data.

No analytics, no cookies, no tracking.

---

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full version history.

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT — © 2026 [Muhtasim Rahman](https://mdturzo.web.app)
