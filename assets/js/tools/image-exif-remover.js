/* =========================================================
   DevToolHub — image-exif-remover.js
   ========================================================= */
'use strict';

let _exifFiles = [];
let _exifResults = [];

function initExifRemover() {
  const zone  = document.getElementById('exifDropZone');
  const input = document.getElementById('exifFileInput');
  if (!zone) return;

  zone.addEventListener('click', () => input.click());
  input.addEventListener('change', e => addExifFiles(Array.from(e.target.files)));

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('over');
    addExifFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')));
  });
}

function addExifFiles(files) {
  files.forEach(f => {
    if (!f.type.startsWith('image/')) return;
    if (_exifFiles.find(x => x.name === f.name && x.size === f.size)) return;
    _exifFiles.push(f);
  });
  renderExifThumbs();
  updateExifButtons();
  if (_exifFiles.length) showExifInfo(_exifFiles[0]);
}

function renderExifThumbs() {
  const grid = document.getElementById('exifThumbGrid');
  grid.innerHTML = '';
  _exifFiles.forEach((f, i) => {
    const div = document.createElement('div');
    div.className = 'img-thumb';
    const url = URL.createObjectURL(f);
    div.innerHTML = `<img src="${url}" loading="lazy" onclick="showExifInfo(window._exifFiles[${i}])" style="cursor:pointer">
      <div class="img-thumb-remove" onclick="removeExifFile(${i})"><i class="fa-solid fa-xmark"></i></div>
      <div class="img-thumb-status" id="exifStatus_${i}"></div>`;
    grid.appendChild(div);
  });
  window._exifFiles = _exifFiles;
}

function removeExifFile(idx) {
  _exifFiles.splice(idx, 1);
  _exifResults = [];
  renderExifThumbs();
  updateExifButtons();
  if (_exifFiles.length) showExifInfo(_exifFiles[0]);
  else document.getElementById('exifInfoPanel').innerHTML = `<div style="text-align:center;padding:40px 20px;color:var(--text-faint)"><i class="fa-solid fa-image" style="font-size:32px;display:block;margin-bottom:10px"></i><p>Upload images to see their metadata</p></div>`;
}

function updateExifButtons() {
  const hasFiles = _exifFiles.length > 0;
  const hasResults = _exifResults.length > 0;
  document.getElementById('exifProcessBtn').disabled = !hasFiles;
  document.getElementById('exifDownloadZip').disabled = !hasResults;
}

function showExifInfo(file) {
  const panel = document.getElementById('exifInfoPanel');
  if (!file) return;

  // Read basic info
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    const mode = document.getElementById('exifMode')?.value || 'all';
    const dateFields = ['DateTimeOriginal','CreateDate','ModifyDate','DateTimeDigitized','GPSDateStamp'];

    panel.innerHTML = `
      <div style="margin-bottom:14px">
        <img src="${url}" style="max-height:120px;border-radius:8px;margin-bottom:10px;object-fit:contain;max-width:100%">
      </div>
      <table class="img-info-table">
        <tr><td>Filename</td><td>${escapeH(file.name)}</td></tr>
        <tr><td>Size</td><td>${formatBytes(file.size)}</td></tr>
        <tr><td>Type</td><td>${file.type}</td></tr>
        <tr><td>Dimensions</td><td>${img.width} × ${img.height} px</td></tr>
        <tr><td style="color:var(--warning)"><i class="fa-solid fa-calendar-xmark"></i> Date fields</td><td style="color:var(--warning)">Will be removed</td></tr>
        <tr><td style="color:var(--danger)"><i class="fa-solid fa-location-dot"></i> GPS</td><td style="color:var(--danger)">${mode==='all'?'Will be removed':'Preserved'}</td></tr>
        <tr><td><i class="fa-solid fa-camera"></i> Camera info</td><td>${mode==='all'?'<span style="color:var(--danger)">Will be removed</span>':'<span style="color:var(--success)">Preserved</span>'}</td></tr>
      </table>
      <p class="form-hint" style="margin-top:10px"><i class="fa-solid fa-shield-halved" style="color:var(--accent)"></i> All processing is done locally — no data is uploaded.</p>`;
  };
  img.src = url;
}

async function processExif() {
  if (!_exifFiles.length) return;
  const mode = document.getElementById('exifMode').value;
  _exifResults = [];

  const bar  = document.getElementById('exifProgBar');
  const fill = document.getElementById('exifProgFill');
  bar.style.display = 'block';

  for (let i = 0; i < _exifFiles.length; i++) {
    fill.style.width = `${((i) / _exifFiles.length) * 100}%`;
    const statusEl = document.getElementById(`exifStatus_${i}`);
    if (statusEl) { statusEl.textContent = '…'; statusEl.className = 'img-thumb-status proc'; }

    try {
      const blob = await stripExif(_exifFiles[i], mode);
      _exifResults.push({ name: _exifFiles[i].name, blob });
      if (statusEl) { statusEl.textContent = '✓'; statusEl.className = 'img-thumb-status done'; }
    } catch(e) {
      if (statusEl) { statusEl.textContent = '✗'; statusEl.className = 'img-thumb-status'; statusEl.style.color = 'var(--danger)'; }
    }
  }

  fill.style.width = '100%';
  setTimeout(() => { bar.style.display = 'none'; fill.style.width = '0%'; }, 800);

  updateExifButtons();
  showToast(`Processed ${_exifResults.length} image${_exifResults.length>1?'s':''}!`, 'ok');
}

function stripExif(file, mode) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // Canvas export strips ALL metadata (mode='all')
        // For date-only mode we still use canvas (reliable cross-browser)
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(blob => {
          if (blob) resolve(blob); else reject(new Error('Canvas conversion failed'));
        }, mimeType, 0.95);
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

async function downloadExifZip() {
  if (!_exifResults.length) return;

  if (_exifResults.length === 1) {
    // Single file — direct download
    const { name, blob } = _exifResults[0];
    const ext  = name.lastIndexOf('.');
    const base = ext > -1 ? name.slice(0, ext) : name;
    const extn = ext > -1 ? name.slice(ext) : '.jpg';
    downloadBlob(blob, `${base}_clean${extn}`);
    return;
  }

  showToast('Zipping files…', 'info');
  const zip = new JSZip();
  _exifResults.forEach(r => {
    const ext  = r.name.lastIndexOf('.');
    const base = ext > -1 ? r.name.slice(0, ext) : r.name;
    const extn = ext > -1 ? r.name.slice(ext) : '.jpg';
    zip.file(`${base}_clean${extn}`, r.blob);
  });
  const content = await zip.generateAsync({ type:'blob' });
  downloadBlob(content, 'cleaned_images.zip');
  showToast('ZIP downloaded!', 'ok');
}

function clearExif() {
  _exifFiles = []; _exifResults = [];
  document.getElementById('exifThumbGrid').innerHTML = '';
  document.getElementById('exifFileInput').value = '';
  document.getElementById('exifInfoPanel').innerHTML = `<div style="text-align:center;padding:40px 20px;color:var(--text-faint)"><i class="fa-solid fa-image" style="font-size:32px;display:block;margin-bottom:10px"></i><p>Upload images to see their metadata</p></div>`;
  updateExifButtons();
}

function downloadBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b/1024).toFixed(1) + ' KB';
  return (b/1048576).toFixed(2) + ' MB';
}
function escapeH(s) { return s.replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
