(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const siteHeader = document.getElementById('siteHeader');
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const contactForm = document.getElementById('contactForm');

  // Theme init
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme === 'dark') document.documentElement.classList.add('dark');
  updateThemeIcon();

  function updateThemeIcon(){
    themeToggle.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
  }

  themeToggle.addEventListener('click',()=>{
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
  });

  // Mobile menu
  mobileMenuBtn.addEventListener('click',()=>{
    navMenu.classList.toggle('open');
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - (siteHeader.offsetHeight + 8);
        window.scrollTo({top,behavior:'smooth'});
        // close mobile nav
        navMenu.classList.remove('open');
      }
    });
  });

  // Header hide/show on scroll
  let lastScroll = window.scrollY;
  window.addEventListener('scroll', ()=>{
    const current = window.scrollY;
    if(current > lastScroll && current > 100){
      siteHeader.style.transform = 'translateY(-120%)';
    } else {
      siteHeader.style.transform = 'translateY(0)';
    }
    lastScroll = current;
  },{passive:true});

  // Gallery lightbox
  galleryGrid.querySelectorAll('.gallery-item').forEach(item=>{
    item.addEventListener('click',e=>{
      e.preventDefault();
      const href = item.getAttribute('href');
      lightboxImg.src = href;
      lightbox.style.display = 'flex';
      lightbox.setAttribute('aria-hidden','false');
    });
  });
  lightboxClose.addEventListener('click',()=>{
    lightbox.style.display='none';
    lightbox.setAttribute('aria-hidden','true');
    lightboxImg.src = '';
  });
  lightbox.addEventListener('click',e=>{
    if(e.target === lightbox) lightboxClose.click();
  });

  // Contact form validation
  contactForm.addEventListener('submit', function(e){
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    if(!name.value.trim() || !email.value.trim() || !message.value.trim()){
      e.preventDefault();
      alert('Please fill in all fields before sending.');
      return false;
    }
    // Allow default submit to chithi.me target
  });

  // Accessible focus outline for keyboard users
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);
})();