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

// Init site-level section tabs (About / Education / Skills / Projects / Contact)
;(function initSiteTabs(){
  const tablist = document.querySelector('.section-tabs');
  if(!tablist) return;
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));

  function showPanel(targetId){
    // hide all panels
    const panels = document.querySelectorAll('.panel');
    panels.forEach(p=>{ p.classList.add('is-hidden'); p.setAttribute('aria-hidden','true'); });
    // deselect tabs
    tabs.forEach(t=>t.setAttribute('aria-selected','false'));
    // show target
    const target = document.getElementById(targetId);
    if(target) target.classList.remove('is-hidden');
    if(target) target.removeAttribute('aria-hidden');
  }

  function activate(tab){
    const targetId = tab.getAttribute('data-target');
    tab.setAttribute('aria-selected','true');
    showPanel(targetId);
    tab.focus();
    // ensure the shown panel is visible at top of viewport
    const panel = document.getElementById(targetId);
    if(panel) panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  tabs.forEach((tab, idx)=>{
    tab.addEventListener('click', ()=> activate(tab));
    tab.addEventListener('keydown', (e)=>{
      if(e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
      activate(tabs[next]);
    });
  });
})();
