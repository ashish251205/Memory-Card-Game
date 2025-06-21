const emojis = ['🐶','🐱','🐵','🦊','🐸','🐼','🐯','🦁'];
let cards = [...emojis, ...emojis];

let flipped = [];
let matched = 0;
let moves = 0;
let time = 0;
let timerInterval;

const grid = document.getElementById('card-grid');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');
const restartBtn = document.getElementById('restart');
const winModal = document.getElementById('win-modal');
const finalTime = document.getElementById('final-time');
const finalMoves = document.getElementById('final-moves');
const playAgainBtn = document.getElementById('play-again');

const flipSound = document.getElementById('flip-sound');
const matchSound = document.getElementById('match-sound');
const winSound = document.getElementById('win-sound');

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCard(emoji) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.emoji = emoji;

  card.innerHTML = `
    <div class="front">❓</div>
    <div class="back">${emoji}</div>
  `;

  card.addEventListener('click', () => flipCard(card));
  return card;
}

function flipCard(card) {
  if (card.classList.contains('flipped') || flipped.length === 2) return;

  card.classList.add('flipped');
  flipSound.play();
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    movesEl.textContent = moves;
    const [a, b] = flipped;

    if (a.dataset.emoji === b.dataset.emoji) {
      a.classList.add('matched');
      b.classList.add('matched');
      matchSound.play();
      matched += 2;
      flipped = [];

      if (matched === emojis.length * 2) {
        clearInterval(timerInterval);
        setTimeout(() => {
          winSound.play();
          finalTime.textContent = timerEl.textContent;
          finalMoves.textContent = moves;
          winModal.classList.remove('hidden');
          launchConfetti();
        }, 500);
      }
    } else {
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        flipped = [];
      }, 800);
    }
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    time++;
    const min = String(Math.floor(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');
    timerEl.textContent = `${min}:${sec}`;
  }, 1000);
}

function startGame() {
  grid.innerHTML = '';
  time = 0;
  timerEl.textContent = "00:00";
  moves = 0;
  movesEl.textContent = "0";
  matched = 0;
  flipped = [];
  clearInterval(timerInterval);
  startTimer();

  cards = shuffle([...emojis, ...emojis]);
  cards.forEach(emoji => {
    grid.appendChild(createCard(emoji));
  });
}

function launchConfetti() {
  const confettiScript = document.createElement('script');
  confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
  confettiScript.onload = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };
  document.body.appendChild(confettiScript);
}

restartBtn.addEventListener('click', () => {
  winModal.classList.add('hidden');
  startGame();
});

playAgainBtn.addEventListener('click', () => {
  winModal.classList.add('hidden');
  startGame();
});

startGame();
