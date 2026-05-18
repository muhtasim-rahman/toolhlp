/* =========================================================
   ToolHlp — url-metadata.js
   Multi-engine URL metadata extractor
   ========================================================= */
'use strict';

const URL_HISTORY_KEY = 'dth_url_history';

function initUrlMetadata() {
  const input = document.getElementById('urlInput');
  if (!input) return;

  input.addEventListener('input', () => {
    const clr = document.getElementById('urlClearBtn');
    if (clr) clr.style.display = input.value ? 'block' : 'none';
  });

  input.addEventListener('focus', showUrlSuggestions);
  input.addEventListener('keypress', e => { if (e.key === 'Enter') startUrlScan(); });
  document.addEventListener('click', e => {
    if (!e.target.closest('#urlInput') && !e.target.closest('#urlSuggestions')) {
      const s = document.getElementById('urlSuggestions');
      if (s) s.style.display = 'none';
    }
  });
}

function clearUrl() {
  const input = document.getElementById('urlInput');
  if (input) input.value = '';
  const clr = document.getElementById('urlClearBtn');
  if (clr) clr.style.display = 'none';
  const s = document.getElementById('urlSuggestions');
  if (s) s.style.display = 'none';
}

function showUrlSuggestions() {
  const history = JSON.parse(localStorage.getItem(URL_HISTORY_KEY) || '[]');
  const box = document.getElementById('urlSuggestions');
  if (!box || !history.length) return;
  box.innerHTML = history.map(url =>
    `<div onclick="selectUrlSuggestion('${url.replace(/'/g,"\\'")}')
" style="padding:10px 14px;cursor:pointer;font-size:13px;border-bottom:1px solid var(--border);color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:background var(--t)"
onmouseover="this.style.background='var(--accent-glow)';this.style.color='var(--text)'"
onmouseout="this.style.background='';this.style.color='var(--text-muted)'">${url}</div>`
  ).join('');
  box.style.display = 'block';
}

function selectUrlSuggestion(url) {
  const input = document.getElementById('urlInput');
  if (input) input.value = url;
  document.getElementById('urlSuggestions').style.display = 'none';
  document.getElementById('urlClearBtn').style.display = 'block';
}

function saveUrlHistory(url) {
  let h = JSON.parse(localStorage.getItem(URL_HISTORY_KEY) || '[]');
  h = h.filter(x => x !== url);
  h.unshift(url);
  localStorage.setItem(URL_HISTORY_KEY, JSON.stringify(h.slice(0, 8)));
}

function urlLog(msg, type = 'info') {
  const box = document.getElementById('urlLogBox');
  if (!box) return;
  const time = new Date().toLocaleTimeString();
  const line = document.createElement('div');
  line.className = `log-line log-${type}`;
  line.textContent = `[${time}] ${msg}`;
  box.appendChild(line);
  box.scrollTop = box.scrollHeight;
}

// Extraction engines
async function fetchMicrolink(url) {
  const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}&video=true&screenshot=true`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.status !== 'success') throw new Error('API failure');
  const d = json.data;
  if (!d.title && !d.image) throw new Error('Incomplete data');
  return { engine:'Microlink API', title:d.title, desc:d.description, image:d.image?.url||d.screenshot?.url, video:d.video?.url, domain:new URL(url).hostname.replace('www.',''), author:d.author, provider:d.publisher||d.provider, lang:d.lang, favicon:d.logo?.url, url:d.url||url };
}
async function fetchDubCo(url) {
  const res = await fetch(`https://api.dub.co/metatags?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const d = await res.json();
  if (!d.title && !d.image) throw new Error('No meta tags');
  return { engine:'Dub.co Meta Engine', title:d.title, desc:d.description, image:d.image, video:null, domain:new URL(url).hostname.replace('www.',''), author:null, provider:null, lang:null, favicon:`https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`, url };
}
async function fetchJsonLink(url) {
  const res = await fetch(`https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const d = await res.json();
  if (!d.title && (!d.images||!d.images.length)) throw new Error('No data');
  return { engine:'JSONLink Scraper', title:d.title, desc:d.description, image:d.images?.[0]||null, video:null, domain:d.domain||new URL(url).hostname.replace('www.',''), author:d.author, provider:d.sitename, lang:null, favicon:d.favicon, url:d.url||url };
}
async function fetchRawHTML(url) {
  const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (!json.contents) throw new Error('Empty response');
  const doc = new DOMParser().parseFromString(json.contents,'text/html');
  const title = doc.querySelector('meta[property="og:title"]')?.content || doc.querySelector('title')?.textContent;
  const desc  = doc.querySelector('meta[property="og:description"]')?.content || doc.querySelector('meta[name="description"]')?.content;
  const image = doc.querySelector('meta[property="og:image"]')?.content || doc.querySelector('meta[name="twitter:image"]')?.content;
  const video = doc.querySelector('meta[property="og:video:url"]')?.content;
  if (!title && !image) throw new Error('Parsing failed');
  return { engine:'Raw DOM Parser (AllOrigins)', title, desc, image, video, domain:new URL(url).hostname.replace('www.',''), author:null, provider:doc.querySelector('meta[property="og:site_name"]')?.content, lang:doc.querySelector('html')?.lang||null, favicon:`https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`, url };
}

async function startUrlScan() {
  let url = document.getElementById('urlInput')?.value.trim();
  if (!url) { showToast('Enter a URL first.', 'err'); return; }
  if (!url.startsWith('http')) url = 'https://' + url;

  saveUrlHistory(url);
  document.getElementById('urlSuggestions').style.display = 'none';
  document.getElementById('urlResultsWrap').style.display = 'none';
  document.getElementById('urlVideoCard').style.display = 'none';
  document.getElementById('urlLogBox').innerHTML = '';
  document.getElementById('urlLoaderPanel').style.display = '';

  const btn = document.getElementById('urlScanBtn');
  btn.disabled = true; btn.textContent = 'Scanning…';

  urlLog(`Target: ${url}`, 'info');

  const methods = [
    { name:'Microlink (Primary)',    fn: fetchMicrolink },
    { name:'Dub.co (Secondary)',     fn: fetchDubCo     },
    { name:'JSONLink (Fallback 1)',  fn: fetchJsonLink  },
    { name:'Raw DOM (Last resort)',  fn: fetchRawHTML   },
  ];

  let result = null;
  for (let i = 0; i < methods.length; i++) {
    urlLog(`Trying Engine ${i+1}: ${methods[i].name}…`, 'warn');
    try {
      result = await methods[i].fn(url);
      if (result?.title || result?.image) { urlLog(`Success via ${methods[i].name}`, 'ok'); break; }
    } catch(e) { urlLog(`Engine ${i+1} failed: ${e.message}`, 'err'); }
  }

  await new Promise(r => setTimeout(r, 600));
  document.getElementById('urlLoaderPanel').style.display = 'none';
  btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-radar"></i> Deep Scan';

  if (result) renderUrlResult(result);
  else showToast('All engines failed. Site may be bot-protected.', 'err');
}

function renderUrlResult(d) {
  // Video
  const vBox = document.getElementById('urlVideoBox');
  if (d.video) {
    vBox.innerHTML = `<video src="${d.video}" controls poster="${d.image||''}" style="max-width:100%;max-height:320px"></video>`;
    document.getElementById('urlVideoCard').style.display = '';
    set('rType', 'VIDEO / MEDIA CONTENT');
  } else { set('rType', 'STANDARD WEB PAGE'); }

  // Image
  const iBox = document.getElementById('urlImageBox');
  iBox.innerHTML = d.image
    ? `<img src="${d.image}" alt="Thumbnail" style="max-width:100%;max-height:320px;object-fit:contain">`
    : `<div class="no-media-msg"><i class="fa-solid fa-image" style="font-size:24px;display:block;margin-bottom:8px"></i>No image found</div>`;

  set('rTitle',    d.title    || 'Unknown');
  set('rDomain',   d.domain   || '—');
  set('rProvider', d.provider || '—');
  set('rAuthor',   d.author   || '—');
  set('rLang',     d.lang     ? d.lang.toUpperCase() : '—');
  set('rEngine',   d.engine   || '—');
  set('rDesc',     d.desc     || 'No description available.');

  const fav = document.getElementById('rFav');
  if (d.favicon) { fav.src = d.favicon; fav.style.display = 'block'; } else fav.style.display = 'none';

  const urlA = document.getElementById('rUrl');
  urlA.href = d.url; urlA.textContent = d.url;

  // Tags
  const combined = ((d.title||'') + ' ' + (d.desc||'')).replace(/[^\w\s]/g,'').toLowerCase();
  const words = [...new Set(combined.split(/\s+/).filter(w => w.length > 4))].slice(0, 15);
  const tBox = document.getElementById('rTags');
  tBox.innerHTML = words.map(w => `<span class="tag-item">${w}</span>`).join('');
  document.getElementById('urlTagsCard').style.display = words.length ? '' : 'none';

  document.getElementById('urlResultsWrap').style.display = '';
}

function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
