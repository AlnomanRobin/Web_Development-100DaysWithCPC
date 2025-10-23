let [seconds, minutes, hours] = [0, 0, 0];
let display = document.getElementById("display");
let timer = null;
let isRunning = false;

// 🟢 Start Stopwatch
document.getElementById("startBtn").addEventListener("click", () => {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(updateTime, 1000);
  }
});

// 🔴 Stop Stopwatch
document.getElementById("stopBtn").addEventListener("click", () => {
  isRunning = false;
  clearInterval(timer);
});

// 🔁 Reset Stopwatch
document.getElementById("resetBtn").addEventListener("click", () => {
  isRunning = false;
  clearInterval(timer);
  [seconds, minutes, hours] = [0, 0, 0];
  display.textContent = "00:00:00";
});

// ⏱️ Update Function
function updateTime() {
  seconds++;

  if (seconds === 60) {
    seconds = 0;
    minutes++;
  }
  if (minutes === 60) {
    minutes = 0;
    hours++;
  }

  let h = hours < 10 ? "0" + hours : hours;
  let m = minutes < 10 ? "0" + minutes : minutes;
  let s = seconds < 10 ? "0" + seconds : seconds;

  display.textContent = `${h}:${m}:${s}`;
}
