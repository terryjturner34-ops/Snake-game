const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- Game settings ---
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const CELL = 20;

let snake = [
  {x: 100, y: 100},
  {x: 80, y: 100},
  {x: 60, y: 100}
];

let direction = {x: CELL, y: 0};
let speed = 10; // frames per second

// --- Apples (3 kinds: normal, slow, fast) ---
let apples = [];
function spawnApple() {
  const x = Math.floor(Math.random() * (WIDTH / CELL)) * CELL;
  const y = Math.floor(Math.random() * (HEIGHT / CELL)) * CELL;
  const kinds = ["normal", "slow", "fast"];
  const kind = kinds[Math.floor(Math.random() * kinds.length)];
  apples.push({x, y, kind});
}
for (let i = 0; i < 3; i++) spawnApple();

// --- Expanding/shrinking walls ---
let wallMargin = 0;
let expanding = true;
let expandTimer = 0;
const EXPAND_INTERVAL = 30; // ticks between wall size change

function drawWalls() {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeRect(
    wallMargin,
    wallMargin,
    WIDTH - wallMargin * 2,
    HEIGHT - wallMargin * 2
  );
}

function insideWalls(pos) {
  return (
    pos.x >= wallMargin &&
    pos.x < WIDTH - wallMargin &&
    pos.y >= wallMargin &&
    pos.y < HEIGHT - wallMargin
  );
}

// --- Controls ---
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction.y === 0) direction = {x: 0, y: -CELL};
  if (e.key === "ArrowDown" && direction.y === 0) direction = {x: 0, y: CELL};
  if (e.key === "ArrowLeft" && direction.x === 0) direction = {x: -CELL, y: 0};
  if (e.key === "ArrowRight" && direction.x === 0) direction = {x: CELL, y: 0};
});

// --- Main Game Loop ---
function gameLoop() {
  // Move snake
  const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
  snake.unshift(head);

  // Apple collision
  let ateApple = false;
  for (let i = 0; i < apples.length; i++) {
    const apple = apples[i];
    if (head.x === apple.x && head.y === apple.y) {
      ateApple = true;
      apples.splice(i, 1);
      spawnApple();
      // Speed effects
      if (apple.kind === "slow") speed = Math.max(5, speed - 2);
      if (apple.kind === "fast") speed = Math.min(30, speed + 2);
      break;
    }
  }
  if (!ateApple) snake.pop();

  // Collision with self or wall
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      alert("Game Over! You hit yourself.");
      document.location.reload();
    }
  }
  if (!insideWalls(head)) {
    alert("Game Over! You hit the wall.");
    document.location.reload();
  }

  // Expand/shrink walls
  expandTimer++;
  if (expandTimer >= EXPAND_INTERVAL) {
    expandTimer = 0;
    if (expanding) {
      wallMargin += CELL;
      if (wallMargin >= WIDTH / 4) expanding = false;
    } else {
      wallMargin -= CELL;
      if (wallMargin <= 0) expanding = true;
    }
  }

  // --- Drawing ---
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw apples
  apples.forEach((apple) => {
    if (apple.kind === "normal") ctx.fillStyle = "red";
    if (apple.kind === "slow") ctx.fillStyle = "blue";
    if (apple.kind === "fast") ctx.fillStyle = "yellow";
    ctx.fillRect(apple.x, apple.y, CELL, CELL);
  });

  // Draw snake
  ctx.fillStyle = "lime";
  snake.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, CELL, CELL);
  });

  // Draw walls
  drawWalls();

  setTimeout(gameLoop, 1000 / speed);
}

gameLoop();
