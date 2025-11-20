// main.js - shared behaviors (menu toggle, logout)
document.addEventListener('DOMContentLoaded', ()=>{
  // menu toggles (many pages use different ids)
  ['menuToggle','menuToggle2','menuToggle3','menuToggle4','menuToggle5'].forEach(id=>{
    const el = document.getElementById(id);
    const side = document.getElementById('sidebar'+(id==='menuToggle'? '':'2'.repeat(0)));
    if(el){
      el.addEventListener('click', ()=>{
        const s = document.querySelector('.sidebar')
        if(s) s.classList.toggle('open')
      })
    }
  })

  // wire logout buttons
  ['logoutBtn','logoutBtn2','logoutBtn3','logoutBtn4','logoutBtn5'].forEach(id=>{
    const b = document.getElementById(id);
    if(b) b.addEventListener('click', ()=>{localStorage.removeItem('sessionUser');window.location='login.html'})
  })

  // show username in dashboard if exists
  const welcome = document.getElementById('welcomeUser');
  const greet = document.getElementById('greet');
  const sessionUser = JSON.parse(localStorage.getItem('sessionUser')||'null');
  if(welcome && sessionUser){ welcome.textContent = sessionUser.name }
  if(greet && sessionUser){ greet.textContent = `Welcome, ${sessionUser.name}` }

  // delegate clicks on dashboard cards
  document.querySelectorAll('.card[data-link]').forEach(card=>{
    card.addEventListener('click', ()=>{ window.location = card.dataset.link })
  })
})
