const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // Snake and food size
let snake = [{ x: 200, y: 200 }];
let food = { x: getRandomPosition(), y: getRandomPosition() };
let dx = box, dy = 0;
let score = 0;

// Generate random position for food
function getRandomPosition() {
    return Math.floor(Math.random() * (canvas.width / box)) * box;
}

// Listen for arrow key input
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (event.key === "ArrowUp" && dy === 0) { dx = 0; dy = -box; }
    else if (event.key === "ArrowDown" && dy === 0) { dx = 0; dy = box; }
    else if (event.key === "ArrowLeft" && dx === 0) { dx = -box; dy = 0; }
    else if (event.key === "ArrowRight" && dx === 0) { dx = box; dy = 0; }
}

// Game loop
function updateGame() {
    // Move snake by adding new head
    let newHead = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check for wall collision
    if (newHead.x < 0 || newHead.x >= canvas.width || newHead.y < 0 || newHead.y >= canvas.height) {
        alert(`Game Over! Score: ${score}`);
        document.location.reload();
    }

    // Check for self-collision
    for (let segment of snake) {
        if (newHead.x === segment.x && newHead.y === segment.y) {
            alert(`Game Over! Score: ${score}`);
            document.location.reload();
        }
    }

    // Check if food is eaten
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        food = { x: getRandomPosition(), y: getRandomPosition() };
    } else {
        snake.pop(); // Remove tail if no food is eaten
    }

    snake.unshift(newHead); // Add new head

    drawGame();
}

// Draw snake and food
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Draw snake
    ctx.fillStyle = "green";
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, box, box));
}

// Run game loop every 100ms
setInterval(updateGame, 100);
