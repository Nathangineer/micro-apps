let canvasW = 300
let canvasH = 300

let brickRows = 10;
let brickCols = 9;
let brickWidth = 25;
let brickHeight = 8;
let brickPadding = 4;
let brickMarginTop = 15;
let brickMarginLeft = 20;
let bricks = [];
let paddleH = 10

let ball = {
  x: 0,
  y: 0,
  dx: 2,
  dy: -2,
  r: 5
};

let paddle = {
  x: 0,
  y: canvasH - 50,
  w: 60,
  h: 10
};

let score = 0;
let lives = 4;
let gameOver = false;

function setup() {
  createCanvas(300, 300);
  
  // Initialize ball position
  ball.x = width / 2;
  ball.y = paddle.y - 5;
  
  // Initialize paddle position
  paddle.x = (width) / 2;
  
  // Initialize bricks
  makeBlocks();
}

function makeBlocks() {
  
  noiseSeed(millis + Math.random()*2000);
  noiseDetail(6, 1);
  for (let col = 0; col < brickCols; col++) {
    bricks[col] = [];
    for (let row = 0; row < brickRows; row++) {
      bricks[col][row] = {
        x: 0, y: 0, w: brickWidth, h: brickHeight, status: 1,
        color: color(random(120, 230), random(120, 230), random(120, 230))
      };
      if (noise(col / 5, row / 5) > 1.75) { bricks[col][row].status = 0; }

    }
  }
}

function draw() {
  blendMode(HARD_LIGHT)
  background(0, 0, 0, 50);
  
  if (gameOver) {
    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);
    text(`Game Over\nScore: ${score}`, width / 2, height / 2);
    return;
  }
  
  // Draw bricks
  for (let c = 0; c < brickCols; c++) {
    for (let r = 0; r < brickRows; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickMarginLeft;
        let brickY = r * (brickHeight + brickPadding) + brickMarginTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        fill(bricks[c][r].color);
        rect(brickX, brickY, brickWidth, brickHeight, 2);
      }
    }
  }
  
  // Draw ball
  fill(255);
  rect(ball.x - ball.r,  ball.y - ball.r,  ball.r * 2, ball.r * 2, ball.r);
  
  // Draw paddle
  fill(255); noStroke()
  
  ellipseMode(CORNER)
  
  fill(256, 256, 0)
  ellipse(paddle.x, paddle.y, paddle.w, paddle.h);
  rect(paddle.x, paddle.y + paddle.h/3, paddle.w, paddle.h*2/3, 10);
  
  // Draw score
  textSize(20);
  textAlign(LEFT, BASELINE);
  fill(255);
  text("" + score, 5, height - 5);
  
  // Draw lives
  textAlign(RIGHT, BASELINE);
  text(`${"".padStart(lives*2, " ⬤")}`, width - 5, height - 5);
  
  // Move paddle with mouse
  paddle.x = mouseX - paddle.w / 2;
  
  // Keep paddle within canvas
  paddle.x = constrain(paddle.x, -paddle.w, width - paddle.w / 2);
  
  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;
  
  // Wall collision
  if (ball.x + ball.r > width) {
    ball.dx = -abs(ball.dx);
  }
  if (ball.x - ball.r < 0) {
    ball.dx = abs(ball.dx);
  }
  if (ball.y - ball.r < 0) {
    ball.dy = abs(ball.dy);
  }
  
  // Paddle collision
  if (ball.y + ball.r > paddle.y &&
      ball.y < paddle.y + paddle.h * 1.5 &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.w) {
    ball.dy = -abs(ball.dy);
    
    // Add angle variation based on where ball hits paddle
    let hitPos = (ball.x - paddle.x) / paddle.w;
    ball.dx += map(hitPos, 0, 1, -5, 5)
    ball.dx = constrain(ball.dx, -5, 5)
    //ball.dx = map(hitPos, 0, 1, -5, 5);
  }
  
  // Brick collision
  for (let c = 0; c < brickCols; c++) {
    for (let r = 0; r < brickRows; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
          // If ball is overlapping with the brick from any direction
          if (ball.x + ball.r > b.x && 
              ball.x - ball.r < b.x + b.w && 
              ball.y + ball.r > b.y && 
              ball.y - ball.r < b.y + b.h) {

              // Find the smallest overlap to determine side hit
              let overlapLeft = ball.x + ball.r - b.x;
              let overlapRight = b.x + b.w - (ball.x - ball.r);
              let overlapTop = ball.y + ball.r - b.y;
              let overlapBottom = b.y + b.h - (ball.y - ball.r);
              let minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

              if (minOverlap === overlapTop) {
                  ball.dy = -abs(ball.dy)
              } 
              else if (minOverlap === overlapBottom) {
                  ball.dy = abs(ball.dy)
              } 
              else if (minOverlap === overlapLeft) {
                  ball.dx = -abs(ball.dx)
              } 
              else if (minOverlap === overlapRight) {
                  ball.dx = abs(ball.dx)
              }

              b.status = 0;
              score += 10;
          }
      }
      // Check if all bricks are cleared
      if (score === brickRows * brickCols * 10) {
        gameOver = true;
      }
    }
  }
  
  // Bottom wall - lose life
  if (ball.y + ball.r > height) {
    lives--;
    if (lives < 0) {
      gameOver = true;
    } else {
      // Reset ball
      ball.x = width / 2;
      ball.y = paddle.y - 5;
      ball.dx = 2;
      ball.dy = -2;
    }
  }
}

function mouseReleased(){
  if (gameOver) {
    makeBlocks();
    lives = 4
    gameOver = false
  }
}