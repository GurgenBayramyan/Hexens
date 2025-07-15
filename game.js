const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const levelSelect = document.getElementById('level-select');
const startBtn = document.getElementById('start-btn');
const levelScreen = document.getElementById('level-screen');
const gameScreen = document.getElementById('game-screen');
const lastResultDiv = document.getElementById('last-result');
const recordResultDiv = document.getElementById('record-result');
const levelDisplayDiv = document.getElementById('level-display');

const box = 20;
const rows = canvas.height / box;
const cols = canvas.width / box;

let snake = [ { x: 9 * box, y: 9 * box } ];
let direction = 'RIGHT';
let food = randomFood();
let score = 0;
let level = 1;
let gameInterval;
let changingDirection = false;
let selectedLevel = 1;

function showLevelScreen() {
  levelScreen.style.display = '';
  gameScreen.style.display = 'none';
}

function showGameScreen() {
  levelScreen.style.display = 'none';
  gameScreen.style.display = '';
}

startBtn.addEventListener('click', () => {
  selectedLevel = parseInt(levelSelect.value, 10);
  showGameScreen();
  startGame(selectedLevel);
});

function randomFood() {
  return {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box
  };
}

function getSpeedForLevel(level) {
  if (level >= 4) return 40;
  if (level === 3) return 60;
  if (level === 2) return 80;
  return 100;
}

function getLevelForScore(score) {
  if (score >= 15) return 4;
  if (score >= 10) return 3;
  if (score >= 5) return 2;
  return 1;
}

function updateLevelDisplay() {
  levelDisplayDiv.textContent = 'Level: ' + level;
}

function draw() { 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {

      ctx.fillStyle = 'blue';
      ctx.beginPath();
      ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.fillStyle = 'white';
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
  }
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);
  updateLevelDisplay();
}

function moveSnake() {
  const head = { ...snake[0] };
  if (direction === 'LEFT') head.x -= box;
  if (direction === 'RIGHT') head.x += box;
  if (direction === 'UP') head.y -= box;
  if (direction === 'DOWN') head.y += box;

  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height
  ) {
    gameOver();
    return;
  }
  for (let i = 1; i < snake.length; i++) { 
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
      return;
    }
  }

  if (head.x === food.x && head.y === food.y) {
    snake.unshift(head);
    score++;
    document.getElementById('score').textContent = 'Score: ' + score;
    food = randomFood();
  } else {
    snake.unshift(head);
    snake.pop();
  }
  draw();
  changingDirection = false;
}

function startGame(levelToStart) {
  level = levelToStart;
  snake = [ { x: 9 * box, y: 9 * box } ];
  direction = 'RIGHT';
  food = randomFood();
  score = 0;
  changingDirection = false;
  document.getElementById('score').textContent = 'Score: 0';
  draw();
  clearInterval(gameInterval);
  gameInterval = setInterval(moveSnake, getSpeedForLevel(level));
  levelSelect.disabled = true;
  startBtn.disabled = true;
  updateLevelDisplay();
}

function restartGame() {
  selectedLevel = parseInt(levelSelect.value, 10);
  showGameScreen();
  startGame(selectedLevel);
}

function updateMainPageScores(last, record) {
  lastResultDiv.textContent = 'Last Score: ' + last;
  recordResultDiv.textContent = 'Record: ' + record;
}

function getRecord() {
  return parseInt(localStorage.getItem('snakeRecord') || '0', 10);
}

function gameOver() {
  clearInterval(gameInterval);
  gameInterval = null;
  let record = getRecord();
  if (score > record) {
    record = score;
    localStorage.setItem('snakeRecord', record);
  }

  levelSelect.disabled = false;
  startBtn.disabled = false;
  updateMainPageScores(score, record);
  showLevelScreen();
  updateLevelDisplay();
}

function changeDirection(e) {
  if (changingDirection) return;
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') {
    direction = 'LEFT';
    changingDirection = true;
  } else if (e.key === 'ArrowUp' && direction !== 'DOWN') {
    direction = 'UP';
    changingDirection = true;
  } else if (e.key === 'ArrowRight' && direction !== 'LEFT') {
    direction = 'RIGHT';
    changingDirection = true;
  } else if (e.key === 'ArrowDown' && direction !== 'UP') {
    direction = 'DOWN';
    changingDirection = true;
  } else if (e.key === ' ' || e.key === 'Space' || e.code === 'Space') {
    console.log('intervaly ->', gameInterval);
    e.preventDefault();
    if (!gameInterval) {
      restartGame();
    }
  }
}

document.addEventListener('keydown', changeDirection);
showLevelScreen();
const lastScore = parseInt(localStorage.getItem('snakeLastScore') || '0', 10);
updateMainPageScores(lastScore, getRecord());
draw(); 
updateLevelDisplay(); 