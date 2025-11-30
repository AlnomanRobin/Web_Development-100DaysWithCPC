/* Currency Converter (Full JS)
   - Plain JavaScript, modular, accessible
   - Real-time rates with caching (localStorage), offline fallback
   - Flags via CDN (FlagCDN), fallback to symbol if flag missing
   - Debounced input and searchable dropdowns
   - Specifically ensures BDT (Bangladeshi Taka) conversion works
*/

/* =========================
   Configuration
========================= */

/**
 * Replace with your real provider. Two examples are shown:
 *
 * Example A (Open Exchange Rates style):
 * const API_URL = "https://openexchangerates.org/api/latest.json?app_id=REPLACE_ME&base={base}&symbols={symbols}";
 *
 * Example B (ExchangeRate-API style):
 * const API_URL = "https://v6.exchangerate-api.com/v6/REPLACE_ME/latest/{base}";
 * // This one returns all symbols for a base; we'll filter in code.
 *
 * Pick one, uncomment, and set your API key. The code below uses Example B by default.
 */
const API_URL = "https://v6.exchangerate-api.com/v6/REPLACE_ME/latest/{base}";

/**
 * Optional: If your API requires symbols (Example A), set USE_SYMBOLS = true.
 * For Example B (returns all), keep false.
 */
const USE_SYMBOLS = false;

// Cache TTL
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Update footer with active API URL
document.addEventListener("DOMContentLoaded", () => {
  const apiLink = document.getElementById("apiLink");
  if (apiLink) apiLink.textContent = API_URL;
});

/* =========================
   Currency metadata
========================= */

// Minimal but includes BDT. Add more as needed.
const CURRENCIES = [
  { code: "USD", name: "United States Dollar", country: "United States", cc: "us", symbol: "$", decimals: 2 },
  { code: "EUR", name: "Euro", country: "European Union", cc: "eu", symbol: "€", decimals: 2 },
  { code: "GBP", name: "British Pound Sterling", country: "United Kingdom", cc: "gb", symbol: "£", decimals: 2 },
  { code: "JPY", name: "Japanese Yen", country: "Japan", cc: "jp", symbol: "¥", decimals: 0 },
  { code: "AUD", name: "Australian Dollar", country: "Australia", cc: "au", symbol: "A$", decimals: 2 },
  { code: "CAD", name: "Canadian Dollar", country: "Canada", cc: "ca", symbol: "C$", decimals: 2 },
  { code: "CHF", name: "Swiss Franc", country: "Switzerland", cc: "ch", symbol: "CHF", decimals: 2 },
  { code: "CNY", name: "Chinese Yuan", country: "China", cc: "cn", symbol: "¥", decimals: 2 },
  { code: "INR", name: "Indian Rupee", country: "India", cc: "in", symbol: "₹", decimals: 2 },
  { code: "BDT", name: "Bangladeshi Taka", country: "Bangladesh", cc: "bd", symbol: "৳", decimals: 2 },
  { code: "BRL", name: "Brazilian Real", country: "Brazil", cc: "br", symbol: "R$", decimals: 2 },
  { code: "MXN", name: "Mexican Peso", country: "Mexico", cc: "mx", symbol: "$", decimals: 2 },
  { code: "ZAR", name: "South African Rand", country: "South Africa", cc: "za", symbol: "R", decimals: 2 },
  { code: "AED", name: "UAE Dirham", country: "United Arab Emirates", cc: "ae", symbol: "د.إ", decimals: 2 },
  { code: "SGD", name: "Singapore Dollar", country: "Singapore", cc: "sg", symbol: "S$", decimals: 2 },
  { code: "KRW", name: "South Korean Won", country: "South Korea", cc: "kr", symbol: "₩", decimals: 0 },
  { code: "SEK", name: "Swedish Krona", country: "Sweden", cc: "se", symbol: "kr", decimals: 2 },
  { code: "NOK", name: "Norwegian Krone", country: "Norway", cc: "no", symbol: "kr", decimals: 2 },
  { code: "DKK", name: "Danish Krone", country: "Denmark", cc: "dk", symbol: "kr", decimals: 2 },
  { code: "PLN", name: "Polish Złoty", country: "Poland", cc: "pl", symbol: "zł", decimals: 2 },
  { code: "HKD", name: "Hong Kong Dollar", country: "Hong Kong", cc: "hk", symbol: "HK$", decimals: 2 },
  { code: "NZD", name: "New Zealand Dollar", country: "New Zealand", cc: "nz", symbol: "NZ$", decimals: 2 },
  { code: "THB", name: "Thai Baht", country: "Thailand", cc: "th", symbol: "฿", decimals: 2 },
  { code: "MYR", name: "Malaysian Ringgit", country: "Malaysia", cc: "my", symbol: "RM", decimals: 2 },
];

/* =========================
   State
========================= */

let state = {
  from: "USD",
  to: "BDT",
  amount: "",
  favoritesFrom: JSON.parse(localStorage.getItem("favoritesFrom") || "[]"),
  favoritesTo: JSON.parse(localStorage.getItem("favoritesTo") || "[]"),
  lastRates: JSON.parse(localStorage.getItem("lastRates") || "null"), // { base, rates, timestamp }
};

/* =========================
   DOM utils & helpers
========================= */

const qs = (sel) => document.querySelector(sel);

function currencyMeta(code) {
  return CURRENCIES.find(c => c.code === code);
}

function flagUrl(cc) {
  return `https://flagcdn.com/24x18/${cc}.png`;
}

function formatCurrency(value, code) {
  const meta = currencyMeta(code) || { decimals: 2 };
  const decimals = meta.decimals ?? 2;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch {
    const symbol = meta?.symbol || code;
    return `${symbol} ${Number(value).toFixed(decimals)}`;
  }
}

function nowISO() {
  const d = new Date();
  return `${d.toLocaleString()} (${d.toISOString()})`;
}

function showError(msg) {
  const el = qs("#error");
  if (el) {
    el.textContent = msg;
    el.hidden = false;
  }
}

function clearError() {
  const el = qs("#error");
  if (el) {
    el.hidden = true;
    el.textContent = "";
  }
}

function setStatus(msg) {
  const el = qs("#status");
  if (el) el.textContent = msg;
}

function showSkeleton(show) {
  const sk = qs("#skeleton");
  if (sk) sk.hidden = !show;
}

function setResult(converted, rate, base, target, timestamp) {
  qs("#convertedAmount").textContent = converted != null ? converted : "—";
  qs("#rateInfo").textContent = rate != null ? `Rate: 1 ${base} = ${rate} ${target}` : "Rate: —";
  qs("#timestamp").textContent = timestamp ? `Updated: ${timestamp}` : "Updated: —";
}

/* =========================
   Theme toggle
========================= */

(function themeInit() {
  const btn = qs("#themeToggle");
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  btn?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
})();

/* =========================
   Dropdowns
========================= */

function renderOptions(listEl, items, currentCode) {
  listEl.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.className = "dropdown-option";
    li.setAttribute("role", "option");
    li.setAttribute("tabindex", "-1");
    li.setAttribute("data-code", item.code);
    li.setAttribute("aria-selected", item.code === currentCode ? "true" : "false");

    const img = document.createElement("img");
    img.className = "flag";
    img.width = 24; img.height = 18;
    img.alt = item.country;
    img.src = flagUrl(item.cc);
    img.onerror = () => { img.hidden = true; };

    const code = document.createElement("span");
    code.className = "option-code";
    code.textContent = item.code;

    const name = document.createElement("span");
    name.className = "option-name";
    name.textContent = item.name;

    const symbol = document.createElement("span");
    symbol.className = "option-symbol";
    symbol.textContent = item.symbol || "";

    li.append(img, code, name, symbol);
    listEl.appendChild(li);
  });
}

function renderFavorites(listEl, favCodes) {
  listEl.innerHTML = "";
  favCodes.forEach(code => {
    const meta = currencyMeta(code);
    if (!meta) return;
    const li = document.createElement("li");
    li.className = "favorite-item";
    li.setAttribute("data-code", code);

    const img = document.createElement("img");
    img.className = "flag";
    img.width = 24; img.height = 18;
    img.alt = meta.country;
    img.src = flagUrl(meta.cc);
    img.onerror = () => img.hidden = true;

    const label = document.createElement("span");
    label.textContent = `${meta.code} — ${meta.name}`;

    li.append(img, label);
    listEl.appendChild(li);
  });
}

function filterCurrencies(query) {
  const q = query.trim().toLowerCase();
  if (!q) return CURRENCIES;
  return CURRENCIES.filter(c =>
    c.code.toLowerCase().includes(q) ||
    c.country.toLowerCase().includes(q) ||
    c.name.toLowerCase().includes(q)
  );
}

function openDropdown(kind) {
  const menu = qs(`#${kind}CurrencyList`);
  const btn = qs(`#${kind}CurrencyBtn`);
  const search = qs(`#${kind}Search`);
  menu.classList.add("open");
  btn.setAttribute("aria-expanded", "true");
  menu.focus();
  setTimeout(() => search?.focus(), 10);
}

function closeDropdown(kind) {
  const menu = qs(`#${kind}CurrencyList`);
  const btn = qs(`#${kind}CurrencyBtn`);
  menu.classList.remove("open");
  btn.setAttribute("aria-expanded", "false");
}

function initDropdown(kind) {
  const btn = qs(`#${kind}CurrencyBtn`);
  const list = qs(`#${kind}Options`);
  const search = qs(`#${kind}Search`);
  const favList = qs(`#${kind}Favorites`);

  const current = kind === "from" ? state.from : state.to;
  renderOptions(list, CURRENCIES, current);
  const favs = kind === "from" ? state.favoritesFrom : state.favoritesTo;
  renderFavorites(favList, favs);

  btn.addEventListener("click", () => openDropdown(kind));

  document.addEventListener("click", (e) => {
    const menu = qs(`#${kind}CurrencyList`);
    const dropdown = menu?.closest(".dropdown");
    if (!dropdown) return;
    if (!dropdown.contains(e.target)) {
      closeDropdown(kind);
    }
  });

  btn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDropdown(kind);
    }
  });

  search.addEventListener("input", () => {
    renderOptions(list, filterCurrencies(search.value), current);
  });

  list.addEventListener("click", (e) => {
    const li = e.target.closest(".dropdown-option");
    if (!li) return;
    const code = li.getAttribute("data-code");
    selectCurrency(kind, code);
    closeDropdown(kind);
  });

  list.addEventListener("keydown", (e) => {
    const options = Array.from(list.querySelectorAll(".dropdown-option"));
    let idx = options.findIndex(o => o === document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      options[Math.min(idx + 1, options.length - 1)]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      options[Math.max(idx - 1, 0)]?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const code = document.activeElement.getAttribute("data-code");
      if (code) {
        selectCurrency(kind, code);
        closeDropdown(kind);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeDropdown(kind);
      btn.focus();
    }
  });

  favList.addEventListener("click", (e) => {
    const li = e.target.closest(".favorite-item");
    if (!li) return;
    const code = li.getAttribute("data-code");
    selectCurrency(kind, code);
    closeDropdown(kind);
  });
}

function selectCurrency(kind, code) {
  const meta = currencyMeta(code);
  if (!meta) return;

  const codeEl = qs(`#${kind}Code`);
  const nameEl = qs(`#${kind}Name`);
  const flagEl = qs(`#${kind}Flag`);

  codeEl.textContent = meta.code;
  nameEl.textContent = meta.name;
  flagEl.alt = meta.country;
  flagEl.src = flagUrl(meta.cc);
  flagEl.onerror = () => flagEl.hidden = true;

  if (kind === "from") state.from = meta.code;
  else state.to = meta.code;

  debouncedConvert();
}

/* =========================
   Swap
========================= */

(function setupSwap() {
  const btn = qs("#swapBtn");
  btn.addEventListener("click", () => {
    btn.classList.add("swapping");
    setTimeout(() => btn.classList.remove("swapping"), 240);

    const tmp = state.from;
    state.from = state.to;
    state.to = tmp;

    selectCurrency("from", state.from);
    selectCurrency("to", state.to);

    debouncedConvert();
  });
})();

/* =========================
   Favorites
========================= */

(function setupPins() {
  qs("#pinFromBtn").addEventListener("click", () => {
    if (!state.favoritesFrom.includes(state.from)) {
      state.favoritesFrom.push(state.from);
      localStorage.setItem("favoritesFrom", JSON.stringify(state.favoritesFrom));
      renderFavorites(qs("#fromFavorites"), state.favoritesFrom);
      setStatus(`Pinned ${state.from} to favorites`);
    }
  });

  qs("#pinToBtn").addEventListener("click", () => {
    if (!state.favoritesTo.includes(state.to)) {
      state.favoritesTo.push(state.to);
      localStorage.setItem("favoritesTo", JSON.stringify(state.favoritesTo));
      renderFavorites(qs("#toFavorites"), state.favoritesTo);
      setStatus(`Pinned ${state.to} to favorites`);
    }
  });
})();

/* =========================
   Fetch rates with cache
========================= */

async function fetchRates(base, symbols) {
  // If API requires symbols, include them in URL; otherwise just base.
  let url = API_URL.replace("{base}", encodeURIComponent(base));
  if (USE_SYMBOLS && url.includes("{symbols}")) {
    url = url.replace("{symbols}", encodeURIComponent(symbols.join(",")));
  }

  // Use fresh cache if available
  const cached = state.lastRates;
  const now = Date.now();
  if (cached && cached.base === base && (now - cached.timestamp) < CACHE_TTL_MS) {
    return cached.rates;
  }

  showSkeleton(true);
  clearError();
  setStatus("Fetching latest rates…");

  try {
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();

    // Normalize different API schemas to { rates: { CODE: number }, timestamp: number }
    let rates = {};
    let stamp = Date.now();

    // Example B: v6.exchangerate-api.com
    if (data && data.conversion_rates) {
      rates = data.conversion_rates;
      stamp = data.time_last_update_unix ? data.time_last_update_unix * 1000 : Date.now();
    }

    // Example A: openexchangerates.org style
    if (data && data.rates) {
      rates = data.rates;
      stamp = data.timestamp ? data.timestamp * 1000 : Date.now();
    }

    if (!rates || typeof rates !== "object") {
      throw new Error("Unexpected API response schema.");
    }

    state.lastRates = { base, rates, timestamp: stamp };
    localStorage.setItem("lastRates", JSON.stringify(state.lastRates));

    setStatus("Rates updated.");
    return rates;
  } catch (err) {
    setStatus("Using cached rates if available.");
    if (state.lastRates && state.lastRates.base === base) {
      showError("Live rates unavailable. Showing last cached rates.");
      return state.lastRates.rates;
    } else {
      showError("Unable to fetch rates and no cache available. Check your connection or API key.");
      throw err;
    }
  } finally {
    showSkeleton(false);
  }
}

/* =========================
   Conversion
========================= */

async function convert() {
  const amountStr = qs("#amount").value;
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount < 0) {
    showError("Please enter a valid non-negative amount.");
    setResult(null, null, null, null, null);
    return;
  }
  clearError();

  const base = state.from;
  const target = state.to;

  if (base === target) {
    const formatted = formatCurrency(amount, target);
    setResult(formatted, 1, base, target, nowISO());
    return;
  }

  try {
    const rates = await fetchRates(base, [target]);
    // If API returned all rates, just read target; if it returned only requested symbols, same logic applies.
    const rate = rates[target];
    if (typeof rate !== "number") {
      showError("Rate not available for selected currency pair.");
      setResult(null, null, null, null, null);
      return;
    }
    const converted = amount * rate;
    const formatted = formatCurrency(converted, target);
    setResult(formatted, Number(rate).toFixed(6), base, target, nowISO());
    setStatus("Conversion completed.");
  } catch {
    // Error already shown by fetchRates
  }
}

/* Debounce */
let convertTimer = null;
function debouncedConvert() {
  if (convertTimer) clearTimeout(convertTimer);
  convertTimer = setTimeout(convert, 300);
}

/* =========================
   Init
========================= */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize dropdowns
  initDropdown("from");
  initDropdown("to");

  // Input handlers
  const amountInput = qs("#amount");
  amountInput.addEventListener("input", debouncedConvert);
  qs("#convertBtn").addEventListener("click", convert);

  // Default amount example
  amountInput.value = "100";
  state.amount = "100";

  // Ensure UI shows USD -> BDT by default
  selectCurrency("from", state.from);
  selectCurrency("to", state.to);

  // First conversion attempt
  debouncedConvert();

  // Global Escape closes dropdowns
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDropdown("from");
      closeDropdown("to");
    }
  });
});

/* =========================
   Extensibility examples
========================= */

// Add more currencies:
// CURRENCIES.push({ code: "PHP", name: "Philippine Peso", country: "Philippines", cc: "ph", symbol: "₱", decimals: 2 });

// Change palette: edit CSS variables in styles.css (:root and [data-theme="dark"]).
