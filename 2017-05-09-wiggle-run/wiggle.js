let canvasW = 300
let canvasH = 300
let waveHeight = 500
let waveTop = 250
let noiseScale = .05
let noiseSpeed = .002
let player
let playerDrag = .01
let playerRebou
let elevations = []
let minElev = 0
let maxElev = 500
let bullets = []

function setup() {
  createCanvas(300, 300);
  player = new Ball(canvasW / 2);
  noiseDetail(6, .1)
}

function draw() {
  background(20)
  stroke(255)
  
  elevations = []
  for (let i = 0; i <= canvasW; i++) {
    let elevationPoint = waveHeight * noise(i * noiseScale, frameCount * noiseSpeed) + waveTop
    elevations.push(elevationPoint)
    minElev = min(minElev, elevationPoint)
    maxElev = max(maxElev, elevationPoint)
  }    
  // scale elevations to always be the full wave height
  for (let i = 0; i < elevations.length; i++) {
    elevations[i] = map(elevations[i], minElev, maxElev, waveTop, height)
  }  
  
  fill(50)
  beginShape()
  for (let i = 0; i <= canvasW; i++) {
    // point(i, elevations[i]) // Old way
    vertex(i, elevations[i])
  }
  vertex(canvasW + 5, elevations[width])
  vertex(canvasW + 5, canvasH + 5)
  vertex(-5, canvasH + 5)
  endShape(FILL)

  bullets.forEach(b => b.move())
  bullets.forEach(b => b.show())

  player.input();
  player.show()
  player.move()
  
}

class Ball {
  constructor(start) {
    this.x = start;
    this.y = 0;
    this.v = 0;
    this.f = 0;
    this.dy = 0;
    this.dx = 1;
    this.r = 20
    this.heights = []
    for (let i = -this.r; i <= this.r; i++){
      this.heights.push(sqrt(this.r**2 - i**2))
    }
    this.angle = 0
  }

  input() {
    if (keyIsPressed && key === 'a') {
      this.f = -0.1;
    } else if (keyIsPressed && key === 'd') {
      this.f = 0.1;
    } else {
      this.f = 0;
    }
    // ADD input for left and right in the lower corners
  }
  move() {
    let playerPos = constrain(floor(this.x + 1), 1, width - 1)

    // calculate circle touch position
    let minTouchY = 500
    let minTouchX
    for (let i = 0; i < this.r * 2; i++) {
      let adjustedHeight = elevations[constrain(playerPos - i + this.r, 0, canvasW)] - this.heights[i]
      if (adjustedHeight < minTouchY) {
        minTouchY = adjustedHeight
        minTouchX = playerPos
      }
    }
    //debug circle
    //push(); fill(0); circle(minTouchX, minTouchY, 5); pop();

    this.dy = elevations[playerPos + this.dx] - elevations[playerPos - this.dx]
    
    this.f += this.dy / 20
    this.v += this.f
    this.v *= 1 - playerDrag

    if (this.x <= 0) {
      this.v = abs(this.v) * .9
    } else if (this.x >= width) {
      this.v = -abs(this.v) * .9
    } 

    this.angle += this.v / this.r
    this.x += this.v
    //this.y = elevations[floor(this.x)]
    this.y = minTouchY
  }
  show() {
    fill(0)
    rectMode(CENTER)
    push()
    translate(this.x, this.y)
      rotate(this.angle)
      circle(0, 0, this.r * 2)
      fill(0)
      rect(0,0,this.r)
      fill(0)
    pop()
    // canon
    rect(this.x, this.y-13, 10, 25)
    circle(this.x, this.y, this.r * .6)
    
    //triangle(this.x, this.y, this.x - 5, this.y - 10, this.x + 5, this.y - 10)
  }
}

class Bullet {
  constructor(x, y, vx, vy) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.r = 10
    this.angle = 0
  }
  move() {
    this.angle += this.vy / this.r / 6
    this.x += this.vx
    this.y += this.vy
  }
  show() {
    fill(0)
    rectMode(CENTER)
    push()
    translate(this.x, this.y)
      rotate(this.angle)
      rect(0,0,this.r)
      fill(0)
    pop()
  }
}

function keyPressed() {
  if (key === "w" || key == "UP_ARROW") {
    bullets.push(new Bullet(player.x, player.y, player.v, -5))
  }
}