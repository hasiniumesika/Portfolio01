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
document.addEventListener('DOMContentLoaded', ()=>{ initThemeToggle(); initAnimations(); });

/* Split heading text into characters for per-letter reveal */
function splitText(selector){
  document.querySelectorAll(selector).forEach(el=>{
    if(el.dataset._splitDone) return; // idempotent
    const text = el.textContent.trim();
    el.textContent='';
    const chars = Array.from(text);
    chars.forEach((ch,i)=>{
      const span = document.createElement('span');
      span.className='char';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = (i*45)+'ms';
      el.appendChild(span);
    });
    el.dataset._splitDone = 'true';
  });
}

/* Subtle 3D tilt on pointer move for cards */
function initCardTilt(){
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cards = document.querySelectorAll('.project-card, .detail-card, .contact-card');
  cards.forEach(card=>{
    card.classList.add('tiltable');
    let raf=0;
    card.addEventListener('pointermove', (e)=>{
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left)/rect.width - .5;
      const py = (e.clientY - rect.top)/rect.height - .5;
      const rotX = (-py)*6; const rotY = px*6;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        card.style.transform = `translateZ(0) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.01)`;
      });
    });
    card.addEventListener('pointerleave', ()=>{
      cancelAnimationFrame(raf);
      card.style.transform='none';
    });
  });
}

/* Animations: use IntersectionObserver to add 'in-view' to targets. Respects prefers-reduced-motion. */
function initAnimations(){
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    // reveal everything immediately
    document.querySelectorAll('.animate, .stagger > *, .project-card, .personal-card, .info-card, .site-footer .footer-grid, .detail-card, .contact-card').forEach(el=>el.classList.add('in-view'));
    return;
  }

  // prepare hero name for split reveal
  splitText('.hero-name');

  const selectors = ['.hero-top','.profile-img','.name','.hero-name','.lead','.cta','.personal-card','.project-card','.info-card','.detail-card','.details-grid','.contact-card','.contact-cards','.personal-cards','.project-grid','.site-footer .footer-grid'];
  const toObserve = Array.from(new Set(selectors.map(s=>Array.from(document.querySelectorAll(s))).flat()));

  if(toObserve.length===0) return;

  // Stagger child elements when container has class 'stagger'
  toObserve.forEach((el)=> el.classList.add('animate'));

  const obs = new IntersectionObserver((entries, ob)=>{
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        if(el.classList.contains('stagger')){
          Array.from(el.children).forEach((child,i)=>{
            setTimeout(()=> child.classList.add('in-view'), i*80);
          });
        }

        // when hero-top becomes visible, animate hero name chars
        if(el.matches('.hero-top')){
          const name = el.querySelector('.hero-name');
          if(name){ name.classList.add('in-view'); }
        }

        // add in-view (fade/scale animations)
        el.classList.add('in-view');

        // if it's a grid, also stagger children
        if(el.classList.contains('project-grid') || el.classList.contains('personal-cards') || el.classList.contains('details-grid') || el.classList.contains('contact-cards')){
          Array.from(el.children).forEach((child,i)=>{ child.style.transitionDelay = (i*80)+'ms'; child.classList.add('in-view'); });
        }
        ob.unobserve(el);
      }
    });
  },{threshold:0.12,rootMargin:'0px 0px -8% 0px'});

  toObserve.forEach(el => obs.observe(el));

  // init tilt interactions
  initCardTilt();
  // init color-follow pointer interactions
  initColorFollow();
  // init pointer overlay (site-wide spotlight + nav spot)
  initPointerOverlay();
}

/* Site-wide pointer overlay and nav highlight */
function initPointerOverlay(){
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const body = document.body;
  let overlay = document.getElementById('pointerOverlay');
  if(!overlay){
    overlay = document.createElement('div');
    overlay.id = 'pointerOverlay';
    overlay.className = 'pointer-overlay';
    body.appendChild(overlay);
  }
  const nav = document.querySelector('.nav');
  let navSpot = null;
  if(nav){
    // avoid creating duplicates
    navSpot = nav.querySelector('.nav-spot') || document.createElement('div');
    navSpot.className = 'nav-spot';
    if(!nav.querySelector('.nav-spot')) nav.appendChild(navSpot);
  }

  let ptrRaf=0, hideTimeout=0;
  document.addEventListener('pointermove', (e)=>{
    cancelAnimationFrame(ptrRaf);
    ptrRaf = requestAnimationFrame(()=>{
      overlay.style.left = e.clientX + 'px';
      overlay.style.top = e.clientY + 'px';
      overlay.classList.add('visible');
    });
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(()=> overlay.classList.remove('visible'), 900);
  }, {passive:true});

  if(navSpot){
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(a=>{
      a.addEventListener('pointerenter', ()=>{
        const r = a.getBoundingClientRect();
        navSpot.style.left = (r.left + r.width/2) + 'px';
        navSpot.style.top = (r.top + r.height/2) + 'px';
        navSpot.classList.add('visible');
      });
      a.addEventListener('pointermove', (ev)=>{
        const r = a.getBoundingClientRect();
        navSpot.style.left = (r.left + ev.offsetX) + 'px';
        navSpot.style.top = (r.top + r.height/2) + 'px';
      }, {passive:true});
      a.addEventListener('pointerleave', ()=> navSpot.classList.remove('visible'));
    });
  }

  window.addEventListener('pointerleave', ()=> overlay.classList.remove('visible'));
}

/* Pointer-follow color animation: updates CSS vars on pointermove and toggles 'hovering' */
function initColorFollow(){
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const elems = document.querySelectorAll('.hero, .cta, .project-card, .detail-card, .contact-card, .nav-links a');
  elems.forEach(el => {
    // add helper classes
    el.classList.add('color-animate');
    el.addEventListener('pointerenter', ()=> el.classList.add('hovering'));
    el.addEventListener('pointerleave', ()=>{
      el.classList.remove('hovering');
      // reset to center on leave
      el.style.setProperty('--hover-x','50%');
      el.style.setProperty('--hover-y','50%');
      if(el.classList.contains('color-accent')) el.style.backgroundPosition = '50% 50%';
    });

    let raf = 0;
    el.addEventListener('pointermove', (e)=>{
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left)/r.width)*100;
      const y = ((e.clientY - r.top)/r.height)*100;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        el.style.setProperty('--hover-x', x.toFixed(2)+'%');
        el.style.setProperty('--hover-y', y.toFixed(2)+'%');
        // if element supports accent gradient, nudge background-position
        if(el.classList.contains('color-accent')){
          el.style.backgroundPosition = `${Math.min(Math.max(x,20),80)}% ${Math.min(Math.max(y,20),80)}%`;
        }
      });
    }, {passive:true});
  });
}


