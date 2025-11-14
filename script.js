window.onload = function() {
  console.log('Snake game script loaded and running.');
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const box = 20;
  let snake = [{ x: 9 * box, y: 10 * box }];
  let direction = "RIGHT"; // start moving
  let score = 0;

  // Apples
  const appleTypes = [
    { color: "green", speed: 200 }, // slow
    { color: "red", speed: 120 },   // normal
    { color: "gold", speed: 80 }    // fast
  ];
  let currentApple;

  // Walls
  const wallSizes = [
    { x: box * 2, y: box * 2, w: canvas.width - box * 4, h: canvas.height - box * 4 }, // Large
    { x: box * 4, y: box * 4, w: canvas.width - box * 8, h: canvas.height - box * 8 }, // Middle
    { x: box * 6, y: box * 6, w: canvas.width - box * 12, h: canvas.height - box * 12 } // Small
  ];
  let walls = {
    x: box * 2,
    y: box * 2,
    w: canvas.width - box * 4,
    h: canvas.height - box * 4
  };

  let nextWalls = null;
  let gameSpeed = 120;
  let gameLoop = setInterval(draw, gameSpeed);

  // Update score display
  const scoreDisplay = document.getElementById("scoreDisplay");
  function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
  }

  // Replay button functionality
  document.getElementById("replayBtn").onclick = function() {
    clearInterval(gameLoop);
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0;
    gameSpeed = 120;
    walls = { ...wallSizes[0] }; // Reset to the largest wall size
    currentApple = randomApple();
    updateScore();
    gameLoop = setInterval(draw, gameSpeed);
  };

  document.getElementById("restartBtn").onclick = function() {
    const gameOverOverlay = document.getElementById("gameOverOverlay");
    gameOverOverlay.style.display = "none";

    // Reset the game state
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0;
    gameSpeed = 120;
    walls = { ...wallSizes[0] }; // Reset to the largest wall size
    currentApple = randomApple();
    updateScore();
    gameLoop = setInterval(draw, gameSpeed);
  };

  // Controls
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  });

  function randomApple() {
    let appleType = appleTypes[Math.floor(Math.random() * appleTypes.length)];
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * ((walls.w - box) / box)) * box + walls.x,
        y: Math.floor(Math.random() * ((walls.h - box) / box)) * box + walls.y,
        ...appleType
      };
    } while (
      snake.some(segment => segment.x === pos.x && segment.y === pos.y) || // Avoid snake
      pos.x < walls.x || pos.y < walls.y || // Avoid outside walls
      pos.x + box > walls.x + walls.w || pos.y + box > walls.y + walls.h // Avoid outside walls
    );
    return pos;
  }

  // Now that randomApple is defined, initialize currentApple
  currentApple = randomApple();

  function moveWalls() {
    const newWallSize = wallSizes[Math.floor(Math.random() * wallSizes.length)];

    // Temporarily store the new walls
    nextWalls = {
      x: newWallSize.x,
      y: newWallSize.y,
      w: newWallSize.w,
      h: newWallSize.h,
    };

    // Clear the current apple (visually) by setting it to null
    currentApple = null;

    // Delay the application of the new walls
    setTimeout(() => {
      walls = { ...nextWalls }; // Apply the new walls
      currentApple = randomApple(); // Respawn the apple within the new walls
      nextWalls = null; // Clear the temporary walls
    }, 2000); // 2000ms = 2 seconds
  }

  function draw() {
    // Clear the canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the current walls
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.strokeRect(walls.x, walls.y, walls.w, walls.h);

    // Draw the next walls in grey if they exist
    if (nextWalls) {
      ctx.strokeStyle = "grey";
      ctx.lineWidth = 5;
      ctx.strokeRect(nextWalls.x, nextWalls.y, nextWalls.w, nextWalls.h);
    }

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? "aqua" : "white";
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
      ctx.strokeStyle = "blue";
      ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw the apple only if it exists
    if (currentApple) {
      ctx.fillStyle = currentApple.color;
      ctx.beginPath();
      ctx.arc(currentApple.x + box / 2, currentApple.y + box / 2, box / 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Move the snake
    let headX = snake[0].x;
    let headY = snake[0].y;
    if (direction === "LEFT") headX -= box;
    if (direction === "UP") headY -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "DOWN") headY += box;

    // Check if the snake eats the apple
    if (
      currentApple && // Ensure the apple exists
      headX < currentApple.x + box &&
      headX + box > currentApple.x &&
      headY < currentApple.y + box &&
      headY + box > currentApple.y
    ) {
      score++;
      updateScore();

      // Clear and restart the game loop with the new speed
      clearInterval(gameLoop);
      gameSpeed = currentApple.speed;
      gameLoop = setInterval(draw, gameSpeed);

      moveWalls(); // Change the walls and respawn the apple
    } else {
      snake.pop();
    }

    let newHead = { x: headX, y: headY };

    // Check for collisions
    if (
      newHead.x < walls.x || // Left wall
      newHead.y < walls.y || // Top wall
      newHead.x + box > walls.x + walls.w || // Right wall
      newHead.y + box > walls.y + walls.h || // Bottom wall
      (newHead.x < 0 || newHead.y < 0 || // Outside the canvas
      newHead.x >= canvas.width || newHead.y >= canvas.height || // Outside the canvas
      collision(newHead, snake)) // Snake collides with itself
    ) {
      gameOver();
      return;
    }

    snake.unshift(newHead);

    console.log("Snake Head:", snake[0]);
    console.log("Apple Position:", currentApple);
    console.log("Walls:", walls);
  }

  function collision(head, array) {
    return array.some(seg => head.x === seg.x && head.y === seg.y);
  }

  function gameOver() {
    clearInterval(gameLoop);

    // Redirect to the Game Over page immediately
    window.location.href = `Gameover.html?score=${score}`;
  }
}
