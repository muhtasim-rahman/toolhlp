# Version Control Guide — DevToolHub

This file documents the full branching, tagging, and release workflow for DevToolHub.

---

## 🌿 Branch Structure

```
main                 ← Production. Protected. Auto-deploys to GitHub Pages.
│
├── develop          ← Integration. All features merge here first.
│   │
│   ├── feature/json-formatter-tree-view    ← One branch per feature/tool
│   ├── feature/base64-encoder-new-tool
│   └── feature/fix-regex-zero-width
│
├── release/v1.1.0   ← Release prep: bump version, update changelog, final test
│
└── hotfix/v1.0.1    ← Emergency fix: branches from main, merges to main+develop
```

---

## 🔢 Versioning — SemVer

Format: `vMAJOR.MINOR.PATCH`

| Part | Increment when… | Examples |
|---|---|---|
| `PATCH` | Bug fix, typo, minor style fix | `v1.0.1`, `v1.0.2` |
| `MINOR` | New tool added, new significant feature | `v1.1.0`, `v1.2.0` |
| `MAJOR` | Framework migration (React), full redesign | `v2.0.0` |

---

## 🚀 Workflow: Adding a New Tool (MINOR release)

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/base64-encoder

# 3. Build the tool (code, HTML view, nav links, etc.)
# ... do your work ...

# 4. Commit with conventional message
git add .
git commit -m "feat(base64-encoder): add base64 encode/decode tool"

# 5. Push and open PR → develop
git push origin feature/base64-encoder
# Open PR on GitHub: feature/base64-encoder → develop

# 6. After PR merged to develop, create release branch
git checkout develop && git pull origin develop
git checkout -b release/v1.1.0

# 7. On release branch: bump version strings, update CHANGELOG
#    - Update version badge in README.md
#    - Add v1.1.0 section to CHANGELOG.md
#    - Update .files-for-ai/context.md
#    - Create .Backups/v1.1.0/ snapshot

git add .
git commit -m "release: bump version to v1.1.0"

# 8. Merge release branch into main
git checkout main
git merge --no-ff release/v1.1.0 -m "chore(release): merge v1.1.0 into main"

# 9. Tag the release
git tag -a v1.1.0 -m "Release v1.1.0 — add base64 encoder tool"

# 10. Push main + tag (triggers GitHub Actions deploy + release)
git push origin main
git push origin v1.1.0

# 11. Merge release back into develop (to keep in sync)
git checkout develop
git merge --no-ff release/v1.1.0 -m "chore: sync release/v1.1.0 back to develop"
git push origin develop

# 12. Delete release branch (optional cleanup)
git branch -d release/v1.1.0
git push origin --delete release/v1.1.0
```

---

## 🚑 Workflow: Hotfix (PATCH release)

```bash
# Branch from main directly
git checkout main && git pull origin main
git checkout -b hotfix/v1.0.1

# Fix the bug
# ... fix ...
git add .
git commit -m "fix(regex-tester): prevent infinite loop on zero-width matches"

# Update CHANGELOG.md, context.md
git add .
git commit -m "release: bump version to v1.0.1"

# Merge into main
git checkout main
git merge --no-ff hotfix/v1.0.1 -m "chore(release): merge hotfix v1.0.1 into main"
git tag -a v1.0.1 -m "Hotfix v1.0.1 — fix regex infinite loop"
git push origin main
git push origin v1.0.1

# Merge into develop too
git checkout develop
git merge --no-ff hotfix/v1.0.1
git push origin develop

# Clean up
git branch -d hotfix/v1.0.1
```

---

## 📸 .Backups Snapshot Protocol

After every version release, before pushing the tag:

```bash
# Create the backup folder
mkdir -p .Backups/v1.1.0/assets/css
mkdir -p .Backups/v1.1.0/assets/js/tools

# Copy all project files
cp index.html          .Backups/v1.1.0/
cp README.md           .Backups/v1.1.0/
cp CHANGELOG.md        .Backups/v1.1.0/
cp assets/css/main.css .Backups/v1.1.0/assets/css/
cp assets/js/app.js    .Backups/v1.1.0/assets/js/
cp assets/js/tools/*.js .Backups/v1.1.0/assets/js/tools/
# Copy any other new files added in this version

# Commit the snapshot
git add .Backups/v1.1.0/
git commit -m "chore(backup): snapshot v1.1.0"
```

**What to include in the backup:**
- `index.html`
- `README.md`, `CHANGELOG.md`
- `assets/css/main.css`
- `assets/js/app.js`
- `assets/js/tools/*.js`
- Any new files added in this version

**What NOT to include:**
- `.Backups/` itself (no recursion)
- `.files-for-ai/`
- `.github/`
- `*.zip` files
- `node_modules/`

---

## 🏷️ Tag Naming Convention

```bash
git tag -a v1.0.0 -m "Release v1.0.0 — initial release"
git tag -a v1.0.1 -m "Hotfix v1.0.1 — <one-line description>"
git tag -a v1.1.0 -m "Release v1.1.0 — add <tool name>"
git tag -a v2.0.0 -m "Release v2.0.0 — migrate to React"
```

Pre-release (beta):
```bash
git tag -a v1.1.0-beta.1 -m "Beta v1.1.0-beta.1"
```

---

## 🤖 GitHub Actions (automatic)

| Trigger | Workflow | What happens |
|---|---|---|
| Push to `main` | `deploy.yml` | Builds `_deploy/` folder, deploys to GitHub Pages |
| Push tag `v*.*.*` | `release.yml` | Creates GitHub Release, attaches ZIP of project files |

No manual steps needed for deployment — just push to `main` or push a tag.

---

## 📋 Release Checklist

Before tagging a release, verify:

- [ ] All features/fixes merged to `develop` via PRs
- [ ] `develop` merged to release branch
- [ ] Version number updated in `README.md` badge
- [ ] `CHANGELOG.md` has the new version section
- [ ] `.files-for-ai/context.md` updated with version context
- [ ] `.Backups/v{X}.{Y}.{Z}/` snapshot committed
- [ ] Tested in Chrome + Firefox + mobile viewport
- [ ] Dark mode and light mode verified
- [ ] No console errors on any tool
- [ ] Release branch merged to `main`
- [ ] Tag created and pushed: `git push origin v{X}.{Y}.{Z}`
- [ ] Release branch merged back to `develop`
