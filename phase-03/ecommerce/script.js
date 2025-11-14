/* -----------------------------
  Basic product data (mock)
------------------------------ */
const PRODUCTS = [
  { id: 'p1', name: 'Classic Tee - Men', category: 'Men', price: 120, rating: 4.4, img: 'images/p1.jpg' },
  { id: 'p2', name: 'Denim Jacket - Women', category: 'Women', price: 220, rating: 4.6, img: 'images/p2.jpg' },
  { id: 'p3', name: 'Wireless Headphones', category: 'Electronics', price: 780, rating: 4.7, img: 'images/p3.jpg' },
  { id: 'p4', name: 'Smart Watch', category: 'Electronics', price: 950, rating: 4.5, img: 'images/p4.jpg' },
  { id: 'p5', name: 'Leather Belt', category: 'Accessories', price: 90, rating: 4.2, img: 'images/p5.jpg' },
  { id: 'p6', name: 'Sneakers - Men', category: 'Men', price: 340, rating: 4.3, img: 'images/p6.jpg' },
  { id: 'p7', name: 'Satin Dress - Women', category: 'Women', price: 460, rating: 4.8, img: 'images/p7.jpg' },
  { id: 'p8', name: 'Sunglasses', category: 'Accessories', price: 160, rating: 4.1, img: 'images/p8.jpg' },
  { id: 'p9', name: 'Bluetooth Speaker', category: 'Electronics', price: 390, rating: 4.4, img: 'images/p9.jpg' },
];

/* -----------------------------
  Utilities
------------------------------ */
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

function formatCurrencyBDT(amount) {
  return `৳${amount.toLocaleString('en-BD')}`;
}

function getCart() {
  try {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateNavCartCount();
}

function updateNavCartCount() {
  const cartCountEl = $('#navCartCount');
  if (!cartCountEl) return;
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = String(count);
}

function showToast(message = 'Added to cart') {
  const t = $('#toast');
  if (!t) return;
  t.textContent = message;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1500);
}

function setThemeFromStorage() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
}

/* -----------------------------
  Global init
------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  // Year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme
  setThemeFromStorage();
  const modeBtn = $('#modeToggle');
  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // Loader (simulate small delay)
  const loader = $('#loader');
  if (loader) {
    loader.style.display = 'flex';
    setTimeout(() => loader.style.display = 'none', 500);
  }

  updateNavCartCount();

  initHome();
  initProductsPage();
  initDetailsPage();
  initCartPage();
  initCheckoutPage();
  initNewsletter();
});

/* -----------------------------
  Homepage: featured products
------------------------------ */
function initHome() {
  const container = $('#featuredGrid');
  if (!container) return;
  const featured = PRODUCTS.slice(0, 4);
  container.innerHTML = featured.map(cardHTML).join('');
  bindAddToCartButtons(container);
}

function cardHTML(p) {
  const stars = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));
  return `
    <article class="product-card">
      <a href="product-details.html?id=${encodeURIComponent(p.id)}">
        <img src="${p.img}" alt="${p.name}">
      </a>
      <div class="product-info">
        <a href="product-details.html?id=${encodeURIComponent(p.id)}" class="product-title">${p.name}</a>
        <div class="product-meta">
          <span class="price">${formatCurrencyBDT(p.price)}</span>
          <span class="rating" title="${p.rating.toFixed(1)}">${stars}</span>
        </div>
        <button class="btn btn-primary add-to-cart" data-id="${p.id}">Add to Cart</button>
      </div>
    </article>
  `;
}

function bindAddToCartButtons(scope = document) {
  $$('.add-to-cart', scope).forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      addToCart(id, 1);
      showToast('Added to cart');
    });
  });
}

/* -----------------------------
  Products page: search & filters
------------------------------ */
function initProductsPage() {
  const grid = $('#productsGrid');
  if (!grid) return;

  const params = new URLSearchParams(location.search);
  const query = params.get('q')?.trim().toLowerCase() || '';
  const categoryParam = params.get('category');

  const searchInput = $('#productsSearchInput');
  const searchForm = $('#productsSearchForm');
  const categorySelect = $('#categorySelect');
  const priceRange = $('#priceRange');
  const priceRangeValue = $('#priceRangeValue');
  const ratingSelect = $('#ratingSelect');
  const clearBtn = $('#clearFiltersBtn');

  // Defaults
  categorySelect.value = categoryParam || 'All';
  priceRange.value = 1000;
  priceRangeValue.textContent = priceRange.value;
  if (searchInput) searchInput.value = query;

  // Render
  let state = {
    q: query,
    category: categorySelect.value,
    maxPrice: Number(priceRange.value),
    minRating: Number(ratingSelect.value)
  };
  renderProducts(grid, state);

  // Events
  searchForm?.addEventListener('submit', e => {
    e.preventDefault();
    state.q = searchInput.value.trim().toLowerCase();
    renderProducts(grid, state);
  });

  categorySelect.addEventListener('change', () => {
    state.category = categorySelect.value;
    renderProducts(grid, state);
  });

  priceRange.addEventListener('input', () => {
    priceRangeValue.textContent = priceRange.value;
    state.maxPrice = Number(priceRange.value);
    renderProducts(grid, state);
  });

  ratingSelect.addEventListener('change', () => {
    state.minRating = Number(ratingSelect.value);
    renderProducts(grid, state);
  });

  clearBtn.addEventListener('click', () => {
    state = { q: '', category: 'All', maxPrice: 1000, minRating: 0 };
    searchInput.value = '';
    categorySelect.value = 'All';
    priceRange.value = 1000;
    priceRangeValue.textContent = '1000';
    ratingSelect.value = '0';
    renderProducts(grid, state);
  });
}

function renderProducts(grid, state) {
  const filtered = PRODUCTS.filter(p => {
    const matchesQ = !state.q || p.name.toLowerCase().includes(state.q);
    const matchesCat = state.category === 'All' || p.category === state.category;
    const matchesPrice = p.price <= state.maxPrice;
    const matchesRating = p.rating >= state.minRating;
    return matchesQ && matchesCat && matchesPrice && matchesRating;
  });

  grid.innerHTML = filtered.map(cardHTML).join('') || `
    <p>No products match your filters.</p>
  `;
  bindAddToCartButtons(grid);
}

/* -----------------------------
  Product details: zoom + add
------------------------------ */
function initDetailsPage() {
  const container = $('#productDetailsContainer');
  if (!container) return;

  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

  container.innerHTML = `
    <div class="details-media">
      <img id="detailsImage" src="${product.img}" alt="${product.name}">
      <div class="zoom" id="zoomLayer" style="background-image: url('${product.img}')"></div>
    </div>
    <div class="details-content">
      <h2>${product.name}</h2>
      <p class="muted">Category: ${product.category}</p>
      <p>Experience premium quality and comfort. Designed to elevate your everyday essentials.</p>
      <p><strong>Price:</strong> ${formatCurrencyBDT(product.price)}</p>
      <div>
        <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
        <a href="products.html" class="btn btn-outline">Back to products</a>
      </div>
    </div>
  `;

  // Zoom on hover
  const img = $('#detailsImage');
  const zoom = $('#zoomLayer');
  if (img && zoom) {
    const enter = () => zoom.style.opacity = '1';
    const leave = () => zoom.style.opacity = '0';
    const move = e => {
      const rect = img.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      zoom.style.backgroundPosition = `${x}% ${y}%`;
    };
    img.addEventListener('mouseenter', enter);
    img.addEventListener('mouseleave', leave);
    img.addEventListener('mousemove', move);
  }

  bindAddToCartButtons(container);
}

/* -----------------------------
  Cart page
------------------------------ */
function initCartPage() {
  const container = $('#cartContainer');
  if (!container) return;

  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `
      <p>Your cart is empty.</p>
      <a href="products.html" class="btn btn-primary">Browse products</a>
    `;
    updateCartSummary();
    return;
  }

  container.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    if (!p) return '';
    return `
      <div class="cart-item" data-id="${item.id}">
        <img src="${p.img}" alt="${p.name}">
        <div>
          <h4>${p.name}</h4>
          <p class="muted">${p.category}</p>
          <div class="qty">
            <label>Qty</label>
            <input type="number" min="1" value="${item.qty}" class="qty-input" />
          </div>
          <p><strong>Price:</strong> ${formatCurrencyBDT(p.price)}</p>
        </div>
        <div>
          <p><strong>Line total:</strong> ${formatCurrencyBDT(p.price * item.qty)}</p>
          <button class="btn btn-outline remove-item">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  // Bind qty changes
  $$('.cart-item').forEach(row => {
    const id = row.getAttribute('data-id');
    const qtyInput = $('.qty-input', row);
    const removeBtn = $('.remove-item', row);

    qtyInput.addEventListener('input', () => {
      const qty = Math.max(1, Number(qtyInput.value) || 1);
      qtyInput.value = qty;
      updateItemQty(id, qty);
      // Update line total
      const p = PRODUCTS.find(pr => pr.id === id);
      const line = $('p strong', row).parentElement; // line total container
      line.innerHTML = `<strong>Line total:</strong> ${formatCurrencyBDT(p.price * qty)}`;
      updateCartSummary();
    });

    removeBtn.addEventListener('click', () => {
      removeFromCart(id);
      row.remove();
      if (getCart().length === 0) {
        initCartPage(); // re-render empty state
      }
      updateCartSummary();
      showToast('Removed from cart');
    });
  });

  updateCartSummary();
}

function updateCartSummary() {
  const subtotalEl = $('#cartSubtotal');
  const taxEl = $('#cartTax');
  const totalEl = $('#cartTotal');
  if (!subtotalEl || !taxEl || !totalEl) return;

  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  subtotalEl.textContent = formatCurrencyBDT(subtotal);
  taxEl.textContent = formatCurrencyBDT(tax);
  totalEl.textContent = formatCurrencyBDT(total);
}

/* -----------------------------
  Checkout page
------------------------------ */
function initCheckoutPage() {
  const form = $('#checkoutForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#fullName').value.trim();
    const address = $('#address').value.trim();
    const phone = $('#phone').value.trim();
    const payment = $('#payment').value;

    if (!name || !address || !phone) {
      showToast('Please fill in all fields.');
      return;
    }
    alert(`Order placed!\n\nName: ${name}\nAddress: ${address}\nPhone: ${phone}\nPayment: ${payment}`);
    // Clear cart
    setCart([]);
    // Redirect
    location.href = 'index.html';
  });
}

/* -----------------------------
  Newsletter (simple)
------------------------------ */
function initNewsletter() {
  const form = $('#newsletterForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Subscribed. Welcome!');
    form.reset();
  });
}

/* -----------------------------
  Cart operations
------------------------------ */
function addToCart(id, qty = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty += qty;
  else cart.push({ id, qty });
  setCart(cart);
}

function updateItemQty(id, qty) {
  const cart = getCart().map(item => item.id === id ? { ...item, qty } : item);
  setCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  setCart(cart);
}

/* -----------------------------
  Navigation enhancements
------------------------------ */
document.addEventListener('click', e => {
  const target = e.target;
  if (target.matches('.product-card a, .product-title')) {
    // no-op; default navigation to details
  }
});
