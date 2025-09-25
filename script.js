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
    { color: "gold", speed: 60 }    // fast
  ];
  let currentApple;

  // Walls
  let walls = {
    x: box * 2,
    y: box * 2,
    w: canvas.width - box * 4,
    h: canvas.height - box * 4
  };

  let gameSpeed = 120;
  let gameLoop = setInterval(draw, gameSpeed);

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
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
        ...appleType
      };
    } while (
      // avoid walls
      pos.x < walls.x ||
      pos.y < walls.y ||
      pos.x >= walls.x + walls.w ||
      pos.y >= walls.y + walls.h
    );
    return pos;
  }

  // Now that randomApple is defined, initialize currentApple
  currentApple = randomApple();

  function moveWalls() {
    walls.x = box * Math.floor(Math.random() * 5 + 1);
    walls.y = box * Math.floor(Math.random() * 5 + 1);
    walls.w = canvas.width - (walls.x * 2);
    walls.h = canvas.height - (walls.y * 2);

    // Ensure snake is inside walls after they shift
    if (
      snake[0].x < walls.x ||
      snake[0].y < walls.y ||
      snake[0].x >= walls.x + walls.w ||
      snake[0].y >= walls.y + walls.h
    ) {
      gameOver();
    }
  }

  function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Walls
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeRect(walls.x, walls.y, walls.w, walls.h);

    // Snake
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? "lime" : "white";
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
      ctx.strokeStyle = "black";
      ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Apple
    ctx.fillStyle = currentApple.color;
    ctx.beginPath();
    ctx.arc(currentApple.x + box/2, currentApple.y + box/2, box/2, 0, 2 * Math.PI);
    ctx.fill();

    // Move snake
    let headX = snake[0].x;
    let headY = snake[0].y;
    if (direction === "LEFT") headX -= box;
    if (direction === "UP") headY -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "DOWN") headY += box;

    // Eat apple
    if (headX === currentApple.x && headY === currentApple.y) {
      score++;
      clearInterval(gameLoop);
      gameSpeed = currentApple.speed;
      gameLoop = setInterval(draw, gameSpeed);

      currentApple = randomApple();
      moveWalls();
    } else {
      snake.pop();
    }

    let newHead = { x: headX, y: headY };

    // Collisions
    if (
      headX < walls.x ||
      headY < walls.y ||
      headX >= walls.x + walls.w ||
      headY >= walls.y + walls.h ||
      collision(newHead, snake)
    ) {
      gameOver();
      return;
    }

    snake.unshift(newHead);
  }

  function collision(head, array) {
    return array.some(seg => head.x === seg.x && head.y === seg.y);
  }

  function gameOver() {
    clearInterval(gameLoop);
    alert("Game Over! Score: " + score);
  }
}

