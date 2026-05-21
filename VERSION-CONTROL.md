# ToolHlp — Version Control Guide

This document explains the branching strategy, tagging convention, and release workflow used for ToolHlp.

---

## Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Always-deployable, live code. GitHub Pages deploys from here. |
| `v{X}.{Y}.{Z}` | Per-version backup branch. Created before merging to main. |

**There is no `develop` or `staging` branch.** Work happens directly against the version branch, then merges to main.

---

## Versioning (SemVer)

`vMAJOR.MINOR.PATCH`

| Segment | When to bump |
|---------|-------------|
| **MAJOR** | Complete redesign, breaking change in routing, or full framework change |
| **MINOR** | New tool added |
| **PATCH** | Bug fix, style tweak, copy change, docs update |

---

## Full Release Workflow

Run this complete CMD block after finishing work for a version:

```cmd
git checkout -b v{X}.{Y}.{Z} && ^
git add . && ^
git commit -m "v{X}.{Y}.{Z} - {Short Title}" ^
         -m "- {Change 1}" ^
         -m "- {Change 2}" ^
         -m "- {Change 3}" ^
         -m "- {Change 4}" ^
         -m "- {Change 5}" ^
         -m "- {Change 6}" ^
         -m "- {Change 7}" ^
         -m "- {Change 8}" ^
         -m "- {Change 9}" ^
         -m "- {Change 10}" ^
         -m "- {Change 11}" ^
         -m "- {Change 12}" && ^
git push origin v{X}.{Y}.{Z} && ^
git checkout main && ^
git merge v{X}.{Y}.{Z} && ^
git tag -a v{X}.{Y}.{Z} -m "Release v{X}.{Y}.{Z}" && ^
git push origin main --tags
```

### What each step does

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `git checkout -b v{X}.{Y}.{Z}` | Creates version branch (backup point) |
| 2 | `git add . && git commit ...` | Stages + commits all changes with structured message |
| 3 | `git push origin v{X}.{Y}.{Z}` | Pushes version branch → acts as backup on GitHub |
| 4 | `git checkout main` | Switches back to main |
| 5 | `git merge v{X}.{Y}.{Z}` | Fast-forward merges version into main |
| 6 | `git tag -a v{X}.{Y}.{Z} -m "..."` | Creates annotated tag for GitHub Release |
| 7 | `git push origin main --tags` | Pushes main → triggers GitHub Pages deploy + release workflow |

---

## Commit Message Format

```
v{X}.{Y}.{Z} - {Short Title (~60 chars max)}
- {Change 1 — imperative, one meaningful change per line}
- {Change 2}
...
- {Change 12}  ← minimum 8 lines, maximum 15 lines
```

**Rules:**
- Title uses `v{X}.{Y}.{Z} - ` prefix (not `feat:` or `fix:`)
- Each `-m` line covers exactly one change
- Imperative voice: "Add X", "Fix Y", "Redesign Z", "Remove A"
- No vague lines like "misc fixes" or "updates"
- CMD uses `^` for line continuation; Bash/zsh uses `\`

---

## What Triggers What

| Action | Result |
|--------|--------|
| `git push origin main` | GitHub Actions → deploys to GitHub Pages |
| `git push origin --tags` (with `v*.*.*` tag) | GitHub Actions → creates GitHub Release + ZIP artifact |
| `git push origin v{X}.{Y}.{Z}` (branch) | Just pushes backup — no automation |

---

## GitHub Actions Workflows

| File | Trigger | Job |
|------|---------|-----|
| `.github/workflows/deploy.yml` | Push to `main` | Deploy `index.html`, `logo.svg`, `assets/` to GitHub Pages |
| `.github/workflows/release.yml` | Push a `v*.*.*` tag | Create GitHub Release with `toolhlp-v{X}.{Y}.{Z}.zip` |

---

## Things to Update for Each Release

Before running the release command, always update:

1. **`assets/js/config.js`** — `version` and `releaseDate` fields
2. **`CHANGELOG.md`** — New version section with date and changes
3. **`.files-for-ai/context.md`** — New version entry with full context
4. **`README.md`** — Badge versions (if shown)
5. **`docs page`** (`#view-docs`) — Add version to changelog section in `index.html`

---

## Recovering from a Version Branch

If something goes wrong on main, you can reset to any version branch:

```cmd
git checkout main
git reset --hard v{X}.{Y}.{Z}
git push origin main --force
```

⚠️ This force-pushes. Only do this if you're sure.

