const startBtn = document.getElementById("start-btn");
const ball = document.getElementById("ball");
const scoreDisplay = document.getElementById("score");

let score = 0;
let gameInterval;
let ballTimeout;

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
  const maxY = container.clientHeight - 60;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  ball.style.left = `${x}px`;
  ball.style.top = `${y}px`;

  // Remove ball if not clicked in time
  clearTimeout(ballTimeout);
  ballTimeout = setTimeout(() => {
    gameOver();
  }, 1500);
}

ball.addEventListener("click", () => {
  score++;
  scoreDisplay.textContent = score;
  clearTimeout(ballTimeout);
  moveBall();
});

function gameOver() {
  clearInterval(gameInterval);
  ball.style.display = "none";
  startBtn.style.display = "block";
  startBtn.textContent = "Play Again 🎮";
  alert(`Game Over! Your Score: ${score}`);
}
