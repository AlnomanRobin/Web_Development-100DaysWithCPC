const board = document.querySelector('.game-board');
const restartBtn = document.getElementById('restart');
const timerEl = document.getElementById('timer');
const movesEl = document.getElementById('moves');
const flipSound = document.getElementById('flipSound');
const matchSound = document.getElementById('matchSound');
const winSound = document.getElementById('winSound');

const emojis = ['🐱', '🐶', '🐸', '🐼', '🦊', '🐵', '🐧', '🐨'];
let cards = [...emojis, ...emojis];
let flippedCards = [];
let matched = 0;
let moves = 0;
let timer = 0;
let interval;

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function startTimer() {
  clearInterval(interval);
  timer = 0;
  timerEl.textContent = timer;
  interval = setInterval(() => {
    timer++;
    timerEl.textContent = timer;
  }, 1000);
}

function createBoard() {
  board.innerHTML = '';
  shuffle(cards);
  matched = 0;
  moves = 0;
  movesEl.textContent = moves;
  flippedCards = [];
  startTimer();

  cards.forEach((emoji) => {
    const card = document.createElement('div');
    card.classList.add('card');
    const inner = document.createElement('div');
    inner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('card-front');
    front.textContent = emoji;

    const back = document.createElement('div');
    back.classList.add('card-back');
    back.textContent = '❓';

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', () => flipCard(card, emoji));
    board.appendChild(card);
  });
}

function flipCard(card, emoji) {
  if (flippedCards.length === 2 || card.classList.contains('flip') || card.classList.contains('matched')) return;
  flipSound.play();
  card.classList.add('flip');
  flippedCards.push({ card, emoji });

  if (flippedCards.length === 2) {
    moves++;
    movesEl.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = flippedCards;

  if (first.emoji === second.emoji) {
    matchSound.play();
    first.card.classList.add('matched');
    second.card.classList.add('matched');
    matched += 2;
    flippedCards = [];

    if (matched === cards.length) {
      clearInterval(interval);
      setTimeout(() => {
        winSound.play();
        alert(`🎉 You won in ${moves} moves and ${timer} seconds!`);
      }, 600);
    }
  } else {
    setTimeout(() => {
      first.card.classList.remove('flip');
      second.card.classList.remove('flip');
      flippedCards = [];
    }, 1000);
  }
}

restartBtn.addEventListener('click', createBoard);

createBoard();
