/* =========================================================
   ToolHlp — regex-tester.js
   ========================================================= */
'use strict';

const CHEAT_SHEET = [
  { pattern: '\\d+',      desc: 'One or more digits' },
  { pattern: '\\w+',      desc: 'Word characters' },
  { pattern: '\\s+',      desc: 'Whitespace (spaces, tabs)' },
  { pattern: '[a-z]+',    desc: 'Lowercase letters' },
  { pattern: '[A-Z]+',    desc: 'Uppercase letters' },
  { pattern: '[a-zA-Z]+', desc: 'Any letters' },
  { pattern: '^\\s+|\\s+$', desc: 'Leading/trailing spaces' },
  { pattern: '\\b\\w+\\b', desc: 'Whole words' },
  { pattern: '(\\d{1,3}\\.){3}\\d{1,3}', desc: 'IPv4 address' },
  { pattern: '[\\w.-]+@[\\w.-]+\\.\\w{2,}', desc: 'Email address' },
  { pattern: 'https?:\\/\\/[\\w.\\/-]+', desc: 'URL (http/https)' },
  { pattern: '#[0-9a-fA-F]{3,6}', desc: 'Hex color code' },
  { pattern: '\\d{4}-\\d{2}-\\d{2}', desc: 'Date (YYYY-MM-DD)' },
  { pattern: '\\+?[\\d\\s()-]{7,15}', desc: 'Phone number' },
  { pattern: '(?i)\\b(true|false)\\b', desc: 'Boolean values' },
  { pattern: '\\/\\/.*|/\\*[\\s\\S]*?\\*/', desc: 'Code comments' },
];

let _rxTimeout = null;

function initRegexTester() {
  const patEl  = document.getElementById('rxPattern');
  const flagEl = document.getElementById('rxFlags');
  const testEl = document.getElementById('rxTest');
  if (!patEl) return;

  patEl.addEventListener('input',  debounceRx);
  flagEl.addEventListener('input', debounceRx);
  testEl.addEventListener('input', debounceRx);

  buildCheatSheet();
}

function debounceRx() {
  clearTimeout(_rxTimeout);
  _rxTimeout = setTimeout(runRegex, 120);
}

function runRegex() {
  const patStr  = document.getElementById('rxPattern')?.value || '';
  const flagStr = document.getElementById('rxFlags')?.value.replace(/[^gimsuy]/g, '') || '';
  const test    = document.getElementById('rxTest')?.value || '';
  const errEl   = document.getElementById('rxError');

  // Hide error
  errEl.style.display = 'none';
  document.getElementById('rxHighlight').innerHTML = '<span style="color:var(--text-faint)">Start typing to see highlights…</span>';
  document.getElementById('rxMatchList').innerHTML = '<p style="color:var(--text-faint);font-size:13px">No matches yet.</p>';
  document.getElementById('rxMatchCount').textContent = '0';
  document.getElementById('rxGroupCount').textContent = '0';

  if (!patStr) return;

  let rx;
  try {
    rx = new RegExp(patStr, flagStr.includes('g') ? flagStr : flagStr + 'g');
  } catch (e) {
    errEl.textContent = '⚠ ' + e.message;
    errEl.style.display = 'block';
    return;
  }

  if (!test) {
    document.getElementById('rxHighlight').innerHTML = '<span style="color:var(--text-faint)">Enter test string above…</span>';
    return;
  }

  // Find all matches
  const matches = [];
  let m;
  const safeRx = new RegExp(patStr, flagStr.includes('g') ? flagStr : flagStr + 'g');
  let safety = 0;
  while ((m = safeRx.exec(test)) !== null && safety++ < 1000) {
    matches.push({ index: m.index, value: m[0], groups: [...m].slice(1) });
    if (!safeRx.global) break;
    if (m.index === safeRx.lastIndex) { safeRx.lastIndex++; }
  }

  // Stats
  const groupCount = matches.length ? matches[0].groups.length : 0;
  document.getElementById('rxMatchCount').textContent = matches.length;
  document.getElementById('rxGroupCount').textContent = groupCount;

  // Highlight
  renderHighlight(test, matches);

  // Match list
  renderMatchList(matches);
}

function renderHighlight(text, matches) {
  const out = document.getElementById('rxHighlight');
  if (!matches.length) {
    out.textContent = text;
    return;
  }

  let html = '';
  let last = 0;
  matches.forEach(m => {
    if (m.index > last) html += escapeHtmlR(text.slice(last, m.index));
    html += `<mark class="match-highlight">${escapeHtmlR(m.value)}</mark>`;
    last = m.index + m.value.length;
  });
  if (last < text.length) html += escapeHtmlR(text.slice(last));
  out.innerHTML = html;
}

function renderMatchList(matches) {
  const list = document.getElementById('rxMatchList');
  if (!matches.length) {
    list.innerHTML = '<p style="color:var(--text-faint);font-size:13px">No matches found.</p>';
    return;
  }

  list.innerHTML = matches.slice(0, 100).map((m, i) => {
    const groupsHtml = m.groups.length
      ? `<div class="mi-groups">Groups: ${m.groups.map((g,gi) => `<span style="color:var(--text-muted)">$${gi+1}</span>: <span style="color:var(--success)">${g !== undefined ? escapeHtmlR(g) : '<i>undefined</i>'}</span>`).join(' · ')}</div>`
      : '';
    return `<div class="match-item">
      <div class="mi-idx">${i + 1}</div>
      <div>
        <div class="mi-val">${escapeHtmlR(m.value)}</div>
        <div style="font-size:11px;color:var(--text-faint);margin-top:2px">at index ${m.index}</div>
        ${groupsHtml}
      </div>
    </div>`;
  }).join('');

  if (matches.length > 100) {
    list.innerHTML += `<p style="color:var(--text-faint);font-size:12px;text-align:center;margin-top:8px">… and ${matches.length - 100} more matches</p>`;
  }
}

function buildCheatSheet() {
  const container = document.getElementById('cheatSheet');
  if (!container) return;

  container.innerHTML = CHEAT_SHEET.map(item => `
    <div class="cheat-item" onclick="insertCheatPattern('${item.pattern.replace(/'/g,"\\'").replace(/\\/g,'\\\\').replace(/"/g,'&quot;')}')">
      <code>${escapeHtmlR(item.pattern)}</code>
      <span>${item.desc}</span>
    </div>`
  ).join('');
}

function insertCheatPattern(pattern) {
  const el = document.getElementById('rxPattern');
  if (!el) return;
  // Unescape the pattern
  el.value = pattern.replace(/\\\\n/g,'\\n');
  el.focus();
  runRegex();
  showToast('Pattern inserted!', 'ok');
}

function escapeHtmlR(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '↵\n')
    .replace(/\t/g, '→\t');
}
