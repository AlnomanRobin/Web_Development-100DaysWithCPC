/**
 * Modern Analog Clock
 * - Generates 60 ticks (minute + emphasized hour ticks)
 * - Places 12 hour numbers
 * - Smoothly animates hands using requestAnimationFrame
 * - Responsive sizing via CSS clamp and vmin units
 */

const marksEl = document.getElementById('marks');
const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const secondHand = document.getElementById('secondHand');

// Build ticks and hour numerals
function buildFace() {
  // Minute & hour ticks
  for (let i = 0; i < 60; i++) {
    const tick = document.createElement('div');
    const isHour = i % 5 === 0;
    tick.className = tick ${isHour ? 'hour' : 'minute'};
    // Rotate tick around center
    tick.style.transform = translate(-50%, -50%) rotate(${i * 6}deg);
    marksEl.appendChild(tick);
  }

  // Hour numbers positioned around the circle
  for (let h = 1; h <= 12; h++) {
    const num = document.createElement('div');
    num.className = 'number';
    num.textContent = h;

    // Angle in radians; 12 at top (270deg), then clockwise
    const angleDeg = h * 30 - 90; // shift so 12 is at top
    const angle = angleDeg * Math.PI / 180;

    // Position numbers at ~72% radius from center
    const radius = 0.72;
    const x = 50 + Math.cos(angle) * (radius * 50);
    const y = 50 + Math.sin(angle) * (radius * 50);

    num.style.left = ${x}%;
    num.style.top = ${y}%;
    // Keep numerals upright
    num.style.transform = translate(-50%, -50%);

    marksEl.appendChild(num);
  }
}

buildFace();

// Smooth animation loop using current precise time
function update() {
  const now = new Date();

  // Extract precise time components
  const ms = now.getMilliseconds();
  const s = now.getSeconds() + ms / 1000;
  const m = now.getMinutes() + s / 60;
  const h = (now.getHours() % 12) + m / 60;

  // Compute angles (degrees)
  const secondAngle = s * 6;          // 360 / 60
  const minuteAngle = m * 6;          // 360 / 60
  const hourAngle   = h * 30;         // 360 / 12

  // Apply rotation transforms
  hourHand.style.transform   = translate(-50%, -50%) rotate(${hourAngle}deg);
  minuteHand.style.transform = translate(-50%, -50%) rotate(${minuteAngle}deg);
  secondHand.style.transform = translate(-50%, -50%) rotate(${secondAngle}deg);

  requestAnimationFrame(update);
}

// Start the animation
requestAnimationFrame(update);

// Respect prefers-reduced-motion
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mediaQuery.matches) {
  // Fall back to discrete second updates for accessibility
  let intervalId = null;
  const step = () => {
    const now = new Date();
    const s = now.getSeconds();
    const m = now.getMinutes();
    const h = now.getHours() % 12;

    hourHand.style.transform   = translate(-50%, -50%) rotate(${(h + m / 60) * 30}deg);
    minuteHand.style.transform = translate(-50%, -50%) rotate(${(m + s / 60) * 6}deg);
    secondHand.style.transform = translate(-50%, -50%) rotate(${s * 6}deg);
  };
  step();
  intervalId = setInterval(step, 1000);

  // Listen for changes to user preference
  mediaQuery.addEventListener('change', (e) => {
    if (!e.matches) {
      clearInterval(intervalId);
      requestAnimationFrame(update);
    }
  });
}