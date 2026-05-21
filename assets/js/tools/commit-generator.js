/* =========================================================
   ToolHlp — commit-generator.js
   ========================================================= */
'use strict';

let _commitType = '';
let _shell = 'cmd';

function initCommitGenerator() {
  // Commit type buttons
  document.querySelectorAll('#commitTypes .ct-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wasActive = btn.classList.contains('active');
      document.querySelectorAll('#commitTypes .ct-btn').forEach(b => b.classList.remove('active'));
      if (!wasActive) { btn.classList.add('active'); _commitType = btn.dataset.type; }
      else _commitType = '';
      generateCommand();
    });
  });

  // Shell tabs
  document.querySelectorAll('#shellTabs .shell-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#shellTabs .shell-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      _shell = tab.dataset.shell;
      generateCommand();
    });
  });

  // Inputs
  ['commitTitle','commitBody','commitScope'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', generateCommand);
  });
  document.getElementById('breakingChange')?.addEventListener('change', generateCommand);

  // Char counter
  document.getElementById('commitTitle')?.addEventListener('input', function() {
    const len = this.value.length;
    const counter = document.getElementById('titleCounter');
    counter.textContent = `${len} / 72`;
    counter.className = 'char-counter' + (len > 100 ? ' over' : len > 72 ? ' warn' : '');
  });

  // Copy command button
  document.getElementById('copyCmd')?.addEventListener('click', () => {
    const out = document.getElementById('cmdOutput').textContent;
    if (!out || out.startsWith('Fill')) return;
    navigator.clipboard.writeText(out).then(() => showToast('Command copied!', 'ok'));
  });
}

function generateCommand() {
  const titleEl = document.getElementById('commitTitle');
  const bodyEl  = document.getElementById('commitBody');
  const scopeEl = document.getElementById('commitScope');
  const breaking = document.getElementById('breakingChange')?.checked;

  let title = (titleEl?.value || '').trim();
  const body  = (bodyEl?.value || '').trim();
  const scope = (scopeEl?.value || '').trim();

  if (!title) {
    document.getElementById('cmdOutput').textContent = 'Fill in the title to generate your command…';
    updatePreview('', '');
    return;
  }

  // Build subject
  let subject = '';
  if (_commitType) {
    subject = scope ? `${_commitType}(${scope}): ${title}` : `${_commitType}: ${title}`;
  } else {
    subject = title;
  }

  // Build message parts
  const parts = [subject];
  if (body) {
    body.split('\n').forEach(line => { if (line.trim()) parts.push(line.trim()); });
  }
  if (breaking) parts.push('BREAKING CHANGE: ' + (body || 'see description'));

  // Build command
  let cmd = '';
  if (_shell === 'cmd') {
    cmd = 'git commit ' + parts.map(p => `-m "${escapeCMD(p)}"`).join(' ^\n         ');
  } else if (_shell === 'powershell') {
    cmd = 'git commit ' + parts.map(p => `-m "${escapePS(p)}"`).join(' `\n         ');
  } else {
    cmd = 'git commit ' + parts.map(p => `-m '${escapeBash(p)}'`).join(' \\\n         ');
  }

  document.getElementById('cmdOutput').textContent = cmd;
  updatePreview(subject, parts.slice(1).join(' · '));
}

function escapeCMD(str) {
  return str.replace(/"/g, '""').replace(/[&|<>^%]/g, '^$&');
}
function escapePS(str) {
  return str.replace(/"/g, '`"').replace(/`/g, '``').replace(/\$/g, '`$');
}
function escapeBash(str) {
  return str.replace(/'/g, "'\\''");
}

function updatePreview(subject, meta) {
  const hash = generateFakeHash();
  const msgEl = document.getElementById('previewMsg');
  const metaEl = document.getElementById('previewMeta');
  if (msgEl) { msgEl.textContent = subject || 'Your commit message will appear here'; msgEl.style.color = subject ? '' : 'var(--text-faint)'; }
  if (metaEl) metaEl.textContent = meta ? `Author: You · ${meta}` : '';
  // Update preview hash
  const hashEl = document.querySelector('.git-hash');
  if (hashEl && subject) hashEl.textContent = hash;
}

function generateFakeHash() {
  return Math.floor(Math.random() * 0xFFFFFFF).toString(16).padStart(7,'0');
}

function clearCommit() {
  document.getElementById('commitTitle').value = '';
  document.getElementById('commitBody').value  = '';
  document.getElementById('commitScope').value = '';
  document.getElementById('breakingChange').checked = false;
  _commitType = '';
  document.querySelectorAll('#commitTypes .ct-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('titleCounter').textContent = '0 / 72';
  document.getElementById('titleCounter').className = 'char-counter';
  document.getElementById('cmdOutput').textContent = 'Fill in the title to generate your command…';
  updatePreview('', '');
}

function copyPreview() {
  const subject = document.getElementById('previewMsg')?.textContent || '';
  if (!subject || subject.includes('will appear')) return;
  navigator.clipboard.writeText(subject).then(() => showToast('Preview copied!', 'ok'));
}
