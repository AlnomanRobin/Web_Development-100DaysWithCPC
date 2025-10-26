function updateClock() {
  const now = new Date();

  // Get hours, minutes, seconds
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let ampm = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour to 12-hour format
  hours = hours % 12 || 12;

  // Add leading zeros
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  // Display formatted time
  const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
  document.getElementById("time").textContent = timeString;

  // Display date
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  document.getElementById("date").textContent = now.toLocaleDateString("en-US", options);
}

// Update every second
setInterval(updateClock, 1000);

// Initial call
updateClock();
