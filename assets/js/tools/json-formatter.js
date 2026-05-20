/* =========================================================
   DevToolHub — json-formatter.js
   ========================================================= */
'use strict';

const JSON_SAMPLE = `{
  "project": "DevToolHub",
  "version": "1.0.0",
  "author": {
    "name": "Muhtasim Rahman",
    "github": "muhtasim-rahman",
    "role": "Creator & Developer"
  },
  "tools": [
    "Commit Generator",
    "Git Log Visualizer",
    "EXIF Remover",
    "Batch Renamer",
    "URL Metadata",
    "JSON Formatter",
    "Regex Tester"
  ],
  "settings": {
    "theme": "dark",
    "storage": "localStorage",
    "openSource": true,
    "serverRequired": false
  }
}`;

function initJsonFormatter() {
  const input = document.getElementById('jsonInput');
  if (!input) return;
  input.addEventListener('input', () => {
    updateJsonStats();
    clearJsonMsg();
  });
}

function formatJson() {
  const input = document.getElementById('jsonInput');
  const raw = input?.value.trim();
  if (!raw) { showJsonMsg('Paste some JSON first.', 'err'); return; }

  try {
    const parsed = JSON.parse(raw);
    const pretty = JSON.stringify(parsed, null, 2);
    input.value = pretty;
    input.classList.remove('json-error');
    renderJsonOutput(pretty);
    updateJsonStats();
    showJsonMsg('JSON formatted successfully!', 'ok');
  } catch (e) {
    input.classList.add('json-error');
    showJsonMsg(friendlyJsonError(e, raw), 'err');
  }
}

function minifyJson() {
  const input = document.getElementById('jsonInput');
  const raw = input?.value.trim();
  if (!raw) { showJsonMsg('Paste some JSON first.', 'err'); return; }

  try {
    const parsed = JSON.parse(raw);
    const minified = JSON.stringify(parsed);
    input.value = minified;
    input.classList.remove('json-error');
    renderJsonOutput(minified);
    updateJsonStats();
    showJsonMsg('JSON minified — ' + formatBytes(minified.length), 'ok');
  } catch (e) {
    input.classList.add('json-error');
    showJsonMsg(friendlyJsonError(e, raw), 'err');
  }
}

function validateJson() {
  const raw = document.getElementById('jsonInput')?.value.trim();
  if (!raw) { showJsonMsg('Nothing to validate.', 'err'); return; }

  try {
    const parsed = JSON.parse(raw);
    const keys   = countKeys(parsed);
    document.getElementById('jsonInput').classList.remove('json-error');
    showJsonMsg(`✓ Valid JSON · ${keys} key${keys !== 1 ? 's' : ''} · ${formatBytes(raw.length)}`, 'ok');
  } catch (e) {
    document.getElementById('jsonInput').classList.add('json-error');
    showJsonMsg(friendlyJsonError(e, raw), 'err');
  }
}

function loadJsonSample() {
  document.getElementById('jsonInput').value = JSON_SAMPLE;
  document.getElementById('jsonInput').classList.remove('json-error');
  clearJsonMsg();
  renderJsonOutput(JSON_SAMPLE);
  updateJsonStats();
}

function clearJson() {
  document.getElementById('jsonInput').value = '';
  document.getElementById('jsonInput').classList.remove('json-error');
  document.getElementById('jsonOutput').innerHTML = '<span style="color:var(--text-faint)">Formatted output will appear here…</span>';
  clearJsonMsg();
  document.getElementById('jKeyCount').textContent = '—';
  document.getElementById('jSize').textContent = '—';
}

function copyJson() {
  const out = document.getElementById('jsonOutput')?.textContent;
  if (!out || out.includes('appear here')) return;
  navigator.clipboard.writeText(out).then(() => showToast('JSON copied!', 'ok'));
}

/* ── Syntax highlighting ── */
function renderJsonOutput(str) {
  const out = document.getElementById('jsonOutput');
  if (!out) return;
  try {
    // Validate first
    JSON.parse(str);
    out.innerHTML = syntaxHighlight(str);
  } catch {
    out.innerHTML = `<span style="color:var(--danger)">${escapeHtmlJ(str)}</span>`;
  }
}

function syntaxHighlight(json) {
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      match => {
        let cls = 'json-num';
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? 'json-key' : 'json-str';
        } else if (/true|false/.test(match)) {
          cls = 'json-bool';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
}

/* ── Helpers ── */
function showJsonMsg(msg, type) {
  const el = document.getElementById('jsonMsg');
  if (!el) return;
  const icon = type === 'ok' ? 'fa-circle-check' : 'fa-circle-exclamation';
  const cls  = type === 'ok' ? 'json-ok-msg' : 'json-err-msg';
  el.innerHTML = `<div class="${cls}"><i class="fa-solid ${icon}"></i>${escapeHtmlJ(msg)}</div>`;
}

function clearJsonMsg() {
  const el = document.getElementById('jsonMsg');
  if (el) el.innerHTML = '';
}

function updateJsonStats() {
  const raw = document.getElementById('jsonInput')?.value || '';
  document.getElementById('jSize').textContent = raw.length ? formatBytes(raw.length) : '—';
  try {
    const k = countKeys(JSON.parse(raw));
    document.getElementById('jKeyCount').textContent = k;
    renderJsonOutput(raw);
  } catch {
    document.getElementById('jKeyCount').textContent = '—';
  }
}

function countKeys(obj, depth = 0) {
  if (depth > 20) return 0;
  if (typeof obj !== 'object' || obj === null) return 0;
  const own = Object.keys(obj).length;
  const nested = Object.values(obj).reduce((sum, v) => sum + countKeys(v, depth + 1), 0);
  return own + nested;
}

function friendlyJsonError(e, raw) {
  const msg = e.message;
  // Try to extract position
  const posMatch = msg.match(/position (\d+)/i);
  if (posMatch) {
    const pos  = parseInt(posMatch[1]);
    const line = raw.slice(0, pos).split('\n').length;
    const col  = pos - raw.slice(0, pos).lastIndexOf('\n');
    return `${msg} (Line ${line}, Col ${col})`;
  }
  return msg;
}

function formatBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1048576).toFixed(2) + ' MB';
}

function escapeHtmlJ(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
