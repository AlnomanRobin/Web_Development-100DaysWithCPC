/* ==========================================================================
   Utilities
   ========================================================================== */
const qs = (sel, scope = document) => scope.querySelector(sel);
const qsa = (sel, scope = document) => [...scope.querySelectorAll(sel)];

/* ==========================================================================
   Theme toggle (persist in localStorage)
   ========================================================================== */
(function themeInit() {
  const saved = localStorage.getItem('theme');
  const body = document.body;
  if (saved === 'dark') body.classList.add('theme--dark');
  else body.classList.remove('theme--dark');
})();

(function themeToggle() {
  const btn = qs('.theme-toggle');
  btn.addEventListener('click', () => {
    document.body.classList.toggle('theme--dark');
    const isDark = document.body.classList.contains('theme--dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
})();

/* ==========================================================================
   Header nav toggle (mobile)
   ========================================================================== */
(function navToggle() {
  const toggle = qs('.nav__toggle');
  const menu = qs('#nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close menu on link click
  qsa('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ==========================================================================
   Hero typed intro (subtle)
   ========================================================================== */
(function typedName() {
  const el = qs('#typed-name');
  if (!el) return;
  const text = el.textContent.trim();
  el.textContent = '';
  let i = 0;
  const tick = () => {
    el.textContent += text[i];
    i++;
    if (i < text.length) setTimeout(tick, 120);
  };
  setTimeout(tick, 200);
})();

/* ==========================================================================
   Projects modal: accessible, keyboard navigable
   ========================================================================== */

// Sample project data (match data-project-id on cards)
const PROJECTS = {
  'project-1': {
    title: 'Project One',
    desc: 'Minimal portfolio site with dark mode and smooth UX.',
    img: 'assets/images/project1.jpg',
    imgAlt: 'Screenshot of Project One',
    tech: ['HTML', 'CSS', 'JavaScript'],
    live: '#',
    github: '#'
  },
  'project-2': {
    title: 'Data Dashboard',
    desc: 'Responsive metrics board with accessible charts.',
    img: 'assets/images/project2.jpg',
    imgAlt: 'Dashboard visualization preview',
    tech: ['HTML', 'CSS', 'JavaScript'],
    live: '#',
    github: '#'
  },
  'project-3': {
    title: 'Landing Page',
    desc: 'Clean, high-performing product landing page.',
    img: 'assets/images/project3.jpg',
    imgAlt: 'Landing page layout preview',
    tech: ['HTML', 'CSS', 'JavaScript'],
    live: '#',
    github: '#'
  }
};

(function modalInit() {
  const modal = qs('#project-modal');
  const backdrop = qs('.modal__backdrop', modal);
  const closeBtns = qsa('[data-close="modal"]', modal);
  const title = qs('#modal-title', modal);
  const subtitle = qs('#modal-desc', modal);
  const img = qs('#modal-img', modal);
  const techList = qs('#modal-tech', modal);
  const liveLink = qs('#modal-live', modal);
  const githubLink = qs('#modal-github', modal);

  let lastFocused = null;

  function openModal(projectId) {
    const data = PROJECTS[projectId];
    if (!data) return;

    title.textContent = data.title;
    subtitle.textContent = data.desc;
    img.src = data.img;
    img.alt = data.imgAlt;

    techList.innerHTML = '';
    data.tech.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t;
      techList.appendChild(li);
    });
    liveLink.href = data.live;
    githubLink.href = data.github;

    lastFocused = document.activeElement;

    modal.hidden = false;
    // Focus trap: move focus to close button
    const close = qs('.modal__close', modal);
    close.focus();

    // Prevent background scroll
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  // Open via click or Enter on card
  qsa('.project-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.projectId));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.projectId);
      }
    });
  });

  // Close controls
  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
  backdrop.addEventListener('click', closeModal);
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // Basic focus trap inside modal
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusables = qsa(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      modal
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      last.focus(); e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus(); e.preventDefault();
    }
  });
})();

/* ==========================================================================
   Testimonials carousel (keyboard accessible)
   ========================================================================== */
(function carouselInit() {
  const viewport = qs('#carousel-viewport');
  const prev = qs('#carousel-prev');
  const next = qs('#carousel-next');
  const dotsWrap = qs('#carousel-dots');

  if (!viewport || !prev || !next || !dotsWrap) return;

  const slides = qsa('.testimonial', viewport);
  let index = 0;

  function render() {
    viewport.style.transform = `translateX(-${index * 100}%)`;
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', String(i === index));
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => { index = i; render(); });
      dotsWrap.appendChild(dot);
    });
  }

  prev.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    render();
  });
  next.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    render();
  });

  // Keyboard support on viewport
  viewport.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prev.click();
    if (e.key === 'ArrowRight') next.click();
  });

  // Auto-play (gentle)
  let timer = setInterval(() => next.click(), 6000);
  [prev, next, viewport].forEach(el => {
    el.addEventListener('mouseenter', () => clearInterval(timer));
    el.addEventListener('mouseleave', () => { timer = setInterval(() => next.click(), 6000); });
  });

  render();
})();

/* ==========================================================================
   Contact form: client-side validation + mailto fallback
   ========================================================================== */
(function contactFormInit() {
  const form = qs('#contact-form');
  const status = qs('#form-status');

  const fields = {
    name: { el: qs('#name'), errorEl: qs('#error-name') },
    email: { el: qs('#email'), errorEl: qs('#error-email') },
    message: { el: qs('#message'), errorEl: qs('#error-message') }
  };

  function validateName() {
    const v = fields.name.el.value.trim();
    if (!v) { fields.name.errorEl.textContent = 'Please enter your name.'; return false; }
    fields.name.errorEl.textContent = ''; return true;
  }
  function validateEmail() {
    const v = fields.email.el.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (!ok) { fields.email.errorEl.textContent = 'Please enter a valid email address.'; return false; }
    fields.email.errorEl.textContent = ''; return true;
  }
  function validateMessage() {
    const v = fields.message.el.value.trim();
    if (v.length < 10) { fields.message.errorEl.textContent = 'Please include at least 10 characters.'; return false; }
    fields.message.errorEl.textContent = ''; return true;
  }

  ['input', 'blur'].forEach(evt => {
    fields.name.el.addEventListener(evt, validateName);
    fields.email.el.addEventListener(evt, validateEmail);
    fields.message.el.addEventListener(evt, validateMessage);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = [validateName(), validateEmail(), validateMessage()].every(Boolean);
    if (!ok) {
      status.textContent = 'Please fix the errors above.';
      return;
    }
    status.textContent = 'Opening your email client...';

    // mailto fallback (no backend)
    const subject = encodeURIComponent(`Portfolio inquiry from ${fields.name.el.value.trim()}`);
    const body = encodeURIComponent(fields.message.el.value.trim());
    const mailto = `mailto:you@example.com?subject=${subject}&body=${body}%0A%0AFrom: ${fields.email.el.value.trim()}`;
    window.location.href = mailto;

    // Success message (in case mailto fails to open)
    setTimeout(() => { status.textContent = 'If your email client did not open, please email you@example.com directly.'; }, 2000);
  });
})();

/* ==========================================================================
   Misc
   ========================================================================== */
(function setYear() {
  const y = qs('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
