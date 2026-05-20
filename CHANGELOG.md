# Changelog

All notable changes to DevToolHub will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]
<!-- Staging area — move to a version block when releasing -->

---

## [1.0.0] — 2025-01-01

### Added
- **SPA Router** — hash-based routing with zero page reloads and browser history support
- **Dark / Light theme** — toggle with localStorage persistence
- **Mega navbar** — desktop hover mega menu with tool categories (Git, Image, Dev)
- **Mobile sidebar** — animated slide-in sidebar with category accordion
- **Home page** — hero section, tool preview grid, how-it-works steps, stats bar
- **Tools listing page** — category filter (All / Git / Image / Developer)
- **About page** — project info, tech stack, team card, stats
- **Contact page** — contact form (opens GitHub Issue), social links
- **Footer** — tool links, version badge, GitHub link
- **Toast notifications** — global `showToast()` for all tools
- **Collapsible guides** — step-by-step usage guide on every tool page

#### Tools
- **Git Commit Generator** — conventional commit types, scope, breaking-change toggle, CMD / PowerShell / Bash support, character counter, git log preview, copy-to-clipboard
- **Git Log Visualizer** — pipe-delimited and oneline log parser, color-coded commit timeline, commit type icons, branch ref badges (HEAD, remote, tag, local), click-to-detail panel, sample data loader
- **Image EXIF Remover** — drag & drop multi-file upload, Canvas-based metadata stripping (strip all or dates only), progress bar, individual download + ZIP archive
- **Image Batch Renamer** — drag-to-reorder, naming pattern builder (prefix / separator / padding / suffix / extension), live filename preview, ZIP download via JSZip
- **URL Metadata Extractor** — 4-engine fallback chain (Microlink → Dub.co → JSONLink → AllOrigins), URL history (localStorage), video detection, keyword extraction, extraction log
- **JSON Formatter** — format / minify / validate, regex-based syntax highlighting (keys/strings/numbers/booleans/nulls), error with line+column position, stats panel, copy output
- **Regex Tester** — live match highlighting, capture group display, 1000-match safety cap, 16-item cheat sheet with click-to-insert, flag controls

#### Infrastructure
- GitHub Actions: `deploy.yml` — auto-deploy to GitHub Pages on push to `main`
- GitHub Actions: `release.yml` — create GitHub Release + ZIP on tag push
- Issue templates: bug report, feature request
- Pull request template
- `CONTRIBUTING.md` — full contributor guide
- `SECURITY.md` — security policy and disclosure process
- `.gitignore` — excludes build artifacts, OS files, editor files
- `.Backups/v1.0.0/` — full project snapshot for local version safety
- `.files-for-ai/rules.md` + `.files-for-ai/context.md` — AI continuity system

---

## Version Strategy

| Version | Meaning |
|---|---|
| `1.0.x` | Bug fixes, copy changes, minor style tweaks |
| `1.x.0` | New tool added or significant feature added |
| `x.0.0` | Major redesign, framework migration, or breaking change |

[Unreleased]: https://github.com/muhtasim-rahman/devtoolhub/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/muhtasim-rahman/devtoolhub/releases/tag/v1.0.0

---

## [1.0.2] — 2025-01-01

### Changed
- **Project renamed** from DevToolHub to **DevKit**
- **New green dark theme** — accent `#00c896`, background `#0d1117` (GitHub-dark style), complete CSS rewrite
- **New SVG logo** — professional `</>` code symbol with glow filter, replaces placeholder
- **Hash router upgraded** — clean `#/path` format (`#/tools/commit-generator`), `data-path` attribute system, `navigate()` single entry point, browser back/forward support
- **Mega menu hover fix** — 140ms mouseleave delay + CSS bridge pseudo-element eliminates flicker when moving cursor diagonally to dropdown
- **config.js added** — single source of truth for site name, version, author, links, theme key; auto-injects into DOM
- **All 7 tool pages redesigned** — new panel/badge/guide CSS system, improved dark mode text contrast
- **Documentation page** — new `/docs` route with sticky sidebar, 7 sections (Getting Started, Git Tools, Image Tools, Dev Tools, Keyboard, Privacy, Contributing)
- **Light/dark mode improved** — better surface layering, consistent contrast across all views

### Added
- `assets/js/config.js` — centralized site configuration
- `assets/images/logo.svg` — new professional logo (also used as favicon)
- **Docs page** (`#/docs`) — full tool documentation with sidebar navigation
- **Commit message format** documented in `.files-for-ai/rules.md` (CMD `^` multi-line format)
- **Release workflow codeblock** documented in `.files-for-ai/rules.md` (version branch → push → merge main → tag)
- `.Backups/v1.0.3/` — full project snapshot

### Fixed
- Dark mode: text rendered as dark-on-dark in several tool views — all colors now use CSS variables
- Mega menu disappearing before cursor reaches it
- Footer links not triggering SPA navigation

[1.0.2]: https://github.com/muhtasim-rahman/devkit/compare/v1.0.1...v1.0.3

## [1.0.2] — 2025-05-20

### Changed
- **Renamed** project from DevToolHub → **DevKit**
- **Full CSS rewrite** — new green dark theme (`#0d1117` bg, `#00c896` accent), light mode, all components redesigned
- **Improved SPA router** — clean `#/path` format (`#/tools/json-formatter`), `data-path` attributes, browser history support
- **Navbar redesign** — mega menu hover-dismiss bug fixed via `mouseenter/mouseleave` timeout, arrow bridge CSS

### Added
- **`assets/js/config.js`** — single source of truth for site name, version, author, links, theme key
- **New SVG logo** — professional `</>` code icon, green gradient glow, works as favicon
- **Docs page** (`#/docs`) — tool guides, keyboard shortcuts table, privacy policy, contributing guide with sticky sidebar nav
- **`assets/images/logo.svg`** — new design, used as favicon via config.js injection

### Fixed
- Dark mode text visibility issues across all tool pages
- Mega menu dismissed when moving cursor diagonally to it
- Breadcrumb links now use new route format

### Infrastructure
- `.gitignore` updated — `.Backups/` and `.files-for-ai/` stay in repo, excluded only from GitHub Pages deploy
- `rules.md` — added section 14 (commit format) and section 15 (release workflow CMD codeblock)
- `.Backups/v1.0.3/` full project snapshot created
- `context.md` updated with v1.0.3 full context

[1.0.2]: https://github.com/muhtasim-rahman/devkit/compare/v1.0.1...v1.0.3
