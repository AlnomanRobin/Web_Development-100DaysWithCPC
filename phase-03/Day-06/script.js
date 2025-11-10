/* ============================================================
   Turbo Lane - Car Racing Game (Pure JS)
   ------------------------------------------------------------
   Gameplay:
   - Move left/right to dodge enemy cars.
   - Road scrolls downward; enemies spawn from top.
   - Collide => Game Over.
   - Score increases over time; difficulty ramps up.

   Features:
   - Keyboard + touch controls
   - Start & Game Over overlays
   - Score + High Score
   - Day/Night toggle, parallax background
   - Optional sounds (bgm, collision, coin)
   - Responsive design and smooth animations

   All code is original and well-commented for learning.
   ============================================================ */

// ------------------------------
// DOM references
// ------------------------------
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const menuBtn = document.getElementById('menuBtn');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');

const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const speedEl = document.getElementById('speed');
const modeEl = document.getElementById('mode');
const finalStatsEl = document.getElementById('finalStats');

const road = document.getElementById('road');
const playerCar = document.getElementById('playerCar');
const enemiesEl = document.getElementById('enemies');
const collectiblesEl = document.getElementById('collectibles');

const touchpad = document.getElementById('touchpad');
const padLeft = document.getElementById('padLeft');
const padRight = document.getElementById('padRight');

const bgm = document.getElementById('bgm');
const hitSound = document.getElementById('hitSound');
const coinSound = document.getElementById('coinSound');

// ------------------------------
// Game state
// ------------------------------
let running = false;
let score = 0;
let highScore = parseInt(localStorage.getItem('turbo-highscore') || '0', 10);
let speedMultiplier = 1;  // shows difficulty progression
let spawnTimer = 0;
let coinTimer = 0;
let lastTs = 0;

// Player state
const player = {
  laneIndex: 1,     // 0,1,2 for three lanes; derived to pixel position
  x: 0, y: 0,       // pixel positions (computed once)
  width: 80, height: 130,
  moving: false
};

// Lanes in pixels (computed from container width)
let lanes = []; // [x1, x2, x3], left positions for car centers

// Enemies and coins arrays
const enemies = []; // {el, x, y, speed}
const coins = [];   // {el, x, y, speed}

// Difficulty curve settings
const DIFF = {
  baseEnemySpeed: 220,   // px/s
  baseSpawnInterval: 900, // ms
  minSpawnInterval: 350,
  spawnRamp: 0.985,      // multiplier per second
  enemySpeedRamp: 1.005, // multiplier per second
  coinInterval: 1800,    // ms
  coinSpeed: 240
};

// ------------------------------
// Utility helpers
// ------------------------------
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

// Compute lane positions based on road width
function computeLanes() {
  const w = road.clientWidth;
  // Three lanes: centers at 1/6, 3/6, 5/6 of inner width
  lanes = [
    Math.floor(w * (1 / 6)),
    Math.floor(w * (3 / 6)),
    Math.floor(w * (5 / 6))
  ];
  // Update player pixel position
  player.x = lanes[player.laneIndex] - player.width / 2;
  player.y = road.clientHeight - player.height - 24;
  playerCar.style.left = `${player.x}px`;
  playerCar.style.bottom = `24px`;
}

// Position an element at x,y within road (y from top)
function setPos(el, x, y) {
  el.style.transform = `translate(${x}px, ${y}px)`;
}

// Axis-aligned bounding box collision
function collide(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

// ------------------------------
// Lifecycle
// ------------------------------
function startGame() {
  // Reset state
  running = true;
  score = 0;
  speedMultiplier = 1;
  spawnTimer = 0;
  coinTimer = 0;
  enemies.length = 0;
  coins.length = 0;
  enemiesEl.innerHTML = '';
  collectiblesEl.innerHTML = '';

  // Sync HUD
  scoreEl.textContent = score;
  highScoreEl.textContent = highScore;
  speedEl.textContent = `${speedMultiplier.toFixed(1)}x`;

  // Place player
  player.laneIndex = 1;
  player.width = playerCar.offsetWidth;
  player.height = playerCar.offsetHeight;
  computeLanes();
  playerCar.classList.add('move');

  // Hide overlays
  startScreen.classList.remove('show');
  gameOverScreen.classList.remove('show');

  // Music
  try { bgm.volume = 0.35; bgm.currentTime = 0; bgm.play(); } catch {}

  // Kick off loop
  lastTs = performance.now();
  requestAnimationFrame(loop);
}

function endGame() {
  running = false;
  try { bgm.pause(); } catch {}
  // Update high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('turbo-highscore', String(highScore));
  }
  finalStatsEl.textContent = `Score: ${score} | High Score: ${highScore} | Speed: ${speedMultiplier.toFixed(1)}x`;
  gameOverScreen.classList.add('show');
}

function backToMenu() {
  gameOverScreen.classList.remove('show');
  startScreen.classList.add('show');
}

// ------------------------------
// Spawning
// ------------------------------
function spawnEnemy() {
  // Create enemy element
  const el = document.createElement('div');
  el.className = `car enemy ${['red','violet','amber'][randInt(0,2)]}`;
  enemiesEl.appendChild(el);

  // Random lane
  const lane = randInt(0, 2);
  const x = lanes[lane] - player.width / 2;
  const y = -140; // above the top
  const speed = DIFF.baseEnemySpeed * speedMultiplier;

  setPos(el, x, y);
  enemies.push({ el, x, y, speed, w: el.offsetWidth, h: el.offsetHeight });
}

function spawnCoin() {
  const el = document.createElement('div');
  el.className = 'coin';
  collectiblesEl.appendChild(el);

  const lane = randInt(0, 2);
  const x = lanes[lane] - 13; // center coin in lane
  const y = -40;
  const speed = DIFF.coinSpeed * speedMultiplier;

  setPos(el, x, y);
  coins.push({ el, x, y, speed, w: el.offsetWidth, h: el.offsetHeight, value: 10 });
}

// ------------------------------
// Loop
// ------------------------------
function loop(ts) {
  if (!running) return;
  const dt = Math.min(0.033, (ts - lastTs) / 1000) || 0.016; // clamp dt
  lastTs = ts;

  // Increment score over time
  score += Math.floor(dt * 100);
  scoreEl.textContent = score;

  // Ramp difficulty gradually
  speedMultiplier *= Math.pow(DIFF.enemySpeedRamp, dt * 60);
  speedEl.textContent = `${speedMultiplier.toFixed(1)}x`;

  // Spawn enemies
  spawnTimer += dt * 1000;
  const interval = clamp(DIFF.baseSpawnInterval * Math.pow(DIFF.spawnRamp, score / 100), DIFF.minSpawnInterval, 2000);
  if (spawnTimer >= interval) {
    spawnEnemy();
    spawnTimer = 0;
  }

  // Spawn coins (optional)
  coinTimer += dt * 1000;
  if (coinTimer >= DIFF.coinInterval) {
    spawnCoin();
    coinTimer = 0;
  }

  // Move enemies downward
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.y += e.speed * dt;
    setPos(e.el, e.x, e.y);

    // Collision with player
    if (collide(player.x, player.y, player.width, player.height, e.x, e.y, e.w, e.h)) {
      try { hitSound.currentTime = 0; hitSound.play(); } catch {}
      endGame();
      return;
    }

    // Remove if off screen
    if (e.y > road.clientHeight + 160) {
      e.el.remove();
      enemies.splice(i, 1);
    }
  }

  // Move coins downward and collect
  for (let i = coins.length - 1; i >= 0; i--) {
    const c = coins[i];
    c.y += c.speed * dt;
    setPos(c.el, c.x, c.y);

    if (collide(player.x, player.y, player.width, player.height, c.x, c.y, c.w, c.h)) {
      score += c.value;
      scoreEl.textContent = score;
      try { coinSound.currentTime = 0; coinSound.play(); } catch {}
      c.el.remove();
      coins.splice(i, 1);
    }

    if (c.y > road.clientHeight + 80) {
      c.el.remove();
      coins.splice(i, 1);
    }
  }

  // Next frame
  requestAnimationFrame(loop);
}

// ------------------------------
// Input
// ------------------------------
const keys = new Set();

function moveLeft() {
  if (!running) return;
  player.laneIndex = clamp(player.laneIndex - 1, 0, 2);
  player.x = lanes[player.laneIndex] - player.width / 2;
  playerCar.style.left = `${player.x}px`;
}

function moveRight() {
  if (!running) return;
  player.laneIndex = clamp(player.laneIndex + 1, 0, 2);
  player.x = lanes[player.laneIndex] - player.width / 2;
  playerCar.style.left = `${player.x}px`;
}

// Keyboard controls (left/right arrows or A/D)
window.addEventListener('keydown', (e) => {
  if (['ArrowLeft','ArrowRight','a','d','A','D'].includes(e.key)) e.preventDefault();
  keys.add(e.key.toLowerCase());
  if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') moveLeft();
  if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') moveRight();
});
window.addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));

// Touch buttons for mobile
padLeft.addEventListener('touchstart', (e) => { e.preventDefault(); moveLeft(); }, { passive: false });
padRight.addEventListener('touchstart', (e) => { e.preventDefault(); moveRight(); }, { passive: false });

// Swipe/drag steer (optional finer control)
let dragging = false, dragStartX = 0, lastDragX = 0;
road.addEventListener('pointerdown', (e) => {
  dragging = true;
  dragStartX = e.clientX;
  lastDragX = e.clientX;
});
window.addEventListener('pointermove', (e) => {
  if (!dragging || !running) return;
  const delta = e.clientX - lastDragX;
  // Accumulate movement to lane changes
  if (Math.abs(e.clientX - dragStartX) > 30) {
    if (delta < 0) moveLeft();
    else if (delta > 0) moveRight();
    dragStartX = e.clientX; // reset threshold
  }
  lastDragX = e.clientX;
});
window.addEventListener('pointerup', () => { dragging = false; });

// ------------------------------
// UI events
// ------------------------------
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
menuBtn.addEventListener('click', backToMenu);

// Day/Night toggle
toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('night');
  modeEl.textContent = document.body.classList.contains('night') ? 'Night' : 'Day';
});

// ------------------------------
// Setup & responsiveness
// ------------------------------

// Show start screen initially
startScreen.classList.add('show');

// Update high score on load
highScoreEl.textContent = highScore;

// Compute lanes on load and on resize
function onResize() {
  // Recompute lane centers and player position
  computeLanes();

  // Re-align enemies and coins to nearest lane center for consistency
  enemies.forEach(e => {
    const laneIndex = lanes.reduce((best, cx, idx) => {
      const center = cx - player.width / 2;
      const diff = Math.abs(center - e.x);
      return diff < Math.abs(lanes[best] - player.width / 2 - e.x) ? idx : best;
    }, 0);
    e.x = lanes[laneIndex] - player.width / 2;
    setPos(e.el, e.x, e.y);
  });
  coins.forEach(c => {
    const laneIndex = lanes.reduce((best, cx, idx) => {
      const center = cx - 13;
      const diff = Math.abs(center - c.x);
      return diff < Math.abs(lanes[best] - 13 - c.x) ? idx : best;
    }, 0);
    c.x = lanes[laneIndex] - 13;
    setPos(c.el, c.x, c.y);
  });
}
window.addEventListener('load', onResize);
window.addEventListener('resize', onResize);

// Prevent arrow key scrolling while game running
window.addEventListener('keydown', (e) => {
  if (!running) return;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
});
