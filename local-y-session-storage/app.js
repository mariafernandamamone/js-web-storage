// === Memory Card Game ===

// A 6x5 grid color-matching memory game with drag-and-drop interaction, mismatch reset, and completion timer.

// DOM Elements
const pairsCounter = document.getElementById('pairsCounter');
const timerDisplay = document.getElementById('timerDisplay');
const memoryGrid = document.getElementById('memoryGrid');
const winMessage = document.getElementById('winMessage');
const resetBtn = document.getElementById('resetBtn');

// Game state variables
let matchedPairs = 0;
let seconds = 0;
let timerInterval = null;
let draggedCard = null;

// 15 distinct colors duplicated to create 15 pairs (30 cards total)
const baseColors = [
  '#e74c3c', // Red
  '#3498db', // Blue
  '#2ecc71', // Green
  '#f1c40f', // Yellow
  '#9b59b6', // Purple
  '#e67e22', // Orange
  '#1abc9c', // Turquoise
  '#e84393', // Pink
  '#00cec9', // Cyan
  '#6c5ce7', // Indigo
  '#fdcb6e', // Warm Gold
  '#d63031', // Crimson
  '#0984e3', // Royal Blue
  '#00b894', // Mint
  '#a29bfe'  // Lavender
];

const cardsArray = [...baseColors, ...baseColors];

// === Game Functions ===

// Saves the current board state, matched pairs, and elapsed time to localStorage
function saveGame() {
  const cards = document.querySelectorAll('.memory-card');
  const arrayCards = Array.from(cards);
  const cardsData = arrayCards.map(card => {
    const color = card.dataset.color;
    const matched = card.classList.contains('matched');
    return {
      color: color,
      matched: matched
    };
  });
  const gameState = {
    seconds: seconds,
    matchedPairs: matchedPairs,
    cards: cardsData
  }
  localStorage.setItem('memoryGameState', JSON.stringify(gameState));
}

// Starts the completion timer on the first card interaction
function startTimer() {
  if (timerInterval === null) {
    timerInterval = setInterval(() => {
      seconds++;
      timerDisplay.textContent = `Time: ${seconds}s`;
      saveGame();
    }, 1000);
  }
}

// Creates a single memory card element, restores its matched state if needed, and binds drag-and-drop events
function createCard(color, isMatched = false) {
  const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.color = color;
    card.draggable = true;

    if (isMatched) {
      card.classList.add('matched');
      card.draggable = false;
      card.style.backgroundColor = color;
    }

    // Reveal color and store reference when dragging starts
    card.addEventListener('dragstart', function() {
      if (card.classList.contains('matched')) return;
      startTimer();
      draggedCard = card;
      card.style.backgroundColor = card.dataset.color;
    });

    // Allow dropping another card onto this target
    card.addEventListener('dragover', function(event) {
      event.preventDefault();
    });

    // Evaluate match or mismatch when dropped
    card.addEventListener('drop', function(event) {
      event.preventDefault();

      // Ignore drops onto itself or already matched cards
      if (!draggedCard || draggedCard === card || card.classList.contains('matched'))  
      return;

      // Reveal target card color
      card.style.backgroundColor = card.dataset.color;

      if (draggedCard.dataset.color === card.dataset.color) {
        // Match found: lock both cards
        draggedCard.classList.add('matched');
        card.classList.add('matched');
        draggedCard.draggable = false;
        card.draggable = false;
        draggedCard = null;

        // Update pair counter and check for game completion
        matchedPairs++;
        pairsCounter.textContent = `Pairs: ${matchedPairs} / 15`;
        saveGame();

        if (matchedPairs === 15) {
          clearInterval(timerInterval);
          winMessage.textContent = `Congratulations! You matched all pairs in ${seconds} seconds!`;
        }
      } else {
        // Mismatch: hide both cards again after a brief delay
        const firstCard = draggedCard;
        const secondCard = card;
        draggedCard = null;

        setTimeout(() => {
          firstCard.style.backgroundColor = '';
          secondCard.style.backgroundColor = '';
        }, 700);
      }
    });

    // Reset card appearance if dragged and dropped outside a valid target
    card.addEventListener('dragend', function() {
      if (!card.classList.contains('matched') && draggedCard === card) {
        card.style.backgroundColor = '';
        draggedCard = null;
      }
    });

    memoryGrid.appendChild(card);
}

// Shuffles the deck and populates the 6x5 grid
function initGame() {
  memoryGrid.innerHTML = '';

  // Shuffle cards randomly
  cardsArray.sort(() => Math.random() - 0.5);

  // Generate and append each card to the grid
  cardsArray.forEach(color => {
    createCard(color);
  });

  saveGame();
}

// Restores saved game progress from localStorage or starts a new game if none exists
function loadGame() {
  const savedData = localStorage.getItem('memoryGameState');
  if (!savedData) {
    initGame();
    return;
  }

  const gameState = JSON.parse(savedData);
  seconds = gameState.seconds;
  matchedPairs = gameState.matchedPairs;
  timerDisplay.textContent = `Time: ${seconds}s`;
  pairsCounter.textContent = `Pairs: ${matchedPairs} / 15`;

  if (matchedPairs === 15) {
    clearInterval(timerInterval);
    winMessage.textContent = `Congratulations! You matched all pairs in ${seconds} seconds!`;
  }

  memoryGrid.innerHTML = '';
  gameState.cards.forEach(cardData => {
    createCard(cardData.color, cardData.matched);
  });
}

// Resets timer, counters, and board state for a new round
function resetGame() {
  clearInterval(timerInterval);
  timerInterval = null;
  seconds = 0;
  matchedPairs = 0;
  draggedCard = null;

  timerDisplay.textContent = 'Time: 0s';
  pairsCounter.textContent = 'Pairs: 0 / 15';
  winMessage.textContent = '';

  localStorage.removeItem('memoryGameState');
  initGame();
}

// === Event Listeners & Initialization ===
resetBtn.addEventListener('click', resetGame);
loadGame();