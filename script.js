const menu = document.querySelector('.menu');
const game = document.querySelector('.game');
const about = document.querySelector('.about');
const board = document.getElementById('board');
const status = document.getElementById('status');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const vsComputerBtn = document.getElementById('vsComputerBtn');
const resetBtn = document.getElementById('resetBtn');
const backBtn = document.getElementById('backBtn');
const aboutBtn = document.getElementById('aboutBtn');
const backFromAboutBtn = document.getElementById('backFromAboutBtn');

let cells = Array(9).fill(null);
let currentPlayer = '👨‍🚀';
let gameActive = true;
let vsAI = false;

function startGame(isVsAI) {
  vsAI = isVsAI;
  menu.style.display = 'none';
  game.style.display = 'block';
  resetGame();
  setBoardGrid();
  createBoard();
}

twoPlayerBtn.addEventListener('click', () => startGame(false));
vsComputerBtn.addEventListener('click', () => startGame(true));
resetBtn.addEventListener('click', resetGame);
backBtn.addEventListener('click', () => {
  game.style.display = 'none';
  menu.style.display = 'block';
});

// ✅ About button fix
aboutBtn.addEventListener('click', () => {
  menu.style.display = 'none';
  about.style.display = 'block';
});

backFromAboutBtn.addEventListener('click', () => {
  about.style.display = 'none';
  menu.style.display = 'block';
});

function setBoardGrid() {
  board.style.display = 'grid';
  board.style.gridTemplateColumns = 'repeat(3, 100px)';
  board.style.gridTemplateRows = 'repeat(3, 100px)';
  board.style.gap = '10px';
  board.style.justifyContent = 'center';
  board.style.alignItems = 'center';
  board.style.margin = '20px auto';
}

function createBoard() {
  board.innerHTML = '';
  cells.forEach((_, index) => {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.dataset.index = index;
    cellElement.style.width = '100px';
    cellElement.style.height = '100px';
    cellElement.style.display = 'flex';
    cellElement.style.justifyContent = 'center';
    cellElement.style.alignItems = 'center';
    cellElement.style.fontSize = '2.5rem';
    cellElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    cellElement.style.border = '2px solid #00f2fe';
    cellElement.style.borderRadius = '10px';
    cellElement.style.cursor = 'pointer';
    cellElement.addEventListener('click', handleCellClick);
    board.appendChild(cellElement);
  });
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (cells[index] || !gameActive) return;

  cells[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWinner()) {
    status.textContent = `${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (cells.every(cell => cell)) {
    status.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === '👨‍🚀' ? '👽' : '👨‍🚀';
  status.textContent = `${currentPlayer}'s turn`;

  if (vsAI && currentPlayer === '👽' && gameActive) {
    makeAIMove();
  }
}

function makeAIMove() {
  const emptyIndices = cells.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

  if (randomIndex !== undefined) {
    cells[randomIndex] = '👽';
    const cellElement = board.querySelector(`.cell[data-index='${randomIndex}']`);
    cellElement.textContent = '👽';

    if (checkWinner()) {
      status.textContent = '👽 wins!';
      gameActive = false;
      return;
    }

    if (cells.every(cell => cell)) {
      status.textContent = "It's a draw!";
      gameActive = false;
      return;
    }

    currentPlayer = '👨‍🚀';
    status.textContent = `${currentPlayer}'s turn`;
  }
}

function checkWinner() {
  const winningCombinations = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
  });
}

function resetGame() {
  cells = Array(9).fill(null);
  currentPlayer = '👨‍🚀';
  gameActive = true;
  status.textContent = `${currentPlayer}'s turn`;
  createBoard();
}
