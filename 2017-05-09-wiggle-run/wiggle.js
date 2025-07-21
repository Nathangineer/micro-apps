let canvasW = 300
let canvasH = 300
let waveHeight = 100
let noiseScale = 200
let noiseSpeed = .002
let player
let elevations = []

function setup() {
  createCanvas(300, 300);
  player = new Ball(canvasW / 2);
}

function draw() {
  background(20)
  stroke(255)

  
  elevations = []
  for (let i = 0; i <= canvasW; i++) {
    elevations.push(canvasH * noise(i / noiseScale, frameCount * noiseSpeed))
  }                 

  beginShape()
  for (let i = 0; i <= canvasW; i++) {
    let elev = canvasH * noise(i / noiseScale, frameCount * noiseSpeed);
    // point(i, elev)
    vertex(i, elevations[i])
  }
  vertex(canvasW, canvasH)
  vertex(0, canvasH)
  endShape(FILL)


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
    this.dxL = 0;
    this.dxR = 0;
    this.r = 20
    this.heights = []
    for (let i = -this.r; i <= this.r; i++){
      this.heights.push(sqrt(this.r**2 - i**2))
    }
    console.log(this.heights)
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
        minTouchX = playerPos - i
      }
      minTouchY = min(minTouchY, adjustedHeight)
    }
    //debug circle
    //push(); fill(0); circle(minTouchX, minTouchY, 5); pop();

    this.dxR = elevations[playerPos + 1]
    this.dxL = elevations[playerPos - 1]
    
    this.f += (this.dxR - this.dxL) / 20
    this.v += this.f
    this.v *= 0.99

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
    fill(128)
    rectMode(CENTER)
    push()
    translate(player.x, player.y)
      rotate(this.angle)
      circle(0, 0, player.r * 2)
      fill(0)
      rect(0,0,player.r * sqrt(2))
      fill(0)
      rect(0,0,player.r -4)
    pop()
      //triangle(this.x, this.y, this.x - 5, this.y - 10, this.x + 5, this.y - 10)
  }
}