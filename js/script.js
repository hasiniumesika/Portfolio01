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
