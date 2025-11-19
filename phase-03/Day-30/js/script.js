// Theme toggle with persistence
(() => {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') root.classList.add('dark');
  function updateButton(){
    const dark = root.classList.contains('dark');
    if (btn) { btn.setAttribute('aria-pressed', dark ? 'true' : 'false'); btn.textContent = dark ? '☼' : '☾'; }
  }
  updateButton();
  if (btn) btn.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
    updateButton();
  });
})();

// Hide header on scroll down, reveal on scroll up
(() => {
  const header = document.getElementById('site-header');
  let last = window.scrollY; let ticking = false;
  window.addEventListener('scroll', () => {
    if (!header) return;
    const y = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (y > last && y > 80) header.classList.add('hidden');
        else header.classList.remove('hidden');
        last = y;
        ticking = false;
      });
      ticking = true;
    }
  }, {passive:true});
})();

// Mobile menu toggle
(() => {
  const m = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  if (m && nav) m.addEventListener('click', () => {
    const open = nav.style.display === 'flex' || nav.style.display === '';
    nav.style.display = open ? 'none' : 'flex';
    m.setAttribute('aria-expanded', (!open).toString());
  });
})();

// Lazy load images (basic)
(() => {
  const imgs = document.querySelectorAll('img.lazy');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          const src = img.getAttribute('data-src');
          if (src) img.src = src;
          img.classList.remove('lazy');
          obs.unobserve(img);
        }
      });
    }, {rootMargin:'200px'});
    imgs.forEach(i => io.observe(i));
  } else {
    imgs.forEach(i => { const s=i.getAttribute('data-src'); if (s) i.src=s; });
  }
})();

// Projects modal (simple)
(() => {
  const modal = document.getElementById('project-modal');
  const title = document.getElementById('project-modal-title');
  const body = document.getElementById('project-modal-body');
  const close = modal && modal.querySelector('.modal-close');
  function openProject(id){
    if (!modal) return;
    title.textContent = '';
    body.innerHTML = '';
    // basic project details mapping
    const data = {
      portfolio:{title:'Portfolio Website Development', img:'assets/projects/portfolio-1.jpg', desc:'Personal portfolio using HTML/CSS/JS.'},
      currency:{title:'Currency Converter (C)', img:'assets/projects/currency-1.jpg', desc:'Console currency converter.'},
      calculator:{title:'Scientific Calculator', img:'assets/projects/calculator-1.jpg', desc:'Responsive web calculator.'},
      attendance:{title:'Attendance Management System (Java, OOP)', img:'assets/projects/attendance-1.jpg', desc:'Store & manage attendance.'},
      robot:{title:'Autonomous Robot', img:'assets/projects/robot-1.jpg', desc:'Prototype with sensors for obstacle detection.'}
    };
    const p = data[id];
    if (p){
      title.textContent = p.title;
      body.innerHTML = `<img src="${p.img}" alt="${p.title}" style="width:100%;border-radius:8px;margin-bottom:.6rem"><p>${p.desc}</p>`;
    } else {
      title.textContent = 'Project'; body.textContent = 'Details coming soon.';
    }
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function closeProject(){ if (!modal) return; modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  document.querySelectorAll('.project').forEach(card => card.addEventListener('click', ()=> openProject(card.dataset.project)));
  if (close) close.addEventListener('click', closeProject);
  modal && modal.addEventListener('click', (e) => { if (e.target === modal) closeProject(); });
  document.addEventListener('keydown', (e)=> { if (e.key === 'Escape') closeProject(); });
})();

// Gallery lightbox (basic)
(() => {
  const items = document.querySelectorAll('.gallery-item');
  if (!items) return;
  const light = document.createElement('div'); light.className='modal'; light.id='lightbox'; light.innerHTML = '<div class="modal-inner"><button class="modal-close" aria-label="Close">✕</button><img id="lightbox-img" style="max-width:100%;height:auto;border-radius:8px"></div>';
  document.body.appendChild(light);
  const imgEl = light.querySelector('#lightbox-img');
  light.addEventListener('click', e => { if (e.target === light) light.style.display='none'; });
  light.querySelector('.modal-close').addEventListener('click', ()=> light.style.display='none');
  items.forEach(i => i.addEventListener('click', ()=>{ imgEl.src = i.getAttribute('data-src') || i.src; light.style.display='flex'; light.setAttribute('aria-hidden','false'); }));
})();

// Contact form handling
(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    try {
      const res = await fetch('/api/contact', { method:'POST', body:fd });
      const data = await res.json();
      if (data && data.success) {
        alert('Message sent — thank you!');
        form.reset();
      } else {
        alert('Server error. Opening mail client as fallback.');
        window.location.href = `mailto:robinalnoman@gmail.com?subject=${encodeURIComponent(fd.get('subject')||'')}&body=${encodeURIComponent(fd.get('message')||'')}`;
      }
    } catch (err){
      console.error(err);
      alert('Unable to send via server. Using mailto fallback.');
      window.location.href = `mailto:robinalnoman@gmail.com?subject=${encodeURIComponent(fd.get('subject')||'')}&body=${encodeURIComponent(fd.get('message')||'')}`;
    }
  });
})();

// Small helpers
(() => { const y=document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
  // smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=> a.addEventListener('click', (e)=>{ const t=a.getAttribute('href'); if (t.length>1){ e.preventDefault(); document.querySelector(t).scrollIntoView({behavior:'smooth'}); } }));
})();
