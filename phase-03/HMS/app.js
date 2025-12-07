/* Modern Hostel Management - Vanilla JS, localStorage + JSON export/import */

// ============ DATA MANAGEMENT ============
class HostelApp {
  constructor() {
    this.data = this.loadData();
    this.currentResident = this.data.residents[0]?.id || null;
    this.currentMonth = new Date();
    this.init();
  }

  loadData() {
    const stored = localStorage.getItem('hostelData');
    return stored ? JSON.parse(stored) : this.getDefaultData();
  }

  getDefaultData() {
    return {
      residents: [
        { id: 'r1', name: 'Rahim', phone: '', email: '', facebook: '', avatar: '', meals: {}, bazarEntries: [], payments: [] },
        { id: 'r2', name: 'Karim', phone: '', email: '', facebook: '', avatar: '', meals: {}, bazarEntries: [], payments: [] },
        { id: 'r3', name: 'Fatima', phone: '', email: '', facebook: '', avatar: '', meals: {}, bazarEntries: [], payments: [] }
      ],
      bazar: [],
      payments: [],
      settings: { currency: '৳', perMealCost: null },
      contacts: [
        { role: 'Manager', name: 'Mr. Ahmed', phone: '+8801700000000', location: 'Hostel Road' },
        { role: 'Owner', name: 'Mr. Khan', phone: '+8801800000000', location: 'Main Gate' },
        { role: 'Caretaker', name: 'Buwa', phone: '+8801900000000', location: 'Room 101' },
        { role: 'Guard', name: 'Mr. Hasan', phone: '+8801600000000', location: 'Gate' }
      ]
    };
  }

  saveData() {
    localStorage.setItem('hostelData', JSON.stringify(this.data));
  }

  init() {
    this.setupEventListeners();
    this.populateMonthSelector();
    this.render();
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });

    // Resident Modal
    document.getElementById('addResidentBtn').addEventListener('click', () => {
      document.getElementById('residentModal').showModal();
    });
    document.getElementById('saveResidentBtn').addEventListener('click', (e) => {
      e.preventDefault();
      this.addResident();
    });

    // Bazar Modal
    document.getElementById('addBazarBtn').addEventListener('click', () => {
      document.getElementById('bazarModal').showModal();
    });
    document.getElementById('saveBazarBtn').addEventListener('click', (e) => {
      e.preventDefault();
      this.addBazar();
    });

    // Payment Modal
    document.getElementById('addPaymentBtn').addEventListener('click', () => {
      document.getElementById('paymentModal').showModal();
    });
    document.getElementById('savePaymentBtn').addEventListener('click', (e) => {
      e.preventDefault();
      this.addPayment();
    });

    // Bulk Edit Modal
    document.getElementById('bulkEditBtn').addEventListener('click', () => {
      document.getElementById('bulkEditModal').showModal();
    });
    document.getElementById('applyBulkEditBtn').addEventListener('click', (e) => {
      e.preventDefault();
      this.applyBulkEdit();
    });

    // Resident Selector
    document.getElementById('residentSelect').addEventListener('change', (e) => {
      this.currentResident = e.target.value;
      this.renderMealGrid();
    });

    // Meal Default
    document.getElementById('applyDefaultMealsBtn').addEventListener('click', () => {
      this.applyDefaultMeals();
    });

    // Export/Import
    document.getElementById('exportCsvBtn').addEventListener('click', () => this.exportCSV());
    document.getElementById('exportJsonBtn').addEventListener('click', () => this.exportJSON());
    document.getElementById('importJsonInput').addEventListener('change', (e) => this.importJSON(e));
    document.getElementById('resetDataBtn').addEventListener('click', () => this.resetData());
    document.getElementById('printViewBtn').addEventListener('click', () => this.printView());

    // Settings
    document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());

    // Dark Mode & Tutorial
    document.getElementById('darkModeToggle').addEventListener('click', () => this.toggleDarkMode());
    document.getElementById('showTutorialBtn').addEventListener('click', () => this.showTutorial());
    document.getElementById('closeTutorialBtn').addEventListener('click', () => this.closeTutorial());

    // Nav Toggle Mobile
    document.getElementById('navToggle').addEventListener('click', () => this.toggleSidebar());

    // Month Selector
    document.getElementById('monthSelect').addEventListener('change', (e) => {
      const [year, month] = e.target.value.split('-');
      this.currentMonth = new Date(year, month - 1);
      this.renderMealGrid();
    });
  }

  // ============ MODAL OPERATIONS ============
  addResident() {
    const name = document.getElementById('residentNameInput').value.trim();
    const phone = document.getElementById('residentPhoneInput').value.trim();
    const email = document.getElementById('residentEmailInput').value.trim();
    const facebook = document.getElementById('residentFacebookInput').value.trim();

    if (!name) {
      this.showToast('Please enter a name', 'error');
      return;
    }

    const newResident = {
      id: 'r' + Date.now(),
      name,
      phone,
      email,
      facebook,
      avatar: '',
      meals: {},
      bazarEntries: [],
      payments: []
    };

    this.data.residents.push(newResident);
    this.saveData();
    this.showToast('Resident added successfully', 'success');

    document.getElementById('residentModal').close();
    document.getElementById('residentNameInput').value = '';
    document.getElementById('residentPhoneInput').value = '';
    document.getElementById('residentEmailInput').value = '';
    document.getElementById('residentFacebookInput').value = '';

    this.populateResidentSelect();
    this.render();
  }

  addBazar() {
    const date = document.getElementById('bazarDateInput').value;
    const item = document.getElementById('bazarItemInput').value.trim();
    const buyer = document.getElementById('bazarBuyerInput').value;
    const amount = parseFloat(document.getElementById('bazarAmountInput').value);
    const shared = document.getElementById('bazarSharedInput').checked;

    if (!date || !item || !buyer || !amount) {
      this.showToast('Please fill all required fields', 'error');
      return;
    }

    const newBazar = {
      id: 'b' + Date.now(),
      date,
      item,
      buyer,
      amount,
      shared,
      receipt: null
    };

    this.data.bazar.push(newBazar);
    this.saveData();
    this.showToast('Bazar entry added', 'success');

    document.getElementById('bazarModal').close();
    this.clearBazarForm();
    this.renderBazarTable();
    this.updateCards();
  }

  addPayment() {
    const residentId = document.getElementById('paymentResidentInput').value;
    const date = document.getElementById('paymentDateInput').value;
    const amount = parseFloat(document.getElementById('paymentAmountInput').value);
    const type = document.getElementById('paymentTypeInput').value;
    const note = document.getElementById('paymentNoteInput').value.trim();

    if (!residentId || !date || !amount) {
      this.showToast('Please fill all required fields', 'error');
      return;
    }

    const newPayment = {
      id: 'p' + Date.now(),
      residentId,
      date,
      amount,
      type,
      note
    };

    this.data.payments.push(newPayment);
    this.saveData();
    this.showToast('Payment recorded', 'success');

    document.getElementById('paymentModal').close();
    this.clearPaymentForm();
    this.renderRentStatus();
    this.updateCards();
  }

  applyBulkEdit() {
    const startDay = parseInt(document.getElementById('bulkStartDay').value);
    const endDay = parseInt(document.getElementById('bulkEndDay').value);
    const mealValue = parseInt(document.getElementById('bulkMealValue').value);

    if (startDay > endDay || startDay < 1 || endDay > 30) {
      this.showToast('Invalid day range', 'error');
      return;
    }

    const resident = this.data.residents.find(r => r.id === this.currentResident);
    for (let day = startDay; day <= endDay; day++) {
      const dateKey = this.getDateKey(day);
      resident.meals[dateKey] = mealValue;
    }

    this.saveData();
    this.showToast('Bulk edit applied', 'success');
    document.getElementById('bulkEditModal').close();
    this.renderMealGrid();
    this.updateCards();
  }

  // ============ RENDER FUNCTIONS ============
  render() {
    this.populateResidentSelect();
    this.populateSelects();
    this.renderMealGrid();
    this.renderBazarTable();
    this.renderRentStatus();
    this.renderProfiles();
    this.renderContacts();
    this.updateCards();
    this.renderReport();
  }

  populateResidentSelect() {
    const select = document.getElementById('residentSelect');
    select.innerHTML = '';
    this.data.residents.forEach(r => {
      const option = document.createElement('option');
      option.value = r.id;
      option.textContent = r.name;
      if (r.id === this.currentResident) option.selected = true;
      select.appendChild(option);
    });
    if (!this.currentResident && this.data.residents.length > 0) {
      this.currentResident = this.data.residents[0].id;
    }
  }

  populateSelects() {
    [document.getElementById('bazarBuyerInput'), document.getElementById('paymentResidentInput')].forEach(select => {
      select.innerHTML = '';
      this.data.residents.forEach(r => {
        const option = document.createElement('option');
        option.value = r.id;
        option.textContent = r.name;
        select.appendChild(option);
      });
    });
  }

  renderMealGrid() {
    const resident = this.data.residents.find(r => r.id === this.currentResident);
    if (!resident) return;

    const grid = document.getElementById('mealGrid');
    grid.innerHTML = '';
    const daysInMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = this.getDateKey(day);
      const mealValue = resident.meals[dateKey] || 0;
      const dayName = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day).toLocaleDateString('en-US', { weekday: 'short' });

      const cell = document.createElement('div');
      cell.className = 'meal-cell';
      cell.innerHTML = `
        <div class="meal-day">${day} ${dayName}</div>
        <input type="number" min="0" data-day="${day}" value="${mealValue}" class="meal-input" aria-label="Meals for day ${day}">
      `;

      cell.querySelector('.meal-input').addEventListener('change', (e) => {
        resident.meals[dateKey] = parseInt(e.target.value) || 0;
        this.saveData();
        this.updateCards();
      });

      grid.appendChild(cell);
    }
  }

  renderBazarTable() {
    const tbody = document.getElementById('bazarTableBody');
    tbody.innerHTML = '';

    this.data.bazar.forEach(entry => {
      const buyer = this.data.residents.find(r => r.id === entry.buyer);
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.date}</td>
        <td>${entry.item}</td>
        <td>${buyer?.name || 'Unknown'}</td>
        <td>${this.data.settings.currency}${entry.amount}</td>
        <td>${entry.shared ? '✓' : '✗'}</td>
        <td>${entry.receipt ? '📎' : '-'}</td>
        <td>
          <button class="btn-small" onclick="app.deleteBazar('${entry.id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    const total = this.data.bazar.reduce((sum, b) => sum + b.amount, 0);
    document.getElementById('bazarTotal').textContent = `${this.data.settings.currency}${total.toFixed(2)}`;
  }

  renderRentStatus() {
    const container = document.getElementById('rentStatusList');
    container.innerHTML = '';

    this.data.residents.forEach(resident => {
      const payments = this.data.payments.filter(p => p.residentId === resident.id);
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
      const status = totalPaid > 0 ? 'Paid' : 'Unpaid';
      const statusClass = totalPaid > 0 ? 'paid' : 'unpaid';

      const item = document.createElement('div');
      item.className = `rent-item`;
      item.innerHTML = `
        <h4>${resident.name}</h4>
        <span class="badge ${statusClass}">${status}</span>
        <p>Paid: ${this.data.settings.currency}${totalPaid.toFixed(2)}</p>
        ${payments.map(p => `<small>${p.date}: ${this.data.settings.currency}${p.amount}</small>`).join('<br>')}
      `;
      container.appendChild(item);
    });

    const totalDue = this.data.residents.length * 5000; // Example
    const totalCollected = this.data.payments.reduce((sum, p) => sum + p.amount, 0);
    document.getElementById('totalDue').textContent = `${this.data.settings.currency}${totalDue}`;
    document.getElementById('totalCollected').textContent = `${this.data.settings.currency}${totalCollected.toFixed(2)}`;
  }

  renderProfiles() {
    const container = document.getElementById('profilesList');
    container.innerHTML = '';

    this.data.residents.forEach(resident => {
      const profile = document.createElement('div');
      profile.className = 'profile-card';
      const totalMeals = Object.values(resident.meals).reduce((a, b) => a + b, 0);

      profile.innerHTML = `
        <div class="profile-avatar">${resident.avatar || resident.name.charAt(0)}</div>
        <h3>${resident.name}</h3>
        <p><strong>Phone:</strong> ${resident.phone || 'N/A'}</p>
        <p><strong>Email:</strong> ${resident.email || 'N/A'}</p>
        <p><strong>Total Meals:</strong> ${totalMeals}</p>
        <button class="btn-small" onclick="app.editProfile('${resident.id}')">Edit</button>
      `;
      container.appendChild(profile);
    });
  }

  renderContacts() {
    const container = document.getElementById('contactList');
    container.innerHTML = '';

    this.data.contacts.forEach(contact => {
      const item = document.createElement('div');
      item.className = 'contact-item';
      item.innerHTML = `
        <h4>${contact.role}</h4>
        <p><strong>${contact.name}</strong></p>
        <p><a href="tel:${contact.phone}" class="link">${contact.phone}</a></p>
        <p><small>${contact.location}</small></p>
      `;
      container.appendChild(item);
    });
  }

  updateCards() {
    const totalMeals = this.data.residents.reduce((sum, r) => sum + Object.values(r.meals).reduce((a, b) => a + b, 0), 0);
    const bazarCost = this.data.bazar.reduce((sum, b) => sum + b.amount, 0);
    const perMealCost = totalMeals > 0 ? bazarCost / totalMeals : 0;
    const totalPayments = this.data.payments.reduce((sum, p) => sum + p.amount, 0);
    const outstanding = bazarCost - totalPayments;

    document.getElementById('cardTotalMeals').textContent = totalMeals;
    document.getElementById('cardBazarCost').textContent = `${this.data.settings.currency}${bazarCost.toFixed(2)}`;
    document.getElementById('cardPerMeal').textContent = `${this.data.settings.currency}${perMealCost.toFixed(2)}`;
    document.getElementById('cardOutstanding').textContent = `${this.data.settings.currency}${outstanding.toFixed(2)}`;
  }

  renderReport() {
    const summary = document.getElementById('reportSummary');
    const totalMeals = this.data.residents.reduce((sum, r) => sum + Object.values(r.meals).reduce((a, b) => a + b, 0), 0);
    const bazarCost = this.data.bazar.reduce((sum, b) => sum + b.amount, 0);
    const perMealCost = totalMeals > 0 ? bazarCost / totalMeals : 0;

    summary.innerHTML = `
      <h3>Monthly Summary</h3>
      <p><strong>Total Meals:</strong> ${totalMeals}</p>
      <p><strong>Total Bazar Cost:</strong> ${this.data.settings.currency}${bazarCost.toFixed(2)}</p>
      <p><strong>Per-Meal Cost:</strong> ${this.data.settings.currency}${perMealCost.toFixed(2)}</p>
      <h4>Per-Resident Breakdown</h4>
      ${this.data.residents.map(r => {
        const meals = Object.values(r.meals).reduce((a, b) => a + b, 0);
        const bill = meals * perMealCost;
        return `<div><strong>${r.name}</strong>: ${meals} meals × ${this.data.settings.currency}${perMealCost.toFixed(2)} = ${this.data.settings.currency}${bill.toFixed(2)}</div>`;
      }).join('')}
    `;
  }

  // ============ UTILITY FUNCTIONS ============
  getDateKey(day) {
    const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
    return date.toISOString().split('T')[0];
  }

  applyDefaultMeals() {
    const value = parseInt(document.getElementById('defaultMealInput').value);
    if (isNaN(value)) {
      this.showToast('Please enter a valid number', 'error');
      return;
    }
    const resident = this.data.residents.find(r => r.id === this.currentResident);
    const daysInMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = this.getDateKey(day);
      resident.meals[dateKey] = value;
    }

    this.saveData();
    this.showToast('Default meals applied', 'success');
    this.renderMealGrid();
    this.updateCards();
  }

  deleteBazar(id) {
    if (confirm('নিশ্চিত আপনি মুছে ফেলতে চান?')) {
      this.data.bazar = this.data.bazar.filter(b => b.id !== id);
      this.saveData();
      this.showToast('Bazar entry deleted', 'success');
      this.renderBazarTable();
      this.updateCards();
    }
  }

  exportCSV() {
    const headers = ['Date', 'Item', 'Buyer', 'Amount', 'Shared'];
    const rows = this.data.bazar.map(b => {
      const buyer = this.data.residents.find(r => r.id === b.buyer)?.name || 'Unknown';
      return [b.date, b.item, buyer, b.amount, b.shared ? 'Yes' : 'No'];
    });

    let csv = headers.join(',') + '\n';
    rows.forEach(row => csv += row.join(',') + '\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hostel-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    this.showToast('CSV exported', 'success');
  }

  exportJSON() {
    const json = JSON.stringify(this.data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hostel-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    this.showToast('JSON exported', 'success');
  }

  importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        this.data = imported;
        this.saveData();
        this.showToast('Data imported successfully', 'success');
        this.render();
      } catch (error) {
        this.showToast('Invalid JSON file', 'error');
      }
    };
    reader.readAsText(file);
  }

  resetData() {
    if (confirm('সব ডেটা মুছে যাবে। নিশ্চিত?')) {
      this.data = this.getDefaultData();
      this.saveData();
      this.showToast('Data reset', 'success');
      this.render();
    }
  }

  printView() {
    window.print();
  }

  saveSettings() {
    this.data.settings.currency = document.getElementById('currencyInput').value || '৳';
    this.data.settings.perMealCost = parseFloat(document.getElementById('perMealCostInput').value) || null;
    this.saveData();
    this.showToast('Settings saved', 'success');
    this.render();
  }

  switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  }

  toggleDarkMode() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
  }

  showTutorial() {
    document.getElementById('tutorialOverlay').hidden = false;
  }

  closeTutorial() {
    document.getElementById('tutorialOverlay').hidden = true;
  }

  showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
  }

  populateMonthSelector() {
    const select = document.getElementById('monthSelect');
    const today = new Date();
    for (let i = -5; i <= 5; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i);
      const option = document.createElement('option');
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      option.value = value;
      option.textContent = date.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long' });
      if (i === 0) option.selected = true;
      select.appendChild(option);
    }
  }

  editProfile(residentId) {
    alert('Edit profile feature coming soon');
  }

  clearBazarForm() {
    document.getElementById('bazarDateInput').value = '';
    document.getElementById('bazarItemInput').value = '';
    document.getElementById('bazarAmountInput').value = '';
    document.getElementById('bazarSharedInput').checked = false;
  }

  clearPaymentForm() {
    document.getElementById('paymentDateInput').value = '';
    document.getElementById('paymentAmountInput').value = '';
    document.getElementById('paymentNoteInput').value = '';
  }
}

// Initialize app
const app = new HostelApp();
