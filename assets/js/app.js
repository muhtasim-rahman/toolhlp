'use strict';

const TOOLS = [
  { id:'commit-generator',    title:'Commit Generator',  desc:'Generate multi-shell git commit commands with conventional commits support.',        icon:'fa-solid fa-code-commit',           cat:'git',   color:'teal',  route:'commit-generator'    },
  { id:'git-log-visualizer',  title:'Git Log Visualizer',desc:'Paste git log output and get a beautiful color-coded commit timeline.',              icon:'fa-solid fa-diagram-project',       cat:'git',   color:'teal',  route:'git-log-visualizer'  },
  { id:'image-exif-remover',  title:'EXIF Remover',      desc:'Strip GPS, dates, and camera metadata from images entirely in your browser.',       icon:'fa-solid fa-eraser',                cat:'image', color:'amber', route:'image-exif-remover'  },
  { id:'image-batch-renamer', title:'Batch Renamer',     desc:'Upload, reorder by drag & drop, set a naming pattern, and download as ZIP.',        icon:'fa-solid fa-file-signature',        cat:'image', color:'amber', route:'image-batch-renamer' },
  { id:'url-metadata',        title:'URL Metadata',      desc:'Extract Open Graph, thumbnails, title, and keywords from any URL.',                 icon:'fa-solid fa-link',                  cat:'dev',   color:'blue',  route:'url-metadata'        },
  { id:'json-formatter',      title:'JSON Formatter',    desc:'Prettify, minify, and validate JSON with syntax highlighting.',                     icon:'fa-solid fa-code',        cat:'dev',   color:'blue',  route:'json-formatter'      },
  { id:'regex-tester',        title:'Regex Tester',      desc:'Live regex match highlighting, capture groups, and a cheat sheet.',                 icon:'fa-solid fa-magnifying-glass-chart', cat:'dev',  color:'blue',  route:'regex-tester'        }
];

const ROUTES = {
  '':                    'view-home',
  'home':                'view-home',
  'tools':               'view-tools',
  'docs':                'view-docs',
  'about':               'view-about',
  'contact':             'view-contact',
  'commit-generator':    'view-commit-generator',
  'git-log-visualizer':  'view-git-log-visualizer',
  'image-exif-remover':  'view-image-exif-remover',
  'image-batch-renamer': 'view-image-batch-renamer',
  'url-metadata':        'view-url-metadata',
  'json-formatter':      'view-json-formatter',
  'regex-tester':        'view-regex-tester'
};

let currentRoute = '';

/* Branding */
function initBranding() {
  if (!window.CONFIG) return;
  const name = CONFIG.appName;
  const split = CONFIG.nameSplit || 3;
  const p1 = name.substring(0, name.length - split);
  const p2 = name.substring(name.length - split);
  document.querySelectorAll('.site-name').forEach(el => el.innerHTML = p1 + '<span>' + p2 + '</span>');
  document.querySelectorAll('.version-label').forEach(el => el.innerHTML = '<i class="fa-solid fa-tag"></i> v' + CONFIG.version);
  document.title = CONFIG.appName + ' — ' + CONFIG.tagline;
  const favicon = document.getElementById('favicon');
  if (favicon) favicon.href = 'logo.svg';
}

/* Router */
function navigate(route, push) {
  if (push === undefined) push = true;
  if (route === currentRoute && document.getElementById(ROUTES[route] || 'view-home') && document.getElementById(ROUTES[route] || 'view-home').classList.contains('active')) return;
  var currentView = document.querySelector('.view.active');
  if (currentView) currentView.classList.add('leaving');
  setTimeout(function() {
    currentRoute = route;
    document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active','leaving'); });
    var viewId = ROUTES[route] || 'view-home';
    var target = document.getElementById(viewId);
    if (target) { target.classList.add('active'); window.scrollTo({top:0,behavior:'smooth'}); }
    if (push) history.pushState({route:route},'',route ? '#'+route : '#');
    document.querySelectorAll('[data-route]').forEach(function(el) {
      el.classList.toggle('active', el.dataset.route===route||(route===''&&el.dataset.route==='home'));
    });
    var appName = window.CONFIG ? CONFIG.appName : 'ToolHlp';
    var tool = TOOLS.find(function(t){return t.route===route;});
    var pageTitles = {tools:'All Tools',docs:'Documentation',about:'About',contact:'Contact'};
    document.title = tool ? tool.title+' — '+appName : (pageTitles[route] ? pageTitles[route]+' — '+appName : appName+' — Developer Tools');
    closeSidebar();
  }, currentView ? 160 : 0);
}
function handleHash() {
  var h = location.hash.replace('#','').trim();
  if (ROUTES[h] !== undefined) { navigate(h,false); }
  else if (!h||h==='/') { navigate('',false); }
  else { navigate('',false); history.replaceState(null,'','#'); }
}
window.addEventListener('popstate', handleHash);

/* Theme */
var THEME_KEY = 'dth_theme';
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  var dark = theme==='dark';
  document.getElementById('themeBtn').innerHTML = '<i class="fa-solid '+(dark?'fa-moon':'fa-sun')+'"></i>';
  var sb = document.getElementById('sbThemeBtn');
  if (sb) sb.innerHTML = '<i class="fa-solid '+(dark?'fa-moon':'fa-sun')+'"></i><span>'+(dark?'Dark':'Light')+' Mode</span>';
}
function toggleTheme() { applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'); }

/* Sidebar */
function openSidebar()  { document.getElementById('sidebar').classList.add('open');    document.getElementById('sbOverlay').classList.add('show');    document.getElementById('hamBtn').classList.add('open');    document.body.style.overflow='hidden'; }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sbOverlay').classList.remove('show'); document.getElementById('hamBtn').classList.remove('open'); document.body.style.overflow=''; }

/* Toast */
var _toastTimer;
function showToast(msg, type) {
  type = type||'info';
  var t=document.getElementById('toast'), m=document.getElementById('toastMsg');
  if(!t||!m) return;
  m.textContent=msg; t.className='toast '+type+' show';
  clearTimeout(_toastTimer); _toastTimer=setTimeout(function(){t.classList.remove('show');},2600);
}

/* Tool Cards */
function buildToolCard(tool) {
  var btn = document.createElement('button');
  btn.className = 'tool-card'; btn.dataset.cat = tool.cat;
  btn.innerHTML = '<div class="tc-icon '+tool.color+'"><i class="'+tool.icon+'"></i></div><div class="tc-body"><div class="tc-title">'+tool.title+'</div><div class="tc-desc">'+tool.desc+'</div></div><div class="tc-foot"><span class="tc-tag">'+(tool.cat==='git'?'Git':tool.cat==='image'?'Image':'Developer')+'</span><i class="fa-solid fa-arrow-right tc-arr"></i></div>';
  btn.addEventListener('click', function(){ navigate(tool.route); });
  return btn;
}
function populateGrids() {
  var hg=document.getElementById('homeToolsGrid'), ag=document.getElementById('allToolsGrid');
  TOOLS.forEach(function(t){ if(hg) hg.appendChild(buildToolCard(t)); if(ag) ag.appendChild(buildToolCard(t)); });
}
function initCatFilter() {
  var btns = document.querySelectorAll('#catFilter .cat-btn');
  btns.forEach(function(btn){ btn.addEventListener('click', function(){
    btns.forEach(function(b){b.classList.remove('active');}); btn.classList.add('active');
    var cat=btn.dataset.cat;
    document.querySelectorAll('#allToolsGrid .tool-card').forEach(function(c){ c.style.display=(cat==='all'||c.dataset.cat===cat)?'':'none'; });
  }); });
}

/* Contact */
function submitContact() {
  var name=document.getElementById('cfName').value.trim(), email=document.getElementById('cfEmail').value.trim(), msg=document.getElementById('cfMsg').value.trim();
  if(!name||!msg){showToast('Please fill name and message.','err');return;}
  var to   = window.CONFIG ? CONFIG.contactEmail : 'mdturzo.dev@gmail.com';
  var sub  = encodeURIComponent('[ToolHlp] Message from '+name);
  var body = encodeURIComponent('Name: '+name+'\nEmail: '+(email||'—')+'\n\n'+msg);
  window.location.href = 'mailto:'+to+'?subject='+sub+'&body='+body;
  showToast('Opening your email client…','ok');
}

/* Mega Menu hover bridge */
function initMegaMenu() {
  document.querySelectorAll('.has-mega').forEach(function(li) {
    var closeTimer;
    var mega = li.querySelector('.mega');
    function show(){ clearTimeout(closeTimer); li.classList.add('mega-open'); }
    function hide(){ closeTimer = setTimeout(function(){ li.classList.remove('mega-open'); }, 120); }
    li.addEventListener('mouseenter', show);
    li.addEventListener('mouseleave', hide);
    if (mega) { mega.addEventListener('mouseenter', show); mega.addEventListener('mouseleave', hide); }
  });
}

/* Init */
document.addEventListener('DOMContentLoaded', function() {
  initBranding();
  applyTheme(localStorage.getItem(THEME_KEY) || (window.CONFIG && CONFIG.theme ? CONFIG.theme.defaultMode : 'dark'));
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);
  var sbBtn = document.getElementById('sbThemeBtn');
  if (sbBtn) sbBtn.addEventListener('click', toggleTheme);
  document.getElementById('hamBtn').addEventListener('click', function(){ document.getElementById('sidebar').classList.contains('open')?closeSidebar():openSidebar(); });
  document.getElementById('sbOverlay').addEventListener('click', closeSidebar);
  document.getElementById('sbClose').addEventListener('click', closeSidebar);
  document.querySelectorAll('[data-route]').forEach(function(el){ el.addEventListener('click',function(e){e.preventDefault();navigate(el.dataset.route);}); });
  document.querySelectorAll('footer a[href^="#"]').forEach(function(a){ a.addEventListener('click',function(e){e.preventDefault();navigate(a.getAttribute('href').replace('#',''));}); });
  document.querySelectorAll('.nav-logo').forEach(function(el){ el.addEventListener('click',function(e){e.preventDefault();navigate('home');}); });
  document.querySelectorAll('.sb-cat-toggle').forEach(function(btn){ btn.addEventListener('click',function(){
    var id=btn.dataset.cat, links=document.getElementById('cat-'+id), open=links.classList.toggle('open');
    btn.classList.toggle('open',open);
  }); });
  var nav=document.getElementById('navbar');
  window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>10);},{passive:true});
  document.querySelectorAll('.guide-toggle').forEach(function(btn){ btn.addEventListener('click',function(){
    var id=btn.dataset.guide, body=document.getElementById('guide-'+id), open=body.classList.toggle('open');
    btn.classList.toggle('open',open);
  }); });
  initMegaMenu();
  populateGrids();
  initCatFilter();
  handleHash();
  if(typeof initCommitGenerator==='function')   initCommitGenerator();
  if(typeof initGitLogVisualizer==='function')  initGitLogVisualizer();
  if(typeof initExifRemover==='function')       initExifRemover();
  if(typeof initBatchRenamer==='function')      initBatchRenamer();
  if(typeof initUrlMetadata==='function')       initUrlMetadata();
  if(typeof initJsonFormatter==='function')     initJsonFormatter();
  if(typeof initRegexTester==='function')       initRegexTester();
});

/* ─── Docs side-nav ─── */
function initDocsNav() {
  var navLinks = document.querySelectorAll('.docs-nav a[data-doc]');
  if (!navLinks.length) return;

  // Click: scroll to section
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var id = link.dataset.doc;
      var target = document.getElementById(id);
      if (!target) return;
      var offset = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) + 24);
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });

  // Scroll spy: highlight active link
  var sections = [];
  navLinks.forEach(function(link) {
    var el = document.getElementById(link.dataset.doc);
    if (el) sections.push({ id: link.dataset.doc, el: el });
  });

  var navH = 68 + 40; // nav height + buffer
  function onScroll() {
    // Only run when docs view is active
    if (!document.getElementById('view-docs').classList.contains('active')) return;
    var scrollY = window.scrollY;
    var active = sections[0];
    sections.forEach(function(s) {
      if (s.el.getBoundingClientRect().top + window.scrollY - navH <= scrollY) {
        active = s;
      }
    });
    navLinks.forEach(function(link) {
      link.classList.toggle('active', link.dataset.doc === active.id);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

// Call initDocsNav after DOM ready (append to existing DOMContentLoaded)
document.addEventListener('DOMContentLoaded', function() {
  initDocsNav();
});
