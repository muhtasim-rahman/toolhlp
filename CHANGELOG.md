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
