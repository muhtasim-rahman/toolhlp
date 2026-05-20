/* =========================================================
   Tool Hlp — app.js  v1.0.3
   Router · Theme · Navbar · Sidebar · Toast · Grid Builder
   ========================================================= */
'use strict';

/* ── Router ──────────────────────────────────────────────
   Hash format:  #/              → home
                 #/tools         → tools grid
                 #/tools/:id     → specific tool
                 #/docs          → docs
                 #/about         → about
                 #/contact       → contact
   ─────────────────────────────────────────────────────── */
const ROUTES = {
  '/':                      'view-home',
  '/tools':                 'view-tools',
  '/tools/commit-generator':    'view-commit-generator',
  '/tools/git-log-visualizer':  'view-git-log-visualizer',
  '/tools/image-exif-remover':  'view-image-exif-remover',
  '/tools/image-batch-renamer': 'view-image-batch-renamer',
  '/tools/url-metadata':        'view-url-metadata',
  '/tools/json-formatter':      'view-json-formatter',
  '/tools/regex-tester':        'view-regex-tester',
  '/docs':                  'view-docs',
  '/about':                 'view-about',
  '/contact':               'view-contact',
};

const TITLES = {
  '/':                      () => SITE.name + ' — Developer Tools',
  '/tools':                 () => 'All Tools — ' + SITE.name,
  '/docs':                  () => 'Docs — ' + SITE.name,
  '/about':                 () => 'About — ' + SITE.name,
  '/contact':               () => 'Contact — ' + SITE.name,
};
TOOL_LIST.forEach(t => {
  TITLES[t.route] = () => t.title + ' — ' + SITE.name;
});

let _currentPath = '';

function navigate(path, push = true) {
  // Normalise
  if (!path.startsWith('/')) path = '/' + path;
  if (path === _currentPath && document.getElementById(ROUTES[path])?.classList.contains('active')) return;
  _currentPath = path;

  // Show/hide views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const viewId = ROUTES[path] || 'view-404';
  const el = document.getElementById(viewId);
  if (el) el.classList.add('active');
  else { document.getElementById('view-home')?.classList.add('active'); }

  // Scroll
  window.scrollTo({ top: 0, behavior: 'instant' });

  // History
  if (push) history.pushState({ path }, '', '#' + path);

  // Page title
  document.title = (TITLES[path] ? TITLES[path]() : SITE.name);

  // Active nav
  document.querySelectorAll('[data-path]').forEach(el => {
    el.classList.toggle('active', el.dataset.path === path || (path.startsWith(el.dataset.path + '/') && el.dataset.path !== '/'));
  });

  closeSidebar();
}

function handleHash() {
  const h = location.hash.replace('#', '') || '/';
  navigate(h, false);
}

window.addEventListener('popstate', handleHash);

/* ── Theme ───────────────────────────────────────────── */
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem(SITE.themeKey, t);
  const dark = t === 'dark';
  const ico = dark ? 'fa-moon' : 'fa-sun';
  const lbl = dark ? 'Dark Mode' : 'Light Mode';
  document.getElementById('themeBtn').innerHTML = `<i class="fa-solid ${ico}"></i>`;
  const sb = document.getElementById('sbThemeBtn');
  if (sb) sb.innerHTML = `<i class="fa-solid ${ico}"></i><span>${lbl}</span>`;
}
function toggleTheme() {
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

/* ── Sidebar ─────────────────────────────────────────── */
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sbOverlay').classList.add('show');
  document.getElementById('hamBtn').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sbOverlay').classList.remove('show');
  document.getElementById('hamBtn').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Mega Menu (hover with delay) ────────────────────── */
let _megaTimer;
function initMegaMenu() {
  document.querySelectorAll('.mega-wrap').forEach(wrap => {
    const menu = wrap.querySelector('.mega-menu');
    if (!menu) return;
    wrap.addEventListener('mouseenter', () => {
      clearTimeout(_megaTimer);
      wrap.classList.add('open');
      wrap.querySelector('.chev')?.classList.add('chev-open');
    });
    wrap.addEventListener('mouseleave', () => {
      _megaTimer = setTimeout(() => {
        wrap.classList.remove('open');
        wrap.querySelector('.chev')?.classList.remove('chev-open');
      }, 140);
    });
    menu.addEventListener('mouseenter', () => clearTimeout(_megaTimer));
    menu.addEventListener('mouseleave', () => {
      _megaTimer = setTimeout(() => {
        wrap.classList.remove('open');
        wrap.querySelector('.chev')?.classList.remove('chev-open');
      }, 140);
    });
  });
}

/* ── Toast ───────────────────────────────────────────── */
let _toastTimer;
function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  const m = document.getElementById('toastMsg');
  m.textContent = msg;
  const icons = { ok:'fa-circle-check', err:'fa-circle-exclamation', warn:'fa-triangle-exclamation', info:'fa-circle-info' };
  t.querySelector('i').className = 'fa-solid ' + (icons[type] || icons.info);
  t.className = `toast ${type} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ── Tools Grid ──────────────────────────────────────── */
function buildCard(tool) {
  const btn = document.createElement('button');
  btn.className = 'tool-card';
  btn.dataset.cat = tool.cat;
  btn.innerHTML = `
    <div class="tc-icon ${tool.color}"><i class="${tool.icon}"></i></div>
    <div>
      <div class="tc-title">${tool.title}</div>
      <div class="tc-desc">${tool.desc}</div>
    </div>
    <div class="tc-foot">
      <span class="tc-tag">${tool.cat === 'git' ? 'Git' : tool.cat === 'image' ? 'Image' : 'Dev'}</span>
      <i class="fa-solid fa-arrow-right tc-arr"></i>
    </div>`;
  btn.addEventListener('click', () => navigate(tool.route));
  return btn;
}
function populateGrids() {
  ['homeGrid','allGrid'].forEach(id => {
    const g = document.getElementById(id);
    if (g) TOOL_LIST.forEach(t => g.appendChild(buildCard(t)));
  });
}

/* ── Category Filter ─────────────────────────────────── */
function initCatFilter() {
  document.querySelectorAll('#catFilter .cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#catFilter .cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('#allGrid .tool-card').forEach(c => {
        c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}

/* ── Sidebar Category Toggles ───────────────────────── */
function initSbCats() {
  document.querySelectorAll('.sb-cat-hd').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.cat;
      const links = document.getElementById('sbc-' + id);
      const open = links?.classList.toggle('open');
      btn.classList.toggle('open', open);
    });
  });
}

/* ── Guide Toggles ───────────────────────────────────── */
function initGuides() {
  document.querySelectorAll('.guide-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = document.getElementById('gb-' + btn.dataset.g);
      const open = body?.classList.toggle('open');
      btn.classList.toggle('open', open);
    });
  });
}

/* ── Docs Nav ────────────────────────────────────────── */
function initDocsNav() {
  document.querySelectorAll('.docs-nav a[data-doc]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById('doc-' + a.dataset.doc);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.querySelectorAll('.docs-nav a').forEach(x => x.classList.remove('active'));
      a.classList.add('active');
    });
  });
}

/* ── Contact form ────────────────────────────────────── */
function submitContact() {
  const name = document.getElementById('cfName')?.value.trim();
  const email = document.getElementById('cfEmail')?.value.trim();
  const msg = document.getElementById('cfMsg')?.value.trim();
  if (!name || !msg) { showToast('Fill in name and message.', 'err'); return; }
  const b = encodeURIComponent(`**From:** ${name}\n**Email:** ${email || '—'}\n\n${msg}`);
  const ti = encodeURIComponent(`[Contact] Message from ${name}`);
  window.open(`${SITE.repo}/issues/new?title=${ti}&body=${b}`, '_blank');
}

/* ── Nav click handler ───────────────────────────────── */
function initNavLinks() {
  document.querySelectorAll('[data-path]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigate(el.dataset.path);
    });
  });
  // Footer & logo nav links
  document.querySelectorAll('a[href^="#/"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigate(a.getAttribute('href').replace('#', ''));
    });
  });
}

/* ── Init ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(localStorage.getItem(SITE.themeKey) || SITE.defaultTheme);

  document.getElementById('themeBtn').addEventListener('click', toggleTheme);
  document.getElementById('sbThemeBtn')?.addEventListener('click', toggleTheme);
  document.getElementById('hamBtn').addEventListener('click', () =>
    document.getElementById('sidebar').classList.contains('open') ? closeSidebar() : openSidebar()
  );
  document.getElementById('sbOverlay').addEventListener('click', closeSidebar);
  document.getElementById('sbClose').addEventListener('click', closeSidebar);

  window.addEventListener('scroll', () =>
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 8), { passive: true }
  );

  initNavLinks();
  initMegaMenu();
  initSbCats();
  initGuides();
  initDocsNav();
  populateGrids();
  initCatFilter();
  handleHash();

  // Init tools
  [initCommitGenerator, initGitLogVisualizer, initExifRemover,
   initBatchRenamer, initUrlMetadata, initJsonFormatter, initRegexTester
  ].forEach(fn => { try { if (typeof fn === 'function') fn(); } catch(e){} });
});
