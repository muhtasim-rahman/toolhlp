/* =========================================================
   DevKit — config.js
   Single source of truth. Change here → updates everywhere.
   ========================================================= */
const SITE = {
  name:        'Tool Hlp',
  tagline:     'Developer tools, all in one place',
  description: 'A fast, browser-based collection of developer utilities. No installs, no sign-ups, no tracking.',
  version:     'v1.0.3',
  author:      'Muhtasim Rahman',
  github:      'https://github.com/muhtasim-rahman',
  repo:        'https://github.com/muhtasim-rahman/toolhlp',
  portfolio:   'https://mdturzo.web.app',
  live:        'https://muhtasim-rahman.github.io/toolhlp/',
  year:        new Date().getFullYear(),
  logo:        'assets/images/logo.svg',
  favicon:     'assets/images/logo.svg',
  themeKey:    'devkit_theme',
  defaultTheme:'dark',
};

const TOOL_LIST = [
  { id:'commit-generator',   title:'Commit Generator',   desc:'Multi-shell git commit commands with conventional commits.',  icon:'fa-solid fa-code-commit',             cat:'git',   color:'green', route:'/tools/commit-generator'   },
  { id:'git-log-visualizer', title:'Log Visualizer',     desc:'Paste git log output and get a visual commit timeline.',      icon:'fa-solid fa-diagram-project',         cat:'git',   color:'green', route:'/tools/git-log-visualizer' },
  { id:'image-exif-remover', title:'EXIF Remover',       desc:'Strip GPS, dates and metadata from images in your browser.',  icon:'fa-solid fa-eraser',                  cat:'image', color:'amber', route:'/tools/image-exif-remover' },
  { id:'image-batch-renamer',title:'Batch Renamer',      desc:'Reorder images, set naming pattern, download as ZIP.',        icon:'fa-solid fa-file-signature',          cat:'image', color:'amber', route:'/tools/image-batch-renamer'},
  { id:'url-metadata',       title:'URL Metadata',       desc:'Extract Open Graph metadata from any URL, 4-engine fallback.',icon:'fa-solid fa-link',                    cat:'dev',   color:'blue',  route:'/tools/url-metadata'       },
  { id:'json-formatter',     title:'JSON Formatter',     desc:'Prettify, minify and validate JSON with syntax highlighting.', icon:'fa-solid fa-code',          cat:'dev',   color:'blue',  route:'/tools/json-formatter'     },
  { id:'regex-tester',       title:'Regex Tester',       desc:'Live match highlighting, groups, and a cheat sheet.',         icon:'fa-solid fa-magnifying-glass-chart',  cat:'dev',   color:'blue',  route:'/tools/regex-tester'       },
];

// Inject <title>, favicon, footer brand dynamically
(function applyConfig(){
  document.addEventListener('DOMContentLoaded', () => {
    // Favicon
    const fav = document.createElement('link');
    fav.rel = 'icon'; fav.type = 'image/svg+xml'; fav.href = SITE.favicon;
    document.head.appendChild(fav);
    // Brand name in all .brand-name elements
    document.querySelectorAll('.brand-name').forEach(el => el.textContent = SITE.name);
    document.querySelectorAll('.brand-ver').forEach(el => el.textContent = SITE.version);
    document.querySelectorAll('.site-tagline').forEach(el => el.textContent = SITE.tagline);
    document.querySelectorAll('.site-year').forEach(el => el.textContent = SITE.year);
    document.querySelectorAll('.site-version').forEach(el => el.textContent = SITE.version);
    document.querySelectorAll('.brand-logo img').forEach(img => img.src = SITE.logo);
    document.querySelectorAll('a.link-github').forEach(a => a.href = SITE.github);
    document.querySelectorAll('a.link-repo').forEach(a => a.href = SITE.repo);
    document.querySelectorAll('a.link-portfolio').forEach(a => a.href = SITE.portfolio);
  });
})();
