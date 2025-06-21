// script.js

const gameBoard = document.getElementById("gameBoard");
const symbols = ['🍎', '🍌', '🍇', '🍒', '🍎', '🍌', '🍇', '🍒'];
let flippedCards = [];
let matchedPairs = 0;

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function createBoard() {
  const shuffled = shuffle([...symbols]);
  shuffled.forEach((symbol, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.innerHTML = "";
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
}

function flipCard() {
  if (this.classList.contains("flipped") || flippedCards.length === 2) return;

  this.classList.add("flipped");
  this.innerHTML = this.dataset.symbol;
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    setTimeout(checkMatch, 700);
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.symbol === card2.dataset.symbol) {
    matchedPairs++;
    if (matchedPairs === symbols.length / 2) {
      alert("🎉 You matched all the cards!");
    }
  } else {
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
    card1.innerHTML = "";
    card2.innerHTML = "";
  }
  flippedCards = [];
}

createBoard();
