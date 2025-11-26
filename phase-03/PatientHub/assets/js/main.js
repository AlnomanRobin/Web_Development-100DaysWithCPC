/* PatientHub - main.js
   Common utilities, LocalStorage mock DB, session handling, modal & preview helpers
*/

// Simple LocalStorage-backed DB with a single active user scope
const DB_KEYS = {
  users: 'ph_users',        // array of users {id, name, email, phone, passwordHash?, profile:{}}
  session: 'ph_session',    // {userId}
  visits: 'ph_visits',      // {userId: [ {id, doctorName, date, notes, diagnosis, medicines, imageDataUrl} ]}
  prescriptions: 'ph_prescriptions', // {userId: [ {id, doctorName, date, imageDataUrl} ]}
  tests: 'ph_tests',        // {userId: [ {id, testName, date, imageDataUrl} ]}
};

function getJSON(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getSession() {
  return getJSON(DB_KEYS.session, null);
}

function setSession(session) {
  setJSON(DB_KEYS.session, session);
}

function currentUser() {
  const session = getSession();
  if (!session) return null;
  const users = getJSON(DB_KEYS.users, []);
  return users.find(u => u.id === session.userId) || null;
}

function ensureUserStores(userId) {
  const visits = getJSON(DB_KEYS.visits, {});
  const prescriptions = getJSON(DB_KEYS.prescriptions, {});
  const tests = getJSON(DB_KEYS.tests, {});
  if (!visits[userId]) visits[userId] = [];
  if (!prescriptions[userId]) prescriptions[userId] = [];
  if (!tests[userId]) tests[userId] = [];
  setJSON(DB_KEYS.visits, visits);
  setJSON(DB_KEYS.prescriptions, prescriptions);
  setJSON(DB_KEYS.tests, tests);
}

function saveVisit(userId, visit) {
  const visits = getJSON(DB_KEYS.visits, {});
  visits[userId] = visits[userId] || [];
  visit.id = visit.id || 'v_' + Date.now();
  visits[userId].push(visit);
  setJSON(DB_KEYS.visits, visits);
  return visit;
}

function savePrescription(userId, item) {
  const prescriptions = getJSON(DB_KEYS.prescriptions, {});
  prescriptions[userId] = prescriptions[userId] || [];
  item.id = item.id || 'p_' + Date.now();
  prescriptions[userId].push(item);
  setJSON(DB_KEYS.prescriptions, prescriptions);
  return item;
}

function saveTest(userId, item) {
  const tests = getJSON(DB_KEYS.tests, {});
  tests[userId] = tests[userId] || [];
  item.id = item.id || 't_' + Date.now();
  tests[userId].push(item);
  setJSON(DB_KEYS.tests, tests);
  return item;
}

function listVisits(userId) {
  const visits = getJSON(DB_KEYS.visits, {});
  return (visits[userId] || []).sort((a,b) => new Date(b.date) - new Date(a.date));
}

function listPrescriptions(userId) {
  const prescriptions = getJSON(DB_KEYS.prescriptions, {});
  return (prescriptions[userId] || []).sort((a,b) => new Date(b.date) - new Date(a.date));
}

function listTests(userId) {
  const tests = getJSON(DB_KEYS.tests, {});
  return (tests[userId] || []).sort((a,b) => new Date(b.date) - new Date(a.date));
}

function updateUserProfile(userId, profileUpdates) {
  const users = getJSON(DB_KEYS.users, []);
  const idx = users.findIndex(u => u.id === userId);
  if (idx >= 0) {
    users[idx].profile = { ...(users[idx].profile || {}), ...profileUpdates };
    setJSON(DB_KEYS.users, users);
    return users[idx];
  }
  return null;
}

/* Image helpers */

// Preview an image file input to target <img> element and return a Promise with the data URL
function previewImage(inputEl, previewImgEl) {
  return new Promise((resolve, reject) => {
    const file = inputEl.files && inputEl.files[0];
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (previewImgEl) previewImgEl.src = dataUrl;
      resolve(dataUrl);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* Modal helpers */

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

/* Navbar initialization: show session user status */

function initNavbar() {
  const user = currentUser();
  const navUserEl = document.getElementById('navUser');
  const loginLink = document.getElementById('navLogin');
  const logoutBtn = document.getElementById('navLogout');

  if (navUserEl) {
    if (user) {
      navUserEl.textContent = `Signed in as ${user.name || user.email}`;
      navUserEl.classList.remove('hidden');
    } else {
      navUserEl.classList.add('hidden');
    }
  }

  if (loginLink) {
    if (user) loginLink.classList.add('hidden');
    else loginLink.classList.remove('hidden');
  }

  if (logoutBtn) {
    if (user) {
      logoutBtn.classList.remove('hidden');
      logoutBtn.addEventListener('click', () => {
        setSession(null);
        window.location.href = 'login.html';
      });
    } else {
      logoutBtn.classList.add('hidden');
    }
  }
}

/* Protect pages that require auth */
function requireAuth(redirect = true) {
  const user = currentUser();
  if (!user && redirect) {
    window.location.href = 'login.html';
    return false;
  }
  if (user) ensureUserStores(user.id);
  return !!user;
}

/* On DOM ready, initialize navbar */
document.addEventListener('DOMContentLoaded', initNavbar);

// Expose helpers for other scripts
window.PatientHub = {
  DB_KEYS,
  getJSON,
  setJSON,
  getSession,
  setSession,
  currentUser,
  ensureUserStores,
  saveVisit,
  savePrescription,
  saveTest,
  listVisits,
  listPrescriptions,
  listTests,
  updateUserProfile,
  previewImage,
  openModal,
  closeModal,
  requireAuth
};
