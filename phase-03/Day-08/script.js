const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const ampmEl = document.getElementById("ampm");
const dateEl = document.getElementById("date");

const settingsToggle = document.getElementById("settingsToggle");
const settingsPanel = document.getElementById("settingsPanel");
const formatToggle = document.getElementById("formatToggle");
const timezoneSelect = document.getElementById("timezoneSelect");
const showSecondsToggle = document.getElementById("showSeconds");
const themeToggle = document.getElementById("themeToggle");
const accentColorInput = document.getElementById("accentColor");

const alarmTimeInput = document.getElementById("alarmTime");
const setAlarmBtn = document.getElementById("setAlarm");
const clearAlarmBtn = document.getElementById("clearAlarm");
const alarmBanner = document.getElementById("alarmBanner");
const dismissAlarmBtn = document.getElementById("dismissAlarm");

let alarmTime = null;
let alarmTimeout = null;

// Toggle settings panel
settingsToggle.addEventListener("click", () => {
  const expanded = settingsToggle.getAttribute("aria-expanded") === "true";
  settingsToggle.setAttribute("aria-expanded", String(!expanded));
  settingsPanel.hidden = expanded;
});

// Update clock
function updateClock() {
  const tz = timezoneSelect.value;
  const now =
    tz === "local"
      ? new Date()
      : new Date(new Date().toLocaleString("en-US", { timeZone: tz }));

  let h = now.getHours();
  let m = now.getMinutes();
  let s = now.getSeconds();

  const is24 = formatToggle.checked;
  let ampm = "";

  if (!is24) {
    ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
  }

  hoursEl.textContent = String(h).padStart(2, "0");
  minutesEl.textContent = String(m).padStart(2, "0");
  secondsEl.textContent = String(s).padStart(2, "0");
  ampmEl.textContent = is24 ? "" : ampm;

  // Date
  const options = { weekday: "short", day: "2-digit", month: "short", year: "numeric" };
  dateEl.textContent = now.toLocaleDateString(undefined, options);

  // Hide/show seconds
  document.getElementById("seconds").style.display = showSecondsToggle.checked ? "inline" : "none";
  document.getElementById("secondsSep").style.display = showSecondsToggle.checked ? "inline" : "none";

  // Alarm check
  if (alarmTime) {
    const current = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    if (current === alarmTime && !alarmTimeout) {
      alarmBanner.hidden = false;
      alarmTimeout = setTimeout(() => {
        alarmBanner.hidden = true;
        alarmTimeout = null;
      }, 60000); // auto-dismiss after 1 min
    }
  }
}

// Theme toggle
themeToggle.addEventListener("change", () => {
  document.querySelector(".app").setAttribute("data-theme", themeToggle.checked ? "dark" : "light");
});

// Accent color
accentColorInput.addEventListener("input", () => {
  document.documentElement.style.setProperty("--accent", accentColorInput.value);
});

// Alarm
setAlarmBtn.addEventListener("click", () => {
  if (alarmTimeInput.value) {
    alarmTime = alarmTimeInput.value;
    alert(`Alarm set for ${alarmTime}`);
  }
});

clearAlarmBtn.addEventListener("click", () => {
  alarmTime = null;
  alarmBanner.hidden = true;
  if (alarmTimeout) {
    clearTimeout(alarmTimeout);
    alarmTimeout = null;
  }
  alert("Alarm cleared");
});

dismissAlarmBtn.addEventListener("click", () => {
  alarmBanner.hidden = true;
  if (alarmTimeout) {
    clearTimeout(alarmTimeout);
    alarmTimeout = null;
  }
});

// Run clock every second
setInterval(updateClock, 1000);
updateClock();


// ...existing code...
const accentInput = document.getElementById('accentColor');
if (accentInput) {
  const setAccent = (hex) => {
    // set base color
    document.documentElement.style.setProperty('--accent-color', hex);
    // create a simple gradient using 8-digit hex for a softer stop (browser support modern)
    const faded = hex.length === 7 ? hex + '80' : hex;
    document.documentElement.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${hex} 0%, ${faded} 100%)`);
    // soft shadow tint
    const ghost = hex.length === 7 ? hex + '1f' : hex + '1f';
    document.documentElement.style.setProperty('--accent-ghost', `rgba(58,160,255,0.12)`); // fallback tint
  };

  accentInput.addEventListener('input', (e) => setAccent(e.target.value));
  // initialize from current input value
  setAccent(accentInput.value);
}

/* --- Size controls: scale the clock --- */
const clockEl = document.querySelector('.clock');
const sizeRange = document.getElementById('sizeRange');
const decSize = document.getElementById('decSize');
const incSize = document.getElementById('incSize');
const sizeValue = document.getElementById('sizeValue');

function applySize(scale){
  if (!clockEl) return;
  clockEl.style.transform = `scale(${scale})`;
  sizeValue.textContent = `${Math.round(scale * 100)}%`;
  localStorage.setItem('clockScale', scale.toString());
}

if (sizeRange){
  // init from saved or input value
  const saved = parseFloat(localStorage.getItem('clockScale') || sizeRange.value);
  sizeRange.value = saved;
  applySize(parseFloat(saved));

  sizeRange.addEventListener('input', (e) => {
    applySize(parseFloat(e.target.value));
  });
  decSize.addEventListener('click', () => {
    let v = Math.max(parseFloat(sizeRange.min), parseFloat(sizeRange.value) - parseFloat(sizeRange.step));
    sizeRange.value = v;
    applySize(v);
  });
  incSize.addEventListener('click', () => {
    let v = Math.min(parseFloat(sizeRange.max), parseFloat(sizeRange.value) + parseFloat(sizeRange.step));
    sizeRange.value = v;
    applySize(v);
  });
}

/* --- Stopwatch implementation --- */
const swDisplay = document.getElementById('swDisplay');
const swStart = document.getElementById('swStart');
const swStop = document.getElementById('swStop');
const swReset = document.getElementById('swReset');
const swLap = document.getElementById('swLap');
const swLaps = document.getElementById('swLaps');

let swInterval = null;
let swStartTime = 0;
let swElapsed = 0; // ms

function formatStopwatch(ms){
  const totalHund = Math.floor(ms / 10);
  const hund = totalHund % 100;
  const totalSec = Math.floor(totalHund / 100);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec / 60);
  return `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}.${String(hund).padStart(2,'0')}`;
}

function updateSW(){
  swElapsed = Date.now() - swStartTime;
  swDisplay.textContent = formatStopwatch(swElapsed);
}

if (swStart){
  swStart.addEventListener('click', () => {
    if (!swInterval){
      swStartTime = Date.now() - swElapsed;
      swInterval = setInterval(updateSW, 30);
      swStart.disabled = true;
      swStop.disabled = false;
      swReset.disabled = false;
    }
  });
}
if (swStop){
  swStop.addEventListener('click', () => {
    if (swInterval){
      clearInterval(swInterval);
      swInterval = null;
      // keep swElapsed as-is
      swStart.disabled = false;
      swStop.disabled = true;
    }
  });
}
if (swReset){
  swReset.addEventListener('click', () => {
    clearInterval(swInterval);
    swInterval = null;
    swElapsed = 0;
    swDisplay.textContent = '00:00.00';
    swLaps.innerHTML = '';
    swStart.disabled = false;
    swStop.disabled = true;
    swReset.disabled = true;
  });
}
if (swLap){
  swLap.addEventListener('click', () => {
    const li = document.createElement('li');
    li.textContent = formatStopwatch(swElapsed);
    swLaps.insertBefore(li, swLaps.firstChild);
  });
}