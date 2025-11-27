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
// ...existing code...