# ToolHlp — Essential Developer Utilities

<div align="center">

![ToolHlp](https://img.shields.io/badge/ToolHlp-v1.0.2-10b981?style=for-the-badge&labelColor=0f172a)
![License](https://img.shields.io/badge/License-MIT-1e293b?style=for-the-badge&labelColor=0f172a)
![Status](https://img.shields.io/badge/Status-Active-10b981?style=for-the-badge&labelColor=0f172a)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-ES6+-f59e0b?style=for-the-badge&labelColor=0f172a)

**Fast, private, and local developer utilities in one beautiful place.**
No installs. No sign-ups. No tracking. Everything runs 100% client-side.

[🚀 Live Demo](#) · [📖 Read Docs](#docs) · [🐛 Report Bug](https://github.com/muhtasim-rahman/toolhlp/issues)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tools](#tools)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Tool Usage Guides](#tool-usage-guides)
- [Design System](#design-system)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**DevToolHub** is a single-page application (SPA) that bundles a growing collection of developer utilities. The design philosophy is simple:

- **Instant** — No build step, no server, open the HTML file directly
- **Private** — All processing happens in your browser (except URL Metadata which calls external APIs)
- **Minimal** — Clean, focused UI with no distractions
- **Extensible** — New tools are added as self-contained JS modules

The app uses **hash-based routing** (`#commit-generator`, `#json-formatter`, etc.) to switch between tools without any page reloads.

---

## Features

| Feature | Details |
|---|---|
| 🔀 **SPA Routing** | Hash-based, instant navigation, browser history support |
| 🌙 **Dark / Light Mode** | Toggleable theme, persisted in localStorage |
| 📱 **Fully Responsive** | Desktop, tablet, and mobile with a custom sidebar |
| 🧩 **Mega Navbar** | Hover mega-menu on desktop with tool categories |
| 📋 **Step-by-step guides** | Every tool has a collapsible usage guide |
| 💾 **LocalStorage** | URL history and theme preference are persisted |
| 🔒 **Privacy-first** | No analytics, no cookies, no external calls (except URL tool) |
| ⌨️ **Keyboard-friendly** | Focus states, enter-to-submit, accessible markup |

---

## Tools

### 🟦 Git Tools

#### 1. Commit Generator
Generate properly formatted, multi-line `git commit` commands for three shell environments.

- **Conventional Commits** type selector (`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`)
- **Scope** support: `feat(auth): …`
- **Breaking change** toggle — appends `BREAKING CHANGE` paragraph
- **Shell support:** CMD (Windows), PowerShell, Bash / Zsh
- **Character counter** with 72-char warning (subject line best practice)
- **Git log preview** showing how the commit will look in `git log --oneline`
- **One-click copy** for the full command

#### 2. Git Log Visualizer
Paste `git log` output and render a color-coded, interactive commit timeline.

- Accepts `git log --pretty=format:"%h|%s|%an|%ar|%D" --all` (recommended)
- Also accepts plain `git log --oneline` output
- Displays: short hash · commit type icon · message · branch refs · author · relative time
- **Ref badge system:** `HEAD →` green, `origin/` red, `branch` blue, `tag:` amber
- **Click any row** to open the commit detail panel
- Built-in sample data to demo without a real repo

---

### 🟡 Image Tools

#### 3. EXIF / Metadata Remover
Strip metadata from images entirely in your browser using the HTML5 Canvas API.

- **Drag & drop** or file browser — multiple files supported
- **Two modes:**
  - *Strip ALL metadata* — Canvas redraw removes everything (recommended)
  - *Date fields only* — Removes creation/modification dates, preserves camera info
- Live **metadata preview panel** per image
- **Progress bar** during processing
- Download individual clean images or as a **ZIP archive**
- ⚠️ No images ever leave your device

#### 4. Image Batch Renamer
Upload, reorder, configure a naming pattern, and download renamed images as a ZIP.

- **Drag & drop** sorting to control the final sequence
- **Pattern builder:** prefix · separator · number padding · suffix · extension override
- **Live filename preview** updates as you type
- Supports: `_`, `-`, `.` or no separator; padding 1–4 digits; keep or override extension
- Alphabetical sort button for quick ordering
- Download all renamed files as a **ZIP archive**

---

### 🔵 Developer Tools

#### 5. URL Metadata Extractor
Extract Open Graph metadata from any URL using a 4-engine fallback chain.

- **Engine chain:** Microlink API → Dub.co → JSONLink → Raw DOM (AllOrigins proxy)
- Extracts: title, description, thumbnail image, video source, domain, author, language, favicon
- **Keyword extraction** from title + description
- **URL history** — last 8 scanned URLs saved to localStorage
- Real-time **extraction log** showing which engine succeeded
- Displays embedded video player if `og:video` is found

#### 6. JSON Formatter & Validator
Format, minify, and validate JSON with syntax highlighting.

- **Format** — prettify with 2-space indentation
- **Minify** — produce compact single-line output
- **Validate** — strict parse check with line/column error position
- **Syntax highlighting** — keys, strings, numbers, booleans, nulls in distinct colors
- Live **key count** and **byte size** stats
- One-click **copy to clipboard**
- Built-in sample JSON to get started

#### 7. Regex Tester
Build and test regular expressions with live match highlighting.

- **Live highlighting** as you type — no submit needed
- **Flag controls:** `g`, `i`, `m`, `s`, `u`, `y`
- **Match list** with index position and capture group values
- **Cheat sheet** — 16 common patterns, click to insert into field
- Safe regex execution with a 1000-match safety cap
- Error display for invalid regex patterns

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic SPA shell — single `index.html` |
| **CSS3** | Custom properties, Grid, Flexbox, animations |
| **Vanilla JavaScript (ES6+)** | SPA router, all tool logic, DOM manipulation |
| **Google Fonts** | Syne (headings), DM Sans (body), JetBrains Mono (code) |
| **Font Awesome 6** | Icons throughout the UI |
| **JSZip 3.10** | Client-side ZIP creation for batch downloads |
| **HTML5 Canvas API** | EXIF stripping via canvas redraw |
| **localStorage** | Theme, URL history persistence |
| **Hash Router** | `#route` based SPA navigation |

**No frameworks. No build tools. No Node.js required.**

---

## Project Structure

```
devtools-hub/
├── index.html                          ← SPA shell (all views inline)
├── assets/
│   ├── css/
│   │   └── main.css                   ← All styles (~1000 lines)
│   └── js/
│       ├── app.js                     ← Router · theme · navbar · sidebar
│       └── tools/
│           ├── commit-generator.js    ← Tool 1
│           ├── git-log-visualizer.js  ← Tool 2
│           ├── image-exif-remover.js  ← Tool 3
│           ├── image-batch-renamer.js ← Tool 4
│           ├── url-metadata.js        ← Tool 5
│           ├── json-formatter.js      ← Tool 6
│           └── regex-tester.js        ← Tool 7
└── README.md
```

Each tool is a **self-contained JS module** that exports an `init*()` function called once on startup. Tool-specific state lives in module-scoped variables. The SPA shell in `app.js` manages routing and shared UI (navbar, sidebar, theme, toast).

---

## Getting Started

### Option 1 — Open directly (simplest)
```bash
# Clone the repo
git clone https://github.com/muhtasim-rahman/devtoolhub.git

# Open in browser — no server needed
open devtools-hub/index.html
# or on Windows
start devtools-hub/index.html
```

### Option 2 — Serve locally (recommended for URL Metadata tool)
```bash
# Python 3
cd devtools-hub && python -m http.server 3000

# Node.js (npx)
npx serve devtools-hub

# VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

Then open `http://localhost:3000`.

> **Note:** The URL Metadata tool makes external API calls (Microlink, Dub.co, JSONLink, AllOrigins). These work on both file:// and http:// origins due to CORS headers on those services.

---

## Tool Usage Guides

### Commit Generator

```bash
# Run this in your repo, then paste output into the tool:
git log --pretty=format:"%h|%s|%an|%ar|%D" --all

# The tool also accepts plain oneline format:
git log --oneline
git log --oneline --all
```

**Conventional Commit types:**

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure, no feature/fix |
| `test` | Adding or updating tests |
| `chore` | Build process, auxiliary tools |
| `perf` | Performance improvements |
| `ci` | CI configuration |
| `build` | Build system changes |
| `revert` | Reverting a previous commit |

### Git Log Visualizer — Recommended command

```bash
git log --pretty=format:"%h|%s|%an|%ar|%D" --all
```

Field order: `hash|subject|author|relative-time|refs`

### EXIF Remover

- JPEG files retain ~95% quality after canvas redraw
- PNG files are losslessly re-encoded
- WebP is converted to JPEG during processing (browser limitation)

---

## Design System

### Color Palette

| Token | Dark Mode | Light Mode | Usage |
|---|---|---|---|
| `--bg` | `#222831` | `#eef1f5` | Page background |
| `--surface` | `#393E46` | `#ffffff` | Cards, panels |
| `--surface-2` | `#2c313a` | `#e8ecf1` | Inputs, secondary surfaces |
| `--surface-3` | `#1e232b` | `#dde2ea` | Navbar, footer |
| `--accent` | `#00ADB5` | `#009aa0` | Primary accent, interactive |
| `--text` | `#EEEEEE` | `#1e2530` | Body text |
| `--text-muted` | `#8b96a3` | `#4b5a6b` | Secondary text |
| `--border` | `rgba(255,255,255,.07)` | `rgba(0,0,0,.09)` | Borders |

### Typography

- **Syne** — Display headings, logo, step numbers (geometric, bold)
- **DM Sans** — Body text, labels, descriptions (clean, readable)
- **JetBrains Mono** — Code blocks, commands, hashes, regex (monospace)

### Border Radius Scale

| Variable | Value | Usage |
|---|---|---|
| `--r-s` | `6px` | Buttons, small elements |
| `--r-m` | `10px` | Inputs, panels |
| `--r-l` | `16px` | Cards, large panels |
| `--r-xl` | `24px` | Hero elements |

---

## Roadmap

### v1.1.0 (planned)
- [ ] **Base64 Encoder/Decoder** — Text & file support
- [ ] **Color Converter** — HEX / RGB / HSL / OKLCH
- [ ] **Markdown Previewer** — Live rendered preview
- [ ] **Diff Viewer** — Text diff with line-by-line highlight
- [ ] **Hash Generator** — MD5, SHA-1, SHA-256, SHA-512

### v1.2.0 (planned)
- [ ] **JWT Decoder** — Decode and inspect JWT tokens
- [ ] **Cron Expression Builder** — Visual cron generator
- [ ] **UUID Generator** — v1, v4, v5 with bulk mode
- [ ] **SVG Compressor** — Remove unnecessary attributes
- [ ] **Timestamp Converter** — Unix ↔ human-readable

### v2.0.0 (major)
- [ ] Migrate to **React + Vite** for better component reuse
- [ ] **Firebase** integration for cloud history
- [ ] User accounts (optional, for syncing settings)
- [ ] Tool favoriting and custom order
- [ ] Keyboard shortcuts system
- [ ] Import/export tool state as JSON

---

## Adding a New Tool

1. Create `assets/js/tools/my-tool.js` with an `initMyTool()` export
2. Add the tool view `<section id="view-my-tool" class="view">…</section>` in `index.html`
3. Register the route in `ROUTES` object in `app.js`
4. Add the tool entry to the `TOOLS` array in `app.js`
5. Add nav links to the mega menu and sidebar in `index.html`
6. Call `initMyTool()` in the `DOMContentLoaded` block in `app.js`

---

## Contributing

Contributions, bug reports, and tool suggestions are welcome!

1. Fork the repository
2. Create your branch: `git checkout -b feat/my-new-tool`
3. Commit your changes: `git commit -m "feat: add my new tool"`
4. Push and open a Pull Request

Please keep tools **client-side only** where possible, and follow the existing CSS variable system and panel/guide layout pattern.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Made with ☕ by [Muhtasim Rahman](https://github.com/muhtasim-rahman)

**DevToolHub v1.0.0** · More tools coming soon

</div>
