/* =========================================================
   ToolHlp — git-log-visualizer.js
   ========================================================= */
'use strict';

const BRANCH_COLORS = ['#00ADB5','#3b82f6','#f59e0b','#22c55e','#a855f7','#ef4444','#ec4899','#06b6d4','#84cc16','#f97316'];

const GIT_SAMPLE = `a3f1c2e|feat: add user authentication system|Alice|2 hours ago|HEAD -> main, origin/main
b9d4871|fix: resolve session timeout bug|Bob|5 hours ago|
c7e2341|docs: update API documentation|Alice|1 day ago|
d1b5a93|style: format code with prettier|Charlie|2 days ago|feature/ui
e8f4302|refactor: extract auth middleware|Bob|3 days ago|feature/ui
f2c9d15|test: add unit tests for auth module|Alice|4 days ago|
g4a7b28|chore: update dependencies|Charlie|5 days ago|
h6e3f91|perf: optimize database queries|Bob|6 days ago|
i9d2c84|ci: add GitHub Actions workflow|Alice|1 week ago|
j3f8a17|build: configure webpack production build|Charlie|1 week ago|origin/develop, develop`;

let _logData = [];

function initGitLogVisualizer() {
  // nothing to bind on init, all via buttons
}

function loadGitSample() {
  document.getElementById('gitLogInput').value = GIT_SAMPLE;
  visualizeLog();
}

function clearLog() {
  document.getElementById('gitLogInput').value = '';
  document.getElementById('logCanvas').innerHTML = `<div class="log-empty"><i class="fa-solid fa-code-branch"></i><p>Paste your git log and click Visualize</p></div>`;
  document.getElementById('logStatsRow').innerHTML = '';
  document.getElementById('commitDetail').style.display = 'none';
  _logData = [];
}

function parseLog(raw) {
  const lines = raw.trim().split('\n').filter(l => l.trim());
  const commits = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Format: hash|subject|author|reltime|refs
    if (trimmed.includes('|')) {
      const parts = trimmed.split('|');
      commits.push({
        hash:    (parts[0] || '').trim().replace(/^[*\s|\/\\]+/, '').trim().slice(0, 7),
        subject: (parts[1] || '').trim(),
        author:  (parts[2] || '').trim(),
        reltime: (parts[3] || '').trim(),
        refs:    (parts[4] || '').trim(),
        raw:     trimmed,
      });
      continue;
    }

    // Oneline: hash message (optional refs)
    const onelineMatch = trimmed.match(/^([a-f0-9]{5,40})\s+(.+)$/i);
    if (onelineMatch) {
      commits.push({
        hash:    onelineMatch[1].slice(0, 7),
        subject: onelineMatch[2].trim(),
        author:  'Unknown',
        reltime: '',
        refs:    '',
        raw:     trimmed,
      });
    }
  }
  return commits;
}

function parseRefs(refStr) {
  if (!refStr) return [];
  return refStr.split(',').map(r => r.trim()).filter(Boolean).map(r => {
    if (r.startsWith('HEAD ->')) return { label: r, type: 'head' };
    if (r.startsWith('origin/')) return { label: r, type: 'remote' };
    if (r.startsWith('tag:'))    return { label: r, type: 'tag' };
    return { label: r, type: 'branch' };
  });
}

function getCommitType(subject) {
  const s = subject.toLowerCase();
  if (s.startsWith('feat'))     return { ico: 'fa-star', col: '#22c55e' };
  if (s.startsWith('fix'))      return { ico: 'fa-wrench', col: '#ef4444' };
  if (s.startsWith('docs'))     return { ico: 'fa-book', col: '#3b82f6' };
  if (s.startsWith('style'))    return { ico: 'fa-palette', col: '#a855f7' };
  if (s.startsWith('refactor')) return { ico: 'fa-arrows-rotate', col: '#f59e0b' };
  if (s.startsWith('test'))     return { ico: 'fa-vial', col: '#06b6d4' };
  if (s.startsWith('chore'))    return { ico: 'fa-gear', col: '#8b96a3' };
  if (s.startsWith('perf'))     return { ico: 'fa-bolt', col: '#f97316' };
  if (s.startsWith('ci'))       return { ico: 'fa-circle-play', col: '#84cc16' };
  if (s.startsWith('build'))    return { ico: 'fa-hammer', col: '#ec4899' };
  if (s.startsWith('revert'))   return { ico: 'fa-rotate-left', col: '#ef4444' };
  return { ico: 'fa-circle', col: '#00ADB5' };
}

function visualizeLog() {
  const raw = document.getElementById('gitLogInput').value;
  if (!raw.trim()) { showToast('Paste some git log output first.', 'err'); return; }

  _logData = parseLog(raw);
  if (!_logData.length) { showToast('Could not parse log. Check the format.', 'err'); return; }

  renderLog();
}

function renderLog() {
  const canvas = document.getElementById('logCanvas');
  const statsRow = document.getElementById('logStatsRow');

  // Stats
  const authors = [...new Set(_logData.map(c => c.author))];
  const types   = _logData.map(c => c.subject.split(':')[0].split('(')[0].trim().toLowerCase());
  const typeCounts = {};
  types.forEach(t => { typeCounts[t] = (typeCounts[t]||0)+1; });

  statsRow.innerHTML = `
    <span class="log-stat"><span>${_logData.length}</span> commits</span>
    <span class="log-stat"><span>${authors.length}</span> author${authors.length>1?'s':''}</span>`;

  // Render table
  let html = `<div class="log-header-row">
    <div class="lh-graph">Graph</div>
    <div class="lh-hash">Hash</div>
    <div class="lh-msg">Message</div>
    <div class="lh-auth">Author</div>
    <div class="lh-date">When</div>
  </div>`;

  _logData.forEach((c, i) => {
    const color  = BRANCH_COLORS[i % BRANCH_COLORS.length];
    const refs   = parseRefs(c.refs);
    const ctype  = getCommitType(c.subject);
    const refsHtml = refs.map(r => {
      const cls = r.type === 'head' ? 'ref-head' : r.type === 'remote' ? 'ref-remote' : r.type === 'tag' ? 'ref-tag-t' : 'ref-branch';
      return `<span class="ref-tag ${cls}">${r.label}</span>`;
    }).join('');

    html += `<div class="commit-row" data-idx="${i}" onclick="showCommitDetail(${i})">
      <div class="cr-graph">
        <span style="position:relative;display:inline-flex;align-items:center;height:28px;padding-left:${(i%3)*16+4}px">
          <i class="fa-solid ${ctype.ico}" style="font-size:11px;color:${ctype.col}"></i>
        </span>
      </div>
      <div class="cr-hash" style="color:${color}">${c.hash}</div>
      <div class="cr-msg">${escapeHtml(c.subject)}</div>
      <div class="cr-refs">${refsHtml}</div>
      <div class="cr-auth">${escapeHtml(c.author)}</div>
      <div class="cr-date">${escapeHtml(c.reltime)}</div>
    </div>`;
  });

  canvas.innerHTML = html;
}

function showCommitDetail(idx) {
  const c = _logData[idx];
  if (!c) return;
  const refs   = parseRefs(c.refs);
  const ctype  = getCommitType(c.subject);
  const refsHtml = refs.map(r => {
    const cls = r.type === 'head' ? 'ref-head' : r.type === 'remote' ? 'ref-remote' : r.type === 'tag' ? 'ref-tag-t' : 'ref-branch';
    return `<span class="ref-tag ${cls}" style="margin-right:4px">${r.label}</span>`;
  }).join('');

  document.getElementById('commitDetailBody').innerHTML = `
    <table class="img-info-table">
      <tr><td>Hash</td><td style="color:#f6c90e;font-family:'JetBrains Mono',monospace">${c.hash}</td></tr>
      <tr><td>Type</td><td><i class="fa-solid ${ctype.ico}" style="color:${ctype.col};margin-right:6px"></i>${c.subject.split(':')[0]||'commit'}</td></tr>
      <tr><td>Message</td><td>${escapeHtml(c.subject)}</td></tr>
      <tr><td>Author</td><td>${escapeHtml(c.author)}</td></tr>
      <tr><td>When</td><td>${escapeHtml(c.reltime)||'—'}</td></tr>
      <tr><td>Refs</td><td>${refsHtml||'—'}</td></tr>
    </table>`;
  document.getElementById('commitDetail').style.display = '';

  // Highlight selected row
  document.querySelectorAll('.commit-row').forEach(r => r.style.background = '');
  const row = document.querySelector(`.commit-row[data-idx="${idx}"]`);
  if (row) row.style.background = 'var(--accent-glow)';
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
