# Changelog

All notable changes to ToolHlp are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [SemVer](https://semver.org/).

---

## [1.0.4] — 2026-05-20

### Added
- Real photo of creator (Muhtasim Rahman) on About page
- Email contact: form now opens mailto to mdturzo.dev@gmail.com
- `contactEmail` field in `config.js`
- Full-width mega-menu spanning entire viewport width
- Completely redesigned About page: hero section, feature highlights, stack cards, creator card with photo
- Premium fonts: Plus Jakarta Sans (headings) + Inter (body)

### Changed
- Mega-menu changed from floating dropdown to full-width bar anchored below navbar
- About page stats moved to hero section (4 stats in 2×2 grid)
- Creator card now shows real photo, handle, bio, and 3 action links
- Contact form submit now sends via `mailto:` instead of opening a GitHub Issue

### Fixed
- JSON Formatter icon (fa-brackets-curly → fa-code, Free tier compatible)

## [1.0.3] — 2026-05-20

### Added
- Professional SVG logo (`logo.svg`) with wrench + terminal prompt motif and emerald gradient
- Comprehensive Documentation page with 8 sections: Getting Started, All Tools, Git/Image/Dev Tools detail, Keyboard Tips, Privacy, Changelog
- Version timeline component in Docs page
- Tool quick-launch cards in Docs page
- Hero section grid mesh background pattern
- Smooth SPA view transition animations (`active` / `leaving` CSS classes)
- `nameSplit`, `tagline`, `releaseDate`, `authorHandle`, `repoName`, `liveUrl`, `stats` to `config.js`
- Docs route added to navbar, sidebar, and all footer columns

### Changed
- Full CSS redesign: deep slate dark mode (`#0b1120` bg), Emerald 500 (`#10b981`) accent
- Typography upgraded to Syne (headings) + DM Sans (body) + JetBrains Mono (code)
- Navbar now glassmorphism with `backdrop-filter: blur(20px)` and scrolled border state
- Mega-menu rewritten to JS class-based (`mega-open`) with 120ms close timer and invisible hover bridge
- `logo.svg` used as favicon (SVG favicon via `<link rel="icon" type="image/svg+xml">`)
- Tool card hover effect now uses gradient overlay animation
- Footer redesigned with social icons and version badge

### Fixed
- **Critical:** Removed duplicate `DOMContentLoaded` init block in `app.js` (caused double-initialization of all tools)
- All repo links updated from old name → `toolhlp`
- Dark mode text contrast on all tool pages
- Mega-menu hover gap (mouse moving to menu div no longer closes it prematurely)
- Deploy workflow now copies `logo.svg` to `_deploy/`
- Release workflow ZIP now correctly named `toolhlp-v{version}.zip`

### Security
- `.files-for-ai/` and `.Backups/` added to `.gitignore` — AI context files never reach GitHub

---

## [1.0.0] — 2025-01-01

### Added
- Initial release with 7 browser-based developer tools
- Git Commit Generator (CMD, PowerShell, Bash support)
- Git Log Visualizer with color-coded timeline
- Image EXIF Remover (Canvas API, 100% local)
- Image Batch Renamer with drag-and-drop reorder + ZIP download
- URL Metadata extractor with 4-engine fallback
- JSON Formatter with syntax highlighting and validation
- Regex Tester with live match highlighting and cheat sheet
- Hash-based SPA router with zero page reloads
- Dark/light theme toggle with localStorage persistence
- Responsive mega-menu navbar + mobile sidebar
- GitHub Actions: auto-deploy to GitHub Pages on main push
- GitHub Actions: auto-release ZIP on tag push

