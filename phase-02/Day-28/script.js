const startBtn = document.getElementById("start-btn");
const ball = document.getElementById("ball");
const scoreDisplay = document.getElementById("score");
const leaderboardList = document.getElementById("leaderboard-list");

// 🎵 Load click sound
const clickSound = new Audio("click.mp3");
clickSound.volume = 0.7;

let score = 0;
let gameInterval;
let ballTimeout;

// 🎨 Random color generator
function getRandomColor() {
  const colors = [
    "#ff4d6d", "#ffb703", "#06d6a0", "#118ab2", "#9d4edd",
    "#ff006e", "#8338ec", "#3a86ff", "#fb5607", "#06d6a0",
    "#ef476f", "#ff8fab", "#f72585", "#7209b7", "#4cc9f0"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

startBtn.addEventListener("click", startGame);

function startGame() {
  score = 0;
  scoreDisplay.textContent = score;
  startBtn.style.display = "none";
  ball.style.display = "block";
  moveBall();

  gameInterval = setInterval(moveBall, 1000);
}

function moveBall() {
  const container = document.querySelector(".game-container");
  const maxX = container.clientWidth - 60;
  const maxY = container.clientHeight - 120;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY + 50;

  // Random color each move
  ball.style.background = getRandomColor();
  ball.style.boxShadow = `0 0 25px ${ball.style.background}`;

  ball.style.left = `${x}px`;
  ball.style.top = `${y}px`;

  clearTimeout(ballTimeout);
  ballTimeout = setTimeout(() => {
    gameOver();
  }, 1500);
}

// 🔊 Ball click event
ball.addEventListener("click", () => {
  score++;
  scoreDisplay.textContent = score;

  clickSound.currentTime = 0;
  clickSound.play();

  clearTimeout(ballTimeout);
  moveBall();
});

function gameOver() {
  clearInterval(gameInterval);
  ball.style.display = "none";
  startBtn.style.display = "block";
  startBtn.textContent = "Play Again 🎮";
  alert(`Game Over! Your Score: ${score}`);

  saveScore(score);
  showLeaderboard();
}

// 🏆 Save score to localStorage (Top 25)
function saveScore(newScore) {
  let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  scores.push(newScore);
  scores.sort((a, b) => b - a);
  scores = scores.slice(0, 25);
  localStorage.setItem("leaderboard", JSON.stringify(scores));
}

// 🏁 Show leaderboard
function showLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboardList.innerHTML = "";
  scores.forEach((s, i) => {
    const li = document.createElement("li");
    li.textContent = `#${i + 1} — ${s} pts`;
    leaderboardList.appendChild(li);
  });
}

// 🟢 Load leaderboard on start
showLeaderboard();
