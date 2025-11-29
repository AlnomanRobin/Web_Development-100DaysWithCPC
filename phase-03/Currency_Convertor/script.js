/* Currency Converter - script.js
   Provides:
   - convert via exchangerate.host
   - basic caching in localStorage with TTL
   - swap, pin (favorites), simple status/error UI
   - flag images shown from flagcdn
*/

/* =========================
   Configuration & Data
   ========================= */

const API_BASE = "https://api.exchangerate.host";

const CURRENCIES = [
  { code: "USD", name: "United States Dollar", cc: "us", symbol: "$", decimals: 2 },
  { code: "EUR", name: "Euro", cc: "eu", symbol: "€", decimals: 2 },
  { code: "GBP", name: "British Pound Sterling", cc: "gb", symbol: "£", decimals: 2 },
  { code: "JPY", name: "Japanese Yen", cc: "jp", symbol: "¥", decimals: 0 },
  { code: "AUD", name: "Australian Dollar", cc: "au", symbol: "A$", decimals: 2 },
  { code: "CAD", name: "Canadian Dollar", cc: "ca", symbol: "C$", decimals: 2 },
  { code: "CHF", name: "Swiss Franc", cc: "ch", symbol: "CHF", decimals: 2 },
  { code: "CNY", name: "Chinese Yuan", cc: "cn", symbol: "¥", decimals: 2 },
  { code: "INR", name: "Indian Rupee", cc: "in", symbol: "₹", decimals: 2 },
  { code: "BDT", name: "Bangladeshi Taka", cc: "bd", symbol: "৳", decimals: 2 },
  // add more as needed...
];

const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

/* =========================
   Small helpers
   ========================= */

const qs = (s) => document.querySelector(s);
const qid = (id) => document.getElementById(id);

function currencyMeta(code) {
  return CURRENCIES.find(c => c.code === (code || "").toUpperCase()) || { code, name: code, cc: "eu", decimals: 2 };
}
function flagUrl(cc) {
  if (!cc) cc = "eu";
  return `https://flagcdn.com/24x18/${cc.toLowerCase()}.png`;
}
function formatAmount(value, code) {
  const meta = currencyMeta(code);
  const opts = { minimumFractionDigits: meta.decimals ?? 2, maximumFractionDigits: meta.decimals ?? 2 };
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: code, ...opts }).format(value);
  } catch {
    return `${meta.symbol || code} ${Number(value).toFixed(meta.decimals ?? 2)}`;
  }
}
function nowISO() { return new Date().toISOString(); }

/* =========================
   DOM refs
   ========================= */

const amountEl = qid("amount");
const fromCodeEl = qid("fromCode");
const toCodeEl = qid("toCode");
const fromFlagEl = qid("fromFlag");
const toFlagEl = qid("toFlag");
const fromNameEl = qid("fromName");
const toNameEl = qid("toName");

const convertBtn = qid("convertBtn");
const swapBtn = qid("swapBtn");
const pinFromBtn = qid("pinFromBtn");
const pinToBtn = qid("pinToBtn");

const skeleton = qid("skeleton");
const convertedAmountEl = qid("convertedAmount");
const rateInfoEl = qid("rateInfo");
const timestampEl = qid("timestamp");
const statusEl = qid("status");
const errorEl = qid("error");
const apiLinkEl = qid("apiLink");

/* =========================
   Cache (localStorage)
   ========================= */

function cacheKey(from, to) { return `rates_${from}_${to}`; }
function saveCache(from, to, rate, date) {
  try {
    const payload = { rate, date, ts: Date.now() };
    localStorage.setItem(cacheKey(from, to), JSON.stringify(payload));
  } catch (e) { /* ignore */ }
}
function loadCache(from, to) {
  try {
    const raw = localStorage.getItem(cacheKey(from, to));
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (!p.ts || (Date.now() - p.ts) > CACHE_TTL_MS) return null;
    return p;
  } catch { return null; }
}

/* =========================
   UI helpers
   ========================= */

function showSkeleton(show = true) {
  if (!skeleton) return;
  if (show) skeleton.removeAttribute("hidden");
  else skeleton.setAttribute("hidden", "");
}
function showStatus(msg = "") {
  if (!statusEl) return;
  statusEl.textContent = msg;
}
function showError(msg) {
  if (!errorEl) return;
  errorEl.textContent = msg;
  errorEl.hidden = false;
}
function clearError() {
  if (!errorEl) return;
  errorEl.textContent = "";
  errorEl.hidden = true;
}
function clearResults() {
  convertedAmountEl.textContent = "—";
  rateInfoEl.textContent = "Rate: —";
  timestampEl.textContent = "Updated: —";
}

/* =========================
   Core: Convert + Swap + Pin
   ========================= */

async function convert() {
  clearError();
  showStatus("");
  const amount = parseFloat(amountEl.value);
  if (Number.isNaN(amount) || amount <= 0) {
    showError("Enter a valid amount greater than 0.");
    return;
  }
  const from = (fromCodeEl.textContent || "USD").trim();
  const to = (toCodeEl.textContent || "EUR").trim();
  if (!from || !to) { showError("Missing currency codes."); return; }

  showSkeleton(true);
  convertBtn.disabled = true;

  const url = `${API_BASE}/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();

    if (data && typeof data.result === "number") {
      const converted = Number(data.result);
      // exchangerate.host returns info.rate
      const rate = data.info && data.info.rate ? Number(data.info.rate) : (converted / amount);
      const date = data.date || new Date().toISOString().slice(0, 10);

      convertedAmountEl.textContent = `${formatAmount(converted, to)}`;
      rateInfoEl.textContent = `Rate: 1 ${from} = ${rate.toLocaleString(undefined, {maximumFractionDigits: 8})} ${to}`;
      timestampEl.textContent = `Updated: ${date}`;

      saveCache(from, to, rate, date);
      showStatus("Rates fetched from API.");
    } else {
      throw new Error("Unexpected API response");
    }
  } catch (err) {
    console.error("Convert error:", err);
    // fallback to cache
    const cached = loadCache(from, to);
    if (cached && cached.rate) {
      const converted = amount * cached.rate;
      convertedAmountEl.textContent = `${formatAmount(converted, to)}`;
      rateInfoEl.textContent = `Rate (cached): 1 ${from} = ${cached.rate.toLocaleString(undefined, {maximumFractionDigits: 8})} ${to}`;
      timestampEl.textContent = `Cached: ${cached.date || new Date(cached.ts).toISOString().slice(0,10)}`;
      showStatus("Using cached rate (offline).");
    } else {
      showError("Unable to fetch rates and no cache available. Check your connection or API.");
      clearResults();
    }
  } finally {
    showSkeleton(false);
    convertBtn.disabled = false;
  }
}

function swapCurrencies() {
  const aCode = fromCodeEl.textContent;
  const bCode = toCodeEl.textContent;

  // swap codes
  fromCodeEl.textContent = bCode;
  toCodeEl.textContent = aCode;

  // swap flag src/alt
  const aSrc = fromFlagEl.getAttribute("src");
  const aAlt = fromFlagEl.getAttribute("alt");
  fromFlagEl.setAttribute("src", toFlagEl.getAttribute("src"));
  fromFlagEl.setAttribute("alt", toFlagEl.getAttribute("alt") || "");
  toFlagEl.setAttribute("src", aSrc);
  toFlagEl.setAttribute("alt", aAlt || "");

  // swap names
  const aName = fromNameEl.textContent;
  const bName = toNameEl.textContent;
  fromNameEl.textContent = bName;
  toNameEl.textContent = aName;

  clearResults();
  clearError();
  showStatus("Currencies swapped.");
}

/* Pin (simple favourites) */
function loadFavorites() {
  try {
    return {
      from: JSON.parse(localStorage.getItem("favoritesFrom") || "[]"),
      to: JSON.parse(localStorage.getItem("favoritesTo") || "[]")
    };
  } catch { return { from: [], to: [] }; }
}
function saveFavorites(favFrom, favTo) {
  try {
    localStorage.setItem("favoritesFrom", JSON.stringify(favFrom));
    localStorage.setItem("favoritesTo", JSON.stringify(favTo));
  } catch {}
}
function togglePin(which) {
  const code = which === "from" ? (fromCodeEl.textContent || "USD").trim() : (toCodeEl.textContent || "EUR").trim();
  const favs = loadFavorites();
  const list = which === "from" ? favs.from : favs.to;
  const idx = list.indexOf(code);
  if (idx === -1) {
    list.unshift(code);
    if (list.length > 10) list.pop();
    showStatus(`${code} pinned to ${which} favorites.`);
  } else {
    list.splice(idx, 1);
    showStatus(`${code} removed from ${which} favorites.`);
  }
  saveFavorites(favs.from, favs.to);
}

/* =========================
   Initialization
   ========================= */

function initDefaultUI() {
  // set footer API text
  if (apiLinkEl) apiLinkEl.textContent = `${API_BASE}/*convert*/`;

  // set default from/to values already present in HTML; ensure flags/names match codes
  const fromCode = (fromCodeEl.textContent || "USD").trim();
  const toCode = (toCodeEl.textContent || "EUR").trim();

  const fromMeta = currencyMeta(fromCode);
  const toMeta = currencyMeta(toCode);

  fromCodeEl.textContent = fromMeta.code;
  toCodeEl.textContent = toMeta.code;

  fromNameEl.textContent = fromMeta.name || fromMeta.code;
  toNameEl.textContent = toMeta.name || toMeta.code;

  fromFlagEl.setAttribute("src", flagUrl(fromMeta.cc));
  fromFlagEl.setAttribute("alt", fromMeta.name || fromMeta.code);
  toFlagEl.setAttribute("src", flagUrl(toMeta.cc));
  toFlagEl.setAttribute("alt", toMeta.name || toMeta.code);

  clearResults();
  clearError();
  showSkeleton(false);
  showStatus("Using cached rates if available.");
}

document.addEventListener("DOMContentLoaded", () => {
  initDefaultUI();

  // wire events
  if (convertBtn) convertBtn.addEventListener("click", convert);
  if (swapBtn) swapBtn.addEventListener("click", swapCurrencies);
  if (pinFromBtn) pinFromBtn.addEventListener("click", () => togglePin("from"));
  if (pinToBtn) pinToBtn.addEventListener("click", () => togglePin("to"));

  if (amountEl) {
    amountEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") convert();
    });
  }

  // quick accessibility: pressing space/enter on flag area or codes could be wired later
});

/* Expose for debugging (optional) */
window._cv = { convert, swapCurrencies, formatAmount, currencyMeta };