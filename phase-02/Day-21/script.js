// 🎯 Set target date (you can change it)
const targetDate = new Date("January 1, 2026 00:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  // Time calculations
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display results
  document.getElementById("days").textContent = days < 10 ? "0" + days : days;
  document.getElementById("hours").textContent = hours < 10 ? "0" + hours : hours;
  document.getElementById("minutes").textContent = minutes < 10 ? "0" + minutes : minutes;
  document.getElementById("seconds").textContent = seconds < 10 ? "0" + seconds : seconds;

  // When the countdown is finished
  if (distance < 0) {
    clearInterval(timer);
    document.querySelector(".countdown").style.display = "none";
    document.getElementById("message").classList.remove("hidden");
  }
}

// Update every second
const timer = setInterval(updateCountdown, 1000);
updateCountdown();
