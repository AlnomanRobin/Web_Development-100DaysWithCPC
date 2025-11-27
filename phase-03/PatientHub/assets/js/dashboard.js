/* PatientHub - dashboard.js
   Dashboard population, latest items, and page-specific initializations
*/

function renderWelcome() {
  const user = PatientHub.currentUser();
  const welcomeEl = document.getElementById('welcomeUser');
  if (user && welcomeEl) {
    welcomeEl.textContent = `Welcome, ${user.name || 'User'} 👋`;
  }
}

function renderKPIs() {
  const user = PatientHub.currentUser();
  if (!user) return;
  const visits = PatientHub.listVisits(user.id);
  const prescriptions = PatientHub.listPrescriptions(user.id);
  const tests = PatientHub.listTests(user.id);

  const kpiVisits = document.getElementById('kpiVisits');
  const kpiPrescriptions = document.getElementById('kpiPrescriptions');
  const kpiTests = document.getElementById('kpiTests');

  if (kpiVisits) kpiVisits.textContent = String(visits.length);
  if (kpiPrescriptions) kpiPrescriptions.textContent = String(prescriptions.length);
  if (kpiTests) kpiTests.textContent = String(tests.length);

  const latestList = document.getElementById('latestList');
  if (latestList) {
    latestList.innerHTML = '';

    const latestVisit = visits[0];
    const latestPrescription = prescriptions[0];
    const latestTest = tests[0];

    if (latestVisit) {
      latestList.insertAdjacentHTML('beforeend', `
        <div class="record-item fadeIn">
          <strong>Latest Visit:</strong> ${latestVisit.doctorName} — <span class="meta">${latestVisit.date}</span>
          <div class="meta">${latestVisit.diagnosis || 'No diagnosis provided'}</div>
        </div>
      `);
    }
    if (latestPrescription) {
      latestList.insertAdjacentHTML('beforeend', `
        <div class="record-item fadeIn">
          <strong>Latest Prescription:</strong> ${latestPrescription.doctorName} — <span class="meta">${latestPrescription.date}</span>
        </div>
      `);
    }
    if (latestTest) {
      latestList.insertAdjacentHTML('beforeend', `
        <div class="record-item fadeIn">
          <strong>Latest Test:</strong> ${latestTest.testName} — <span class="meta">${latestTest.date}</span>
        </div>
      `);
    }

    if (!latestVisit && !latestPrescription && !latestTest) {
      latestList.innerHTML = '<div class="muted">No records yet. Add your first visit, prescription, or test report.</div>';
    }
  }
}

/* Profile page init */
function initProfilePage() {
  if (!PatientHub.requireAuth()) return;
  const user = PatientHub.currentUser();
  const profile = user.profile || {};

  const fields = {
    profileName: user.name || '',
    profileAge: profile.age || '',
    profileGender: profile.gender || '',
    profilePhone: user.phone || '',
    profileBloodGroup: profile.bloodGroup || '',
    profileAddress: profile.address || '',
    profileEmergency: profile.emergencyContact || ''
  };

  for (const id in fields) {
    const el = document.getElementById(id);
    if (el) el.value = fields[id];
  }

  const saveBtn = document.getElementById('saveProfile');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const updates = {
        age: document.getElementById('profileAge').value.trim(),
        gender: document.getElementById('profileGender').value.trim(),
        bloodGroup: document.getElementById('profileBloodGroup').value.trim(),
        address: document.getElementById('profileAddress').value.trim(),
        emergencyContact: document.getElementById('profileEmergency').value.trim(),
      };
      // Keep name/phone at root user object
      const name = document.getElementById('profileName').value.trim();
      const phone = document.getElementById('profilePhone').value.trim();

      const users = PatientHub.getJSON(PatientHub.DB_KEYS.users, []);
      const idx = users.findIndex(u => u.id === user.id);
      if (idx >= 0) {
        users[idx].name = name;
        users[idx].phone = phone;
        users[idx].profile = { ...(users[idx].profile || {}), ...updates };
        PatientHub.setJSON(PatientHub.DB_KEYS.users, users);
      }

      document.getElementById('profileSaved').textContent = 'Profile saved successfully.';
      setTimeout(() => document.getElementById('profileSaved').textContent = '', 2000);
    });
  }
}

/* Records page init */
function initRecordsPage() {
  if (!PatientHub.requireAuth()) return;
  const user = PatientHub.currentUser();

  const form = document.getElementById('visitForm');
  const previewImg = document.getElementById('visitPreview');
  const fileInput = document.getElementById('visitImage');
  const listEl = document.getElementById('visitList');

  if (fileInput && previewImg) {
    fileInput.addEventListener('change', async () => {
      await PatientHub.previewImage(fileInput, previewImg);
      previewImg.classList.remove('hidden');
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const doctorName = document.getElementById('visitDoctor').value.trim();
      const date = document.getElementById('visitDate').value;
      const whatHappened = document.getElementById('visitNotes').value.trim();
      const diagnosis = document.getElementById('visitDiagnosis').value.trim();
      const medicines = document.getElementById('visitMedicines').value.trim();

      if (!doctorName || !date) {
        alert('Doctor name and visit date are required.');
        return;
      }

      const imageDataUrl = await PatientHub.previewImage(fileInput, previewImg);
      const saved = PatientHub.saveVisit(user.id, {
        doctorName, date, notes: whatHappened, diagnosis, medicines, imageDataUrl
      });

      renderVisitsList(user.id, listEl);
      form.reset();
      previewImg.classList.add('hidden');
    });
  }

  if (listEl) renderVisitsList(user.id, listEl);
}

function renderVisitsList(userId, listEl) {
  const visits = PatientHub.listVisits(userId);
  listEl.innerHTML = '';
  if (visits.length === 0) {
    listEl.innerHTML = '<div class="muted">No doctor visit records yet.</div>';
    return;
  }
  visits.forEach(v => {
    listEl.insertAdjacentHTML('beforeend', `
      <div class="record-item slideUp">
        <div><strong>${v.doctorName}</strong> — <span class="meta">${v.date}</span></div>
        <div class="meta">${v.diagnosis || 'No diagnosis provided'}</div>
        <div>${v.notes || ''}</div>
        ${v.imageDataUrl ? `<img src="${v.imageDataUrl}" alt="Prescription" style="max-height:160px;margin-top:8px;border-radius:12px;" />` : ''}
        <div class="meta">Medicines: ${v.medicines || 'Not specified'}</div>
      </div>
    `);
  });
}

/* Prescriptions page init */
function initPrescriptionsPage() {
  if (!PatientHub.requireAuth()) return;
  const user = PatientHub.currentUser();

  const form = document.getElementById('prescriptionForm');
  const previewImg = document.getElementById('presPreview');
  const fileInput = document.getElementById('presImage');
  const listEl = document.getElementById('presList');

  if (fileInput && previewImg) {
    fileInput.addEventListener('change', async () => {
      await PatientHub.previewImage(fileInput, previewImg);
      previewImg.classList.remove('hidden');
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const doctorName = document.getElementById('presDoctor').value.trim();
      const date = document.getElementById('presDate').value;

      if (!doctorName || !date) {
        alert('Doctor name and date are required.');
        return;
      }

      const imageDataUrl = await PatientHub.previewImage(fileInput, previewImg);
      PatientHub.savePrescription(user.id, { doctorName, date, imageDataUrl });

      renderPrescriptions(user.id, listEl);
      form.reset();
      previewImg.classList.add('hidden');
    });
  }

  if (listEl) renderPrescriptions(user.id, listEl);

  // Modal close
  const modal = document.getElementById('imageModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) PatientHub.closeModal('imageModal');
    });
  }
}

function renderPrescriptions(userId, listEl) {
  const items = PatientHub.listPrescriptions(userId);
  listEl.innerHTML = '';
  if (items.length === 0) {
    listEl.innerHTML = '<div class="muted">No prescriptions uploaded yet.</div>';
    return;
  }
  items.forEach(item => {
    listEl.insertAdjacentHTML('beforeend', `
      <div class="record-item slideUp">
        <div><strong>${item.doctorName}</strong> — <span class="meta">${item.date}</span></div>
        ${item.imageDataUrl ? `
          <div class="gallery-item hover-smooth" onclick="showImage('${encodeURIComponent(item.imageDataUrl)}')">
            <img src="${item.imageDataUrl}" alt="Prescription" />
          </div>
        ` : '<div class="muted">No image attached</div>'}
      </div>
    `);
  });
}

function showImage(encodedUrl) {
  const url = decodeURIComponent(encodedUrl);
  const modalImg = document.getElementById('modalImg');
  if (modalImg) modalImg.src = url;
  PatientHub.openModal('imageModal');
}

/* Test reports page init */
function initTestsPage() {
  if (!PatientHub.requireAuth()) return;
  const user = PatientHub.currentUser();

  const form = document.getElementById('testForm');
  const previewImg = document.getElementById('testPreview');
  const fileInput = document.getElementById('testImage');
  const gridEl = document.getElementById('testGrid');

  if (fileInput && previewImg) {
    fileInput.addEventListener('change', async () => {
      await PatientHub.previewImage(fileInput, previewImg);
      previewImg.classList.remove('hidden');
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const testName = document.getElementById('testName').value.trim();
      const date = document.getElementById('testDate').value;

      if (!testName || !date) {
        alert('Test name and date are required.');
        return;
      }

      const imageDataUrl = await PatientHub.previewImage(fileInput, previewImg);
      PatientHub.saveTest(user.id, { testName, date, imageDataUrl });

      renderTests(user.id, gridEl);
      form.reset();
      previewImg.classList.add('hidden');
    });
  }

  if (gridEl) renderTests(user.id, gridEl);

  // Modal close
  const modal = document.getElementById('imageModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) PatientHub.closeModal('imageModal');
    });
  }
}

function renderTests(userId, gridEl) {
  const items = PatientHub.listTests(userId);
  gridEl.innerHTML = '';
  if (items.length === 0) {
    gridEl.innerHTML = '<div class="muted">No test reports uploaded yet.</div>';
    return;
  }
  items.forEach(item => {
    gridEl.insertAdjacentHTML('beforeend', `
      <div class="gallery-item zoomIn" onclick="${item.imageDataUrl ? `showImage('${encodeURIComponent(item.imageDataUrl)}')` : ''}">
        <div style="padding:6px;">
          <strong>${item.testName}</strong> — <span class="meta">${item.date}</span>
        </div>
        ${item.imageDataUrl ? `<img src="${item.imageDataUrl}" alt="Test Report" />` : '<div class="muted" style="padding:8px;">No image</div>'}
      </div>
    `);
  });
}

/* Page router */
document.addEventListener('DOMContentLoaded', () => {
  const path = (location.pathname.split('/').pop() || '').toLowerCase();

  // For dashboard
  if (path === 'dashboard.html') {
    if (!PatientHub.requireAuth()) return;
    renderWelcome();
    renderKPIs();
  }

  // Profile
  if (path === 'profile.html') initProfilePage();

  // Records
  if (path === 'records.html') initRecordsPage();

  // Prescriptions
  if (path === 'prescriptions.html') initPrescriptionsPage();

  // Tests
  if (path === 'test-reports.html') initTestsPage();
});

// Expose modal image function
window.showImage = showImage;
