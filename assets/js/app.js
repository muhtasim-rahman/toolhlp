'use strict';
const TOOLS=[{id:'commit-generator',title:'Commit Generator',desc:'Generate multi-shell git commit commands with conventional commits support.',icon:'fa-solid fa-code-commit',cat:'git',color:'teal',route:'commit-generator'},{id:'git-log-visualizer',title:'Git Log Visualizer',desc:'Paste git log output and get a beautiful color-coded commit timeline.',icon:'fa-solid fa-diagram-project',cat:'git',color:'teal',route:'git-log-visualizer'},{id:'image-exif-remover',title:'EXIF Remover',desc:'Strip GPS, dates, and camera metadata from images entirely in your browser.',icon:'fa-solid fa-eraser',cat:'image',color:'amber',route:'image-exif-remover'},{id:'image-batch-renamer',title:'Batch Renamer',desc:'Upload, reorder by drag & drop, set a naming pattern, and download as ZIP.',icon:'fa-solid fa-file-signature',cat:'image',color:'amber',route:'image-batch-renamer'},{id:'url-metadata',title:'URL Metadata',desc:'Extract Open Graph, thumbnails, title, and keywords from any URL.',icon:'fa-solid fa-link',cat:'dev',color:'blue',route:'url-metadata'},{id:'json-formatter',title:'JSON Formatter',desc:'Prettify, minify, and validate JSON with syntax highlighting.',icon:'fa-solid fa-brackets-curly',cat:'dev',color:'blue',route:'json-formatter'},{id:'regex-tester',title:'Regex Tester',desc:'Live regex match highlighting, capture groups, and a cheat sheet.',icon:'fa-solid fa-magnifying-glass-chart',cat:'dev',color:'blue',route:'regex-tester'}];
const ROUTES={'':'view-home','home':'view-home','tools':'view-tools','about':'view-about','contact':'view-contact','commit-generator':'view-commit-generator','git-log-visualizer':'view-git-log-visualizer','image-exif-remover':'view-image-exif-remover','image-batch-renamer':'view-image-batch-renamer','url-metadata':'view-url-metadata','json-formatter':'view-json-formatter','regex-tester':'view-regex-tester'};
let currentRoute='';

function initBranding(){
  if(!window.CONFIG) return;
  const name = CONFIG.appName; // e.g. "ToolHlp"
  // Let's assume we want to highlight the last 3 chars or split it
  const p1 = name.substring(0, name.length - 3);
  const p2 = name.substring(name.length - 3);
  document.querySelectorAll('.site-name').forEach(el=>el.innerHTML=`${p1}<span>${p2}</span>`);
  document.querySelectorAll('.version-label').forEach(el=>el.innerHTML=`<i class="fa-solid fa-tag"></i> v${CONFIG.version}`);
  document.title=`${CONFIG.appName} — Developer Tools Collection`;
}

function navigate(route,push=true){
  if(route===currentRoute&&document.getElementById(ROUTES[route]||'view-home')?.classList.contains('active'))return;
  
  // Fade out current view
  const currentView = document.querySelector('.view.active');
  if(currentView) {
    currentView.style.opacity = '0';
    currentView.style.transform = 'translateY(10px)';
  }

  setTimeout(() => {
    currentRoute=route;
    document.querySelectorAll('.view').forEach(v=>{
      v.classList.remove('active');
      v.style.opacity = '';
      v.style.transform = '';
    });
    
    const viewId=ROUTES[route]||'view-home';
    const target=document.getElementById(viewId);
    if(target) {
      target.classList.add('active');
      window.scrollTo({top:0,behavior:'smooth'});
    }
    
    if(push)history.pushState({route},'',route?`#${route}`:'#');
    document.querySelectorAll('[data-route]').forEach(el=>{
      el.classList.remove('active');
      if(el.dataset.route===route||(route===''&&el.dataset.route==='home'))el.classList.add('active');
    });
    
    const tool=TOOLS.find(t=>t.route===route);
    const appName = window.CONFIG ? CONFIG.appName : 'ToolHlp';
    document.title=tool?`${tool.title} — ${appName}`:route==='tools'?`All Tools — ${appName}`:route==='docs'?`Docs — ${appName}`:route==='about'?`About — ${appName}`:`${appName} — Developer Tools`;
    closeSidebar();
  }, currentView ? 150 : 0);
}
function handleHash(){
  const h=location.hash.replace('#','').trim();
  if(ROUTES[h]){
    navigate(h,false);
  } else if(!h || h==='/'){
    navigate('home',false);
  } else {
    // Fallback for invalid routes
    navigate('home',false);
    history.replaceState(null,'','#');
  }
}
window.addEventListener('popstate',handleHash);

// Theme
const THEME_KEY='dth_theme';
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme',theme);
  localStorage.setItem(THEME_KEY,theme);
  const dark=theme==='dark';
  const ico=dark?'fa-moon':'fa-sun';
  document.getElementById('themeBtn').innerHTML=`<i class="fa-solid ${ico}"></i>`;
  document.getElementById('sbThemeBtn').innerHTML=`<i class="fa-solid ${ico}"></i><span>${dark?'Dark':'Light'} Mode</span>`;
}
function toggleTheme(){applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');}

// Sidebar
function openSidebar(){document.getElementById('sidebar').classList.add('open');document.getElementById('sbOverlay').classList.add('show');document.getElementById('hamBtn').classList.add('open');document.body.style.overflow='hidden';}
function closeSidebar(){document.getElementById('sidebar').classList.remove('open');document.getElementById('sbOverlay').classList.remove('show');document.getElementById('hamBtn').classList.remove('open');document.body.style.overflow='';}

// Toast
let _toastTimer;
function showToast(msg,type='info'){
  const t=document.getElementById('toast'),m=document.getElementById('toastMsg');
  m.textContent=msg;t.className=`toast ${type} show`;
  clearTimeout(_toastTimer);_toastTimer=setTimeout(()=>t.classList.remove('show'),2600);
}

// Tools grids
function buildToolCard(tool){
  const btn=document.createElement('button');
  btn.className='tool-card';btn.dataset.cat=tool.cat;
  btn.innerHTML=`<div class="tc-icon ${tool.color}"><i class="${tool.icon}"></i></div><div><div class="tc-title">${tool.title}</div><div class="tc-desc">${tool.desc}</div></div><div class="tc-foot"><span class="tc-tag">${tool.cat==='git'?'Git':tool.cat==='image'?'Image':'Developer'}</span><i class="fa-solid fa-arrow-right tc-arr"></i></div>`;
  btn.addEventListener('click',()=>navigate(tool.route));
  return btn;
}
function populateGrids(){
  const hg=document.getElementById('homeToolsGrid'),ag=document.getElementById('allToolsGrid');
  TOOLS.forEach(t=>{hg.appendChild(buildToolCard(t));ag.appendChild(buildToolCard(t));});
}
function initCatFilter(){
  const btns=document.querySelectorAll('#catFilter .cat-btn');
  btns.forEach(btn=>btn.addEventListener('click',()=>{
    btns.forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    const cat=btn.dataset.cat;
    document.querySelectorAll('#allToolsGrid .tool-card').forEach(c=>{c.style.display=(cat==='all'||c.dataset.cat===cat)?'':'none';});
  }));
}

// Contact
function submitContact(){
  const name=document.getElementById('cfName').value.trim(),email=document.getElementById('cfEmail').value.trim(),msg=document.getElementById('cfMsg').value.trim();
  if(!name||!msg){showToast('Please fill name and message.','err');return;}
  const b=encodeURIComponent(`**From:** ${name}\n**Email:** ${email}\n\n${msg}`),ti=encodeURIComponent(`[Contact] Message from ${name}`);
  window.open(`${CONFIG.repoUrl}/issues/new?title=${ti}&body=${b}`,'_blank');
}

// Init
document.addEventListener('DOMContentLoaded',()=>{
  initBranding();
  applyTheme(localStorage.getItem(THEME_KEY)||'dark');
  document.getElementById('themeBtn').addEventListener('click',toggleTheme);
  document.getElementById('sbThemeBtn').addEventListener('click',toggleTheme);
  document.getElementById('hamBtn').addEventListener('click',()=>document.getElementById('sidebar').classList.contains('open')?closeSidebar():openSidebar());
  document.getElementById('sbOverlay').addEventListener('click',closeSidebar);
  document.getElementById('sbClose').addEventListener('click',closeSidebar);
  document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();navigate(el.dataset.route);}));
  document.querySelectorAll('footer a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();navigate(a.getAttribute('href').replace('#',''));}));
  document.querySelectorAll('.nav-logo').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();navigate('home');}));
  // Sidebar cat toggles
  document.querySelectorAll('.sb-cat-toggle').forEach(btn=>btn.addEventListener('click',()=>{
    const id=btn.dataset.cat,links=document.getElementById(`cat-${id}`),open=links.classList.toggle('open');
    btn.classList.toggle('open',open);
  }));
  // Navbar scroll
  const nav=document.getElementById('navbar');
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>10),{passive:true});
  // Guide toggles
  document.querySelectorAll('.guide-toggle').forEach(btn=>btn.addEventListener('click',()=>{
    const id=btn.dataset.guide,body=document.getElementById(`guide-${id}`),open=body.classList.toggle('open');
    btn.classList.toggle('open',open);
  }));
  populateGrids();initCatFilter();handleHash();
  if(typeof initCommitGenerator==='function')initCommitGenerator();
  if(typeof initGitLogVisualizer==='function')initGitLogVisualizer();
  if(typeof initExifRemover==='function')initExifRemover();
  if(typeof initBatchRenamer==='function')initBatchRenamer();
  if(typeof initUrlMetadata==='function')initUrlMetadata();
  if(typeof initJsonFormatter==='function')initJsonFormatter();
  if(typeof initRegexTester==='function')initRegexTester();
});
ommitGenerator();
  if(typeof initGitLogVisualizer==='function')initGitLogVisualizer();
  if(typeof initExifRemover==='function')initExifRemover();
  if(typeof initBatchRenamer==='function')initBatchRenamer();
  if(typeof initUrlMetadata==='function')initUrlMetadata();
  if(typeof initJsonFormatter==='function')initJsonFormatter();
  if(typeof initRegexTester==='function')initRegexTester();
});
initExifRemover();
  if(typeof initBatchRenamer==='function')initBatchRenamer();
  if(typeof initUrlMetadata==='function')initUrlMetadata();
  if(typeof initJsonFormatter==='function')initJsonFormatter();
  if(typeof initRegexTester==='function')initRegexTester();
});
