let canvasW = 300
let canvasH = 300

let brickRows = 6;
let brickCols = 5;
let brickWidth = 54;
let brickHeight = 15;
let brickPadding = 5;
let brickMarginTop = 5;
let brickMarginLeft = 5;
let bricks = [];

let paddleWidth = 60
let paddleY = 50
let paddleH = 10

let ball = {
  x: 0,
  y: 0,
  dx: 2,
  dy: -1.5,
  r: 5
};

let paddle = {
  x: 0,
  y: paddleY,
  w: paddleWidth,
  h: paddleH
};

let score = 0;
let lives = 5;
let gameOver = false;

function setup() {
  createCanvas(300, 300);
  
  // Initialize ball position
  ball.x = width / 2;
  ball.y = height - paddleY - 5;
  
  // Initialize paddle position
  paddle.x = (width) / 2;
  
  // Initialize bricks
  for (let c = 0; c < brickCols; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRows; r++) {
      bricks[c][r] = {x: 0, y: 0, w: brickWidth, h: brickHeight, status: 1,
        color: color(random(100, 230), random(100, 230), random(100, 230))
      };
    }
  }
}

function draw() {
  background(0);
  
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
  ellipse(paddle.x, height - paddle.y, paddle.w, paddle.h);
  rect(paddle.x, height - paddle.y + paddle.h/3, paddle.w, paddle.h*2/3, 10);
  
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
  
  // Wall collision (left/right)
  if (ball.x + ball.r > width) {
    ball.dx = -abs(ball.dx);
  }
  if (ball.x - ball.r < 0) {
    ball.dx = abs(ball.dx);
  }
  
  // Wall collision (top)
  if (ball.y - ball.r < 0) {
    ball.dy = abs(ball.dy);
  }
  
  // Paddle collision
  if (ball.y + ball.r > height - paddle.y &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.w) {
    ball.dy = -abs(ball.dy);
    
    // Add some angle variation based on where ball hits paddle
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
          // Check if ball is overlapping with the brick at all
          if (ball.x + ball.r > b.x && 
              ball.x - ball.r < b.x + b.w && 
              ball.y + ball.r > b.y && 
              ball.y - ball.r < b.y + b.h) {

              // Find which side was hit (top, bottom, left, right)
              let overlapLeft = ball.x + ball.r - b.x;
              let overlapRight = b.x + b.w - (ball.x - ball.r);
              let overlapTop = ball.y + ball.r - b.y;
              let overlapBottom = b.y + b.h - (ball.y - ball.r);

              // Find the smallest overlap (indicates the side hit)
              let minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

              // React based on which side was hit
              if (minOverlap === overlapTop) {
                  ball.dy = -abs(ball.dy); // Hit top
              } 
              else if (minOverlap === overlapBottom) {
                  ball.dy = abs(ball.dy); // Hit bottom
              } 
              else if (minOverlap === overlapLeft) {
                  ball.dx = -abs(ball.dx); // Hit left
              } 
              else if (minOverlap === overlapRight) {
                  ball.dx = abs(ball.dx); // Hit right
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
      ball.y = height - paddleY - 5;
      ball.dx = 2;
      ball.dy = -2;
    }
  }
}