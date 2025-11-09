/* ============================================================
   Echo Runner - Original Web Game (Pure JS)
   ------------------------------------------------------------
   Concept:
   - You move through dense fog with a shrinking vision radius.
   - Random Echo Orbs spawn; collecting one extends vision and boosts score.
   - Timer drains constantly; missing orbs accelerates the drain.
   - Levels increase: orbs move faster, spawn farther, and the fog tightens.
   - Survive as long as possible by chaining orb pickups.

   Features:
   - Keyboard + mobile joystick input
   - Timer & score HUD
   - Start & Game Over overlays
   - Responsive canvas rendering
   - Optional sounds via small embedded audio
   - All code commented for learning

   Controls:
   - Arrow keys / WASD
   - Mobile: drag the joystick to move
   ============================================================ */

// ------------------------------
// DOM references
// ------------------------------
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const backBtn = document.getElementById('backBtn');

const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const levelEl = document.getElementById('level');
const finalStatsEl = document.getElementById('finalStats');

const joystick = document.getElementById('joystick');
const stick = document.getElementById('stick');

const orbSound = document.getElementById('orbSound');
const levelUpSound = document.getElementById('levelUpSound');

// ------------------------------
// Game state
// ------------------------------
let running = false;
let lastTs = 0;

// Player properties
const player = {
  x: 0,
  y: 0,
  r: 14,             // player radius
  speed: 220,        // base speed in px/s
  vx: 0, vy: 0       // velocity from input
};

// Fog/vision properties
const vision = {
  radius: 160,       // current vision radius
  min: 90,           // floor vision radius
  max: 260,          // cap vision radius
  shrinkRate: 12     // per second shrink baseline
};

// Difficulty curve / level state
let score = 0;
let timeLeft = 30.0;       // seconds
let level = 1;
let orbSpeed = 60;         // px/s initial
let spawnInterval = 1.8;   // seconds between spawns
let lastSpawn = 0;

// World + orbs
const world = { w: 1000, h: 620 };
const orbs = []; // {x,y,r,vx,vy,value,ttl}

// Input tracking
const keys = new Set();
let joyActive = false;
let joyCenter = { x: 0, y: 0 };

// ------------------------------
// Utility helpers
// ------------------------------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => Math.random() * (b - a) + a;
const randInt = (a, b) => Math.floor(rand(a, b + 1));
const dist2 = (x1, y1, x2, y2) => {
  const dx = x1 - x2, dy = y1 - y2;
  return dx*dx + dy*dy;
};

// Resize canvas to fit container, maintaining crisp drawing
function resizeCanvas() {
  // Fit to the element size and device pixel ratio
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR for perf
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // World dimensions map to canvas size; keep some margins
  world.w = rect.width - 40;
  world.h = rect.height - 40;

  // Keep player inside world
  player.x = clamp(player.x, 20, world.w - 20);
  player.y = clamp(player.y, 20, world.h - 20);
}

// ------------------------------
// Game lifecycle
// ------------------------------

// Initialize new run
function newGame() {
  running = true;
  score = 0;
  timeLeft = 30.0;
  level = 1;

  // Reset difficulty curve
  vision.radius = 160;
  vision.shrinkRate = 12;
  orbSpeed = 60;
  spawnInterval = 1.8;
  lastSpawn = 0;

  // Player starts centered
  player.x = world.w / 2;
  player.y = world.h / 2;
  player.vx = 0; player.vy = 0;

  // Clear orbs
  orbs.length = 0;

  // Hide overlays
  startScreen.classList.remove('show');
  gameOverScreen.classList.remove('show');

  // Prime timestamps and HUD
  lastTs = performance.now();
  updateHUD();

  // Kick off loop
  requestAnimationFrame(loop);
}

// End run and show stats
function gameOver() {
  running = false;
  finalStatsEl.textContent = `Score: ${score} | Level: ${level}`;
  gameOverScreen.classList.add('show');
}

// Update HUD text
function updateHUD() {
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft.toFixed(1);
  levelEl.textContent = level;
}

// ------------------------------
// Input handling
// ------------------------------

// Keyboard
window.addEventListener('keydown', (e) => {
  // Prevent arrow key scrolling
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
  keys.add(e.key.toLowerCase());
});
window.addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));

// Mobile joystick
function joyPosToVector(clientX, clientY) {
  const rect = joystick.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = clientX - cx;
  const dy = clientY - cy;
  const max = rect.width / 2 - 8;
  const len = Math.hypot(dx, dy);
  const scale = len > 0 ? Math.min(len / max, 1) : 0;
  return { x: (dx / (len || 1)) * scale, y: (dy / (len || 1)) * scale };
}

joystick.addEventListener('pointerdown', (e) => {
  joyActive = true;
  joystick.setPointerCapture(e.pointerId);
  const v = joyPosToVector(e.clientX, e.clientY);
  stick.style.transform = `translate(${v.x*40}px, ${v.y*40}px)`;
  player.vx = v.x * player.speed;
  player.vy = v.y * player.speed;
});
joystick.addEventListener('pointermove', (e) => {
  if (!joyActive) return;
  const v = joyPosToVector(e.clientX, e.clientY);
  stick.style.transform = `translate(${v.x*40}px, ${v.y*40}px)`;
  player.vx = v.x * player.speed;
  player.vy = v.y * player.speed;
});
joystick.addEventListener('pointerup', (e) => {
  joyActive = false;
  stick.style.transform = `translate(-50%,-50%)`;
  player.vx = 0; player.vy = 0;
});

// Derive velocity from keyboard keys (called each frame)
function updateKeyboardVelocity() {
  let vx = 0, vy = 0;
  if (keys.has('arrowleft') || keys.has('a')) vx -= 1;
  if (keys.has('arrowright') || keys.has('d')) vx += 1;
  if (keys.has('arrowup') || keys.has('w')) vy -= 1;
  if (keys.has('arrowdown') || keys.has('s')) vy += 1;
  // Normalize to avoid faster diagonal movement
  const len = Math.hypot(vx, vy) || 1;
  vx = vx / len * player.speed;
  vy = vy / len * player.speed;
  player.vx = vx;
  player.vy = vy;
}

// ------------------------------
// Orbs and level progression
// ------------------------------

// Spawn a new orb with random properties
function spawnOrb() {
  const r = rand(10, 18);
  // Spawn at a random edge moving inward
  const edge = randInt(0, 3); // 0:top,1:right,2:bottom,3:left
  let x = rand(30, world.w - 30);
  let y = rand(30, world.h - 30);
  if (edge === 0) y = 30;
  else if (edge === 2) y = world.h - 30;
  else if (edge === 1) x = world.w - 30;
  else x = 30;

  // Velocity aims roughly toward player with some randomness
  const angle = Math.atan2(player.y - y, player.x - x) + rand(-0.7, 0.7);
  const speed = orbSpeed + rand(-10, 25);
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  const value = randInt(2, 6); // score value per orb
  const ttl = rand(6, 9);      // seconds orb persists

  orbs.push({ x, y, r, vx, vy, value, ttl });
}

// Adjust difficulty as levels rise
function levelUp() {
  level++;
  // Tighten fog slightly and increase movement challenge
  vision.shrinkRate += 1.8;
  orbSpeed += 18;
  spawnInterval = Math.max(0.9, spawnInterval - 0.12);
  // Reward player with slight vision boost
  vision.radius = Math.min(vision.max, vision.radius + 26);

  // Play level up sound (optional)
  try { levelUpSound.currentTime = 0; levelUpSound.play(); } catch {}
  updateHUD();
}

// ------------------------------
// Main game loop
// ------------------------------
function loop(ts) {
  if (!running) return;
  const dt = Math.min(0.033, (ts - lastTs) / 1000) || 0.016; // seconds
  lastTs = ts;

  // Update input
  if (!joyActive) updateKeyboardVelocity();

  // Move player
  player.x += player.vx * dt;
  player.y += player.vy * dt;
  player.x = clamp(player.x, 20, world.w - 20);
  player.y = clamp(player.y, 20, world.h - 20);

  // Spawn orbs on interval
  lastSpawn += dt;
  if (lastSpawn >= spawnInterval) {
    spawnOrb();
    lastSpawn = 0;
  }

  // Update orbs
  for (let i = orbs.length - 1; i >= 0; i--) {
    const o = orbs[i];
    o.x += o.vx * dt;
    o.y += o.vy * dt;
    o.ttl -= dt;

    // Bounce off bounds gently
    if (o.x < 20 || o.x > world.w - 20) o.vx *= -1;
    if (o.y < 20 || o.y > world.h - 20) o.vy *= -1;

    // Remove expired orbs and penalize missed opportunities
    if (o.ttl <= 0) {
      orbs.splice(i, 1);
      // Penalty: accelerate timer drain briefly
      timeLeft -= 1.5;
      vision.radius = Math.max(vision.min, vision.radius - 12);
    }
  }

  // Collision: collect orb
  for (let i = orbs.length - 1; i >= 0; i--) {
    const o = orbs[i];
    const rSum = o.r + player.r;
    if (dist2(player.x, player.y, o.x, o.y) <= rSum * rSum) {
      // Collect
      score += o.value;
      timeLeft += 1.2; // small time boost
      vision.radius = Math.min(vision.max, vision.radius + 22);

      // Sound feedback (optional)
      try { orbSound.currentTime = 0; orbSound.play(); } catch {}

      orbs.splice(i, 1);

      // Level progression gate: every 20 points
      if (score % 20 === 0) levelUp();
      updateHUD();
    }
  }

  // Drain timer and vision continuously
  timeLeft -= dt * (1 + level * 0.1);
  vision.radius = Math.max(vision.min, vision.radius - vision.shrinkRate * dt);

  // Lose condition
  if (timeLeft <= 0 || vision.radius <= vision.min + 2) {
    gameOver();
    return;
  }

  // Render
  render();

  // Next frame
  requestAnimationFrame(loop);
}

// ------------------------------
// Rendering
// ------------------------------
function render() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Translate to center stage margins
  ctx.save();
  ctx.translate(20, 20);

  // Draw background grid (subtle)
  ctx.strokeStyle = 'rgba(148,163,184,0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= world.w; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, world.h); ctx.stroke();
  }
  for (let y = 0; y <= world.h; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(world.w, y); ctx.stroke();
  }

  // Fog of war: dark overlay with circular hole (vision)
  ctx.fillStyle = 'rgba(2,6,23,0.8)';
  ctx.fillRect(0, 0, world.w, world.h);

  // Composite "destination-out" to carve the vision hole
  ctx.globalCompositeOperation = 'destination-out';
  const grad = ctx.createRadialGradient(player.x, player.y, Math.max(0, vision.radius - 30), player.x, player.y, vision.radius);
  grad.addColorStop(0, 'rgba(255,255,255,0.9)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(player.x, player.y, vision.radius, 0, Math.PI * 2);
  ctx.fill();

  // Switch back to normal drawing
  ctx.globalCompositeOperation = 'source-over';

  // Draw player
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
  const playerGrad = ctx.createRadialGradient(player.x - 4, player.y - 4, 4, player.x, player.y, player.r);
  playerGrad.addColorStop(0, '#60a5fa');
  playerGrad.addColorStop(1, '#2563eb');
  ctx.fillStyle = playerGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.stroke();

  // Draw orbs
  for (const o of orbs) {
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
    const orbGrad = ctx.createRadialGradient(o.x - 3, o.y - 3, 3, o.x, o.y, o.r);
    orbGrad.addColorStop(0, '#34d399');
    orbGrad.addColorStop(1, '#0ea5e9');
    ctx.fillStyle = orbGrad;
    ctx.fill();

    // Soft glow
    ctx.shadowColor = 'rgba(14,165,233,0.55)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.stroke();

    // Reset shadow to avoid affecting next elements
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  // Decorative border
  ctx.strokeStyle = 'rgba(148,163,184,0.15)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, world.w, world.h);

  ctx.restore();
}

// ------------------------------
// UI events
// ------------------------------
startBtn.addEventListener('click', () => {
  newGame();
});

restartBtn.addEventListener('click', () => {
  newGame();
});

backBtn.addEventListener('click', () => {
  // Return to start screen
  gameOverScreen.classList.remove('show');
  startScreen.classList.add('show');
});

// ------------------------------
// Setup & responsiveness
// ------------------------------

// Show start screen initially
startScreen.classList.add('show');

// Resize canvas on load and when window changes
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

// Prevent default scrolling on arrows/space while game running
window.addEventListener('keydown', (e) => {
  if (!running) return;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
});
