/* =========================================================
   ToolHlp — image-batch-renamer.js
   ========================================================= */
'use strict';

let _batchFiles = [];
let _dragSrcIdx  = null;

function initBatchRenamer() {
  const zone  = document.getElementById('batchDropZone');
  const input = document.getElementById('batchFileInput');
  if (!zone) return;

  zone.addEventListener('click', () => input.click());
  input.addEventListener('change', e => addBatchFiles(Array.from(e.target.files)));

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('over');
    addBatchFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')));
  });

  // Pattern fields live update
  ['rnPrefix','rnSep','rnStart','rnPad','rnSuffix','rnExt'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateBatchPreview);
    document.getElementById(id)?.addEventListener('change', updateBatchPreview);
  });

  updateBatchPreview();
}

function addBatchFiles(files) {
  files.forEach(f => {
    if (!f.type.startsWith('image/')) return;
    _batchFiles.push(f);
  });
  renderRenameList();
  updateBatchPreview();
  document.getElementById('batchDownloadBtn').disabled = _batchFiles.length === 0;
  document.getElementById('batchCount').textContent = _batchFiles.length ? `(${_batchFiles.length})` : '';
}

function getNewName(idx, origName) {
  const prefix  = document.getElementById('rnPrefix')?.value || 'image';
  const sep     = document.getElementById('rnSep')?.value ?? '_';
  const start   = parseInt(document.getElementById('rnStart')?.value || '1', 10);
  const pad     = parseInt(document.getElementById('rnPad')?.value || '3', 10);
  const suffix  = document.getElementById('rnSuffix')?.value || '';
  const extMode = document.getElementById('rnExt')?.value || 'keep';

  const num = String(start + idx).padStart(pad, '0');
  const origExt = origName.lastIndexOf('.') > -1 ? origName.slice(origName.lastIndexOf('.')).toLowerCase() : '';
  const ext = extMode === 'keep' ? origExt : `.${extMode}`;

  return `${prefix}${sep}${num}${suffix}${ext}`;
}

function updateBatchPreview() {
  const name = getNewName(0, 'sample.jpg');
  const prev = document.getElementById('patternPreview');
  if (prev) prev.textContent = name;
  renderRenameList();
}

function renderRenameList() {
  const list = document.getElementById('renameList');
  if (!list) return;

  if (!_batchFiles.length) {
    list.innerHTML = `<div style="text-align:center;padding:40px 20px;color:var(--text-faint)"><i class="fa-solid fa-images" style="font-size:32px;display:block;margin-bottom:10px"></i><p>Upload images to see the rename list</p></div>`;
    return;
  }

  list.innerHTML = '';
  _batchFiles.forEach((f, i) => {
    const url     = URL.createObjectURL(f);
    const newName = getNewName(i, f.name);
    const item    = document.createElement('div');
    item.className = 'rename-item';
    item.draggable = true;
    item.dataset.idx = i;

    item.innerHTML = `
      <div class="ri-drag" title="Drag to reorder"><i class="fa-solid fa-grip-vertical"></i></div>
      <div class="ri-idx">${i+1}</div>
      <img class="ri-thumb" src="${url}" loading="lazy" alt="${f.name}">
      <div class="ri-info">
        <div class="ri-orig">${f.name}</div>
        <div class="ri-new">${newName}</div>
      </div>
      <button class="ri-del" onclick="removeBatchFile(${i})" title="Remove"><i class="fa-solid fa-xmark"></i></button>`;

    // Drag events
    item.addEventListener('dragstart', e => {
      _dragSrcIdx = i;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    item.addEventListener('dragend', () => { item.classList.remove('dragging'); _dragSrcIdx = null; });
    item.addEventListener('dragover', e => { e.preventDefault(); item.classList.add('drag-over'); });
    item.addEventListener('dragleave', () => item.classList.remove('drag-over'));
    item.addEventListener('drop', e => {
      e.preventDefault(); item.classList.remove('drag-over');
      if (_dragSrcIdx === null || _dragSrcIdx === i) return;
      const moved = _batchFiles.splice(_dragSrcIdx, 1)[0];
      _batchFiles.splice(i, 0, moved);
      renderRenameList();
      updateBatchPreview();
    });

    list.appendChild(item);
  });
}

function removeBatchFile(idx) {
  _batchFiles.splice(idx, 1);
  renderRenameList();
  updateBatchPreview();
  document.getElementById('batchDownloadBtn').disabled = _batchFiles.length === 0;
  document.getElementById('batchCount').textContent = _batchFiles.length ? `(${_batchFiles.length})` : '';
}

function batchSortName() {
  _batchFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  renderRenameList();
  updateBatchPreview();
}

async function downloadBatchZip() {
  if (!_batchFiles.length) return;

  const btn = document.getElementById('batchDownloadBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Zipping…';
  showToast('Creating ZIP…', 'info');

  try {
    const zip = new JSZip();
    for (let i = 0; i < _batchFiles.length; i++) {
      const f      = _batchFiles[i];
      const newName = getNewName(i, f.name);
      const buf    = await f.arrayBuffer();
      zip.file(newName, buf);
    }
    const content = await zip.generateAsync({ type:'blob', compression:'DEFLATE', compressionOptions:{ level:6 } });
    downloadBlob(content, 'renamed_images.zip');
    showToast(`Downloaded ${_batchFiles.length} renamed images!`, 'ok');
  } catch(e) {
    showToast('Failed to create ZIP: ' + e.message, 'err');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-file-zipper"></i> Download ZIP';
  }
}

function clearBatch() {
  _batchFiles = [];
  renderRenameList();
  updateBatchPreview();
  document.getElementById('batchFileInput').value = '';
  document.getElementById('batchDownloadBtn').disabled = true;
  document.getElementById('batchCount').textContent = '';
}

function downloadBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}
