// script.js - logic for Color Maker
// Get elements
const preview = document.getElementById('preview');
const hexInput = document.getElementById('hexInput');
const rgbText = document.getElementById('rgbText');
const rSlider = document.getElementById('r');
const gSlider = document.getElementById('g');
const bSlider = document.getElementById('b');
const copyBtn = document.getElementById('copyBtn');
const randomBtn = document.getElementById('randomBtn');
const addFavBtn = document.getElementById('addFavBtn');
const clearFavs = document.getElementById('clearFavs');
const favList = document.getElementById('favList');

// Load favorites from localStorage
let favorites = JSON.parse(localStorage.getItem('colorFavorites')) || [];

// Initialize
updateFromSliders();
renderFavorites();

// Update color from sliders
function updateFromSliders() {
  const r = parseInt(rSlider.value);
  const g = parseInt(gSlider.value);
  const b = parseInt(bSlider.value);
  
  const hex = rgbToHex(r, g, b);
  
  preview.style.backgroundColor = hex;
  hexInput.value = hex;
  rgbText.textContent = `${r}, ${g}, ${b}`;
}

// Update sliders from hex input
function updateFromHex() {
  let hex = hexInput.value.trim();
  
  // Add # if missing
  if (!hex.startsWith('#')) {
    hex = '#' + hex;
  }
  
  // Validate hex
  if (!/^#[0-9A-F]{6}$/i.test(hex)) {
    return;
  }
  
  const rgb = hexToRgb(hex);
  
  rSlider.value = rgb.r;
  gSlider.value = rgb.g;
  bSlider.value = rgb.b;
  
  preview.style.backgroundColor = hex;
  rgbText.textContent = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
}

// Generate random color
function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  
  rSlider.value = r;
  gSlider.value = g;
  bSlider.value = b;
  
  updateFromSliders();
}

// Add to favorites
function addToFavorites() {
  const hex = hexInput.value;
  
  if (!favorites.includes(hex)) {
    favorites.push(hex);
    localStorage.setItem('colorFavorites', JSON.stringify(favorites));
    renderFavorites();
  }
}

// Clear all favorites
function clearAllFavorites() {
  if (confirm('Clear all saved colors?')) {
    favorites = [];
    localStorage.removeItem('colorFavorites');
    renderFavorites();
  }
}

// Render favorites list
function renderFavorites() {
  favList.innerHTML = '';
  
  favorites.forEach((hex) => {
    const div = document.createElement('div');
    div.className = 'fav-item';
    div.style.backgroundColor = hex;
    div.setAttribute('data-hex', hex);
    div.onclick = () => applyFavorite(hex);
    favList.appendChild(div);
  });
}

// Apply favorite color
function applyFavorite(hex) {
  hexInput.value = hex;
  updateFromHex();
}

// Copy hex to clipboard
function copyHex() {
  navigator.clipboard.writeText(hexInput.value).then(() => {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 1500);
  });
}

// Utility functions
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Event listeners
rSlider.addEventListener('input', updateFromSliders);
gSlider.addEventListener('input', updateFromSliders);
bSlider.addEventListener('input', updateFromSliders);
hexInput.addEventListener('input', updateFromHex);
copyBtn.addEventListener('click', copyHex);
randomBtn.addEventListener('click', randomColor);
addFavBtn.addEventListener('click', addToFavorites);
clearFavs.addEventListener('click', clearAllFavorites);