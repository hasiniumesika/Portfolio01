// Simple nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle && navToggle.addEventListener('click', ()=>{
  navLinks.classList.toggle('show');
});

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
