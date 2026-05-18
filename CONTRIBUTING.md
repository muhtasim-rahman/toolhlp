# Contributing to DevToolHub

Thank you for your interest in contributing! This document explains how to get started.

---

## 🛠️ Development Setup

No build tools or Node.js required.

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/devtoolhub.git
cd devtoolhub

# 2. Open in browser (most tools work directly)
open index.html

# 3. Or serve locally (needed for URL Metadata tool)
python -m http.server 3000
# then open http://localhost:3000
```

---

## 🌿 Branch Strategy

```
main        ← production (protected) — deploy target
develop     ← integration branch
feature/*   ← your work goes here
hotfix/*    ← urgent fixes only
```

**Always branch from `develop`, not `main`:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-new-tool
```

**To submit your work:**
```bash
git push origin feature/my-new-tool
# Open a Pull Request → develop
```

---

## ✅ Adding a New Tool — Step by Step

1. **Create `assets/js/tools/{tool-name}.js`**
   ```js
   'use strict';
   let _state = [];

   function initMyTool() {
     // Bind events to DOM elements
     const el = document.getElementById('myInput');
     if (!el) return;
     el.addEventListener('input', processMyTool);
   }

   function processMyTool() { /* ... */ }
   function clearMyTool() { /* ... */ }
   ```

2. **Add the view in `index.html`** (copy structure from existing tool):
   - `.tool-header` with breadcrumb, icon, badge, title, description
   - `.guide-wrap` with collapsible step guide
   - `.tool-content` with `.panel` components

3. **Register in `app.js`**:
   - Add to `ROUTES` object: `'my-tool': 'view-my-tool'`
   - Add to `TOOLS` array with `id`, `title`, `desc`, `icon`, `cat`, `color`, `route`

4. **Add navigation links** in `index.html`:
   - Desktop mega menu: `.mega-col`
   - Mobile sidebar: `.sb-cat-links`
   - Footer columns

5. **Call init** at bottom of `DOMContentLoaded` in `app.js`:
   ```js
   if (typeof initMyTool === 'function') initMyTool();
   ```

6. **Load the script** at the bottom of `index.html` body:
   ```html
   <script src="assets/js/tools/my-tool.js"></script>
   ```

7. **Update docs**: `README.md`, `CHANGELOG.md`

---

## 📐 Code Style

- **No frameworks** — vanilla JS, CSS, HTML only (until v2.0)
- **CSS variables** — never hardcode `#00ADB5`, use `var(--accent)`
- **Escape HTML** — always escape user input before `innerHTML`
- **Guard init functions** — `if (!document.getElementById('x')) return;`
- **Commits** — follow Conventional Commits: `feat(tool-name): add ...`

---

## 🧪 Testing Checklist Before PR

- [ ] Tool works in Chrome, Firefox, Safari
- [ ] Mobile layout works (≤ 480px viewport)
- [ ] Dark mode and light mode look correct
- [ ] No console errors
- [ ] All buttons/functions verified working
- [ ] `CHANGELOG.md` updated

---

## 📝 Commit Message Format

```
<type>(<scope>): <short description>
```

| Type | When |
|---|---|
| `feat` | New tool or feature |
| `fix` | Bug fix |
| `docs` | README, CHANGELOG, guides |
| `style` | CSS changes only |
| `refactor` | Code cleanup |
| `chore` | Backup, CI, config |

---

## 🙋 Questions?

Open an issue or discussion — all questions welcome.
