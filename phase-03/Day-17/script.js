// Smooth scroll for nav and action buttons
document.querySelectorAll('[data-scroll]').forEach(el => {
  el.addEventListener('click', () => {
    const target = document.querySelector(el.getAttribute('data-scroll'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Filter projects
const projectFilter = document.getElementById('projectFilter');
const projectCards = Array.from(document.querySelectorAll('#projectCards .card'));
projectFilter.addEventListener('change', () => {
  const val = projectFilter.value;
  projectCards.forEach(card => {
    const tags = (card.getAttribute('data-tags') || '').toLowerCase();
    const show = val === 'all' || tags.includes(val);
    card.style.display = show ? '' : 'none';
  });
});

// Modal: project details
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const modalTitle = document.getElementById('modalTitle');

document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-modal');
    openModal(id);
  });
});

function openModal(id) {
  // Demo content for "project-nexus"
  if (id === 'project-nexus') {
    modalTitle.textContent = 'Project Nexus — Details';
    modalContent.innerHTML = `
      <p><strong>Overview:</strong> Complete embedded system using Arduino & sensors, modular firmware, and a React-based dashboard.</p>
      <ul>
        <li><strong>Hardware:</strong> Arduino, temperature/light/gas sensors, power control</li>
        <li><strong>Firmware:</strong> Sampling, error handling, serial messaging</li>
        <li><strong>Software:</strong> Node/Express API, React UI, Firebase auth</li>
      </ul>
      <div style="display:flex; gap:8px; margin-top:8px">
        <a class="btn btn-outline" href="#" target="_blank" rel="noopener">Case study</a>
        <a class="btn btn-primary" href="#" target="_blank" rel="noopener">Source code</a>
      </div>
    `;
  } else {
    modalTitle.textContent = 'Project details';
    modalContent.textContent = 'No details available.';
  }
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

document.querySelectorAll('[data-close-modal]').forEach(el => {
  el.addEventListener('click', closeModal);
});

function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
});

// Contact form basic validation (front-end demo)
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const name = (formData.get('name') || '').trim();
  const email = (formData.get('email') || '').trim();
  const message = (formData.get('message') || '').trim();

  if (!name || !email || !message) {
    alert('Please fill in name, email, and message.');
    return;
  }
  // Demo: simulate send
  alert('Message sent! I will get back to you soon.');
  contactForm.reset();
});

// Theme toggle (dark variants)
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
let isAltTheme = false;

themeToggle.addEventListener('click', () => {
  isAltTheme = !isAltTheme;
  if (isAltTheme) {
    root.style.setProperty('--bg', '#06101b');
    root.style.setProperty('--bg-elev', '#0d1b2e');
    root.style.setProperty('--card', '#0a1526');
    root.style.setProperty('--primary', '#4fd1ff');
    root.style.setProperty('--accent', '#8a6cff');
  } else {
    root.style.removeProperty('--bg');
    root.style.removeProperty('--bg-elev');
    root.style.removeProperty('--card');
    root.style.removeProperty('--primary');
    root.style.removeProperty('--accent');
  }
});