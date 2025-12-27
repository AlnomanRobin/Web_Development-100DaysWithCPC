(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navClose = document.getElementById('navClose');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const siteHeader = document.getElementById('siteHeader');
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const contactForm = document.getElementById('contactForm');
  const projectSearch = document.getElementById('projectSearch');
  const projectsGrid = document.getElementById('projectsGrid');

  // Store project cards data from initial HTML
  const projectCards = [];
  const initialProjectCards = document.querySelectorAll('#projectsGrid > .project-card');
  initialProjectCards.forEach(card => {
    const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
    const desc = card.querySelector('p')?.textContent?.toLowerCase() || '';
    const searchText = `${title} ${desc}`;
    projectCards.push({ element: card.cloneNode(true), searchText });
  });

  // Populate grid with filter
  function renderProjects(filter = '') {
    projectsGrid.innerHTML = '';
    projectCards.forEach(({ element, searchText }) => {
      if (filter === '' || searchText.includes(filter.toLowerCase())) {
        const clonedCard = element.cloneNode(true);
        projectsGrid.appendChild(clonedCard);
      }
    });
    // Re-attach click handlers to new elements
    document.querySelectorAll('#projectsGrid .project-view').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const title = this.dataset.title || '';
        lightboxImg.src = href;
        const captionEl = document.getElementById('lightboxCaption');
        if(captionEl) {
          captionEl.textContent = title;
          captionEl.setAttribute('aria-hidden', 'false');
        }
        lightbox.style.display = 'flex';
        lightbox.setAttribute('aria-hidden','false');
      });
    });
  }

  // Render initial projects
  renderProjects();

  // Search functionality
  if (projectSearch) {
    projectSearch.addEventListener('input', (e) => {
      renderProjects(e.target.value);
    });
  }

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
  function openMobileMenu() {
    navMenu.classList.add('open');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    navMenu.classList.remove('open');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if(mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
  }

  if(navClose) {
    navClose.addEventListener('click', closeMobileMenu);
  }

  if(mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close menu when clicking anywhere outside the menu
  document.addEventListener('click', (e) => {
    if(navMenu.classList.contains('open')) {
      // Don't close if clicking on menu or menu button
      if(!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  // Close mobile menu when clicking on navigation links
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
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

  // Social sidebar hide/show on scroll (same pattern as header)
  const socialSidebar = document.querySelector('.social-sidebar');
  if(socialSidebar){
    // initialize visible
    socialSidebar.style.transform = 'translateX(0)';
    let lastSideScroll = window.scrollY;
    window.addEventListener('scroll', ()=>{
      const cur = window.scrollY;
      if(cur > lastSideScroll && cur > 120){
        // scrolling down -> hide to left
        socialSidebar.style.transform = 'translateX(-120%)';
        socialSidebar.style.opacity = '0';
      } else {
        socialSidebar.style.transform = 'translateX(0)';
        socialSidebar.style.opacity = '1';
      }
      lastSideScroll = cur;
    },{passive:true});
  }

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
  
  // Reveal-on-scroll using IntersectionObserver (light-weight AOS alternative)
  try{
    const revealTargets = document.querySelectorAll('.hero-content h1, .subtitle, .lead, .image-frame, .project-card, .skill-card, .timeline-item, .gallery-item, .card.soft, .contact-grid form');
    revealTargets.forEach((el, i)=>{
      el.classList.add('reveal-on-scroll');
      // stagger with small inline delay
      el.style.transitionDelay = (i * 45) + 'ms';
    });
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('reveal');
          // optionally unobserve to keep it simple
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.12});
    revealTargets.forEach(el=>io.observe(el));
  }catch(err){console.warn('Reveal observer failed',err)}

  // Subtitle cycling animation: show each phrase in sequence
  (function(){
    const phrases = document.querySelectorAll('.subtitle .phrase');
    if(!phrases || phrases.length === 0) return;
    let idx = 0;
    const show = i => {
      phrases.forEach((p, j)=> p.classList.toggle('active', j === i));
    };
    // initial
    show(idx);
    // cycle every 2000ms
    const interval = 2200;
    let timer = setInterval(()=>{
      idx = (idx + 1) % phrases.length;
      show(idx);
    }, interval);
    // pause on hover for accessibility
    const container = document.querySelector('.subtitle');
    if(container){
      container.addEventListener('mouseenter', ()=> clearInterval(timer));
      container.addEventListener('mouseleave', ()=> { timer = setInterval(()=>{ idx = (idx + 1) % phrases.length; show(idx); }, interval); });
    }
  })();

  // Sequential skill highlight animation
  (function(){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const skills = Array.from(document.querySelectorAll('.skill-card'));
    if(!skills.length) return;
    let idx = 0;
    let running = true;
    const highlightClass = 'highlight';
    const intervalMs = 900;

    function clearHighlights(){ skills.forEach(s=>s.classList.remove(highlightClass)); }
    function step(){
      clearHighlights();
      const cur = skills[idx % skills.length];
      if(cur) cur.classList.add(highlightClass);
      idx = (idx + 1) % skills.length;
    }

    // start with a small delay so initial reveal animations run first
    let timer = setInterval(step, intervalMs);
    // run one immediate pass after 400ms (for nicer initial feel)
    setTimeout(step, 400);

    // pause on hover/focus for accessibility
    skills.forEach(s => {
      s.addEventListener('mouseenter', ()=>{ running = false; clearInterval(timer); });
      s.addEventListener('mouseleave', ()=>{ if(!running){ timer = setInterval(step, intervalMs); running = true; } });
      s.addEventListener('focus', ()=>{ running = false; clearInterval(timer); }, true);
      s.addEventListener('blur', ()=>{ if(!running){ timer = setInterval(step, intervalMs); running = true; } }, true);
    });

    // stop when page hidden to save cycles
    document.addEventListener('visibilitychange', ()=>{
      if(document.hidden){ clearInterval(timer); }
      else { if(!running) timer = setInterval(step, intervalMs); }
    });
  })();
})();