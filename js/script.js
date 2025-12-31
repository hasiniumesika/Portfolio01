// Simple nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if(navToggle && navLinks){
  // accessibility: indicate expanded state
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.addEventListener('click', ()=>{
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('show');
  });

  // close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=>{
      navLinks.classList.remove('show');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Helper: add project cards (to be used when you provide projects)
function addProject({title,description,link}){
  const grid=document.getElementById('projectGrid');
  if(!grid) return;
  const card=document.createElement('div');
  card.className='project-card';
  card.innerHTML=`<h3>${title}</h3><p class="muted">${description}</p>${link?`<p><a href="${link}" target="_blank">View</a></p>`:''}`;
  grid.appendChild(card);
}

// Example placeholder

/* Theme handling */
function applyTheme(theme){
  const root = document.documentElement;
  if(theme==='dark') root.setAttribute('data-theme','dark'); else root.removeAttribute('data-theme');
  const btn = document.getElementById('themeToggle');
  if(btn) btn.setAttribute('aria-pressed', String(theme==='dark'));
}

function detectSystemTheme(){
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function initThemeToggle(){
  const btn = document.getElementById('themeToggle');
  if(!btn) return;
  // Load preference from localStorage or fall back to system
  const stored = localStorage.getItem('theme');
  const initial = stored || detectSystemTheme();
  applyTheme(initial);

  btn.addEventListener('click',()=>{
    // toggle
    const current = document.documentElement.getAttribute('data-theme')==='dark' ? 'dark' : 'light';
    const next = current==='dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

// initialize theme after DOM ready
document.addEventListener('DOMContentLoaded', initThemeToggle);
