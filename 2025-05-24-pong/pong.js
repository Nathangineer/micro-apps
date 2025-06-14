/******************************************************************************
Name
Date
Description
Pong
The paddles and ball can go through the top and bottom
The ball leaves a long trail using gradient fill.
******************************************************************************/

let canvasW = 300
let canvasH = 300
let bgColor = "#888"
let lineWeight = 1
let game = {state: 0}
let TILE_SIZE = 25

class Paddle {
  constructor(side = 1) {
    this.side = side
    this.human = true
    this.dir = 0
    this.w = 10
    this.h = 60
    this.x = (side == 1) ? 10 : canvasW - 10 - this.w
    this.y = canvasH / 2 - this.h / 2
  }
  show() {
    rect(this.x, this.y, this.w, this.h)
  }
  move() {
    this.y += this.dir
  }
}
let paddle = []

function setup() {
  paddle.push(...[new Paddle(1), new Paddle(-1)])
  console.log
  textOutput()
  textAlign(CENTER, CENTER)
  createCanvas(canvasW, canvasH)
}
function draw() {
  background(bgColor)
  fill(0)
  stroke(0)
  circle(100,100,100)
  
  //
  paddle.forEach(i => i.move())
  paddle.forEach(i => i.show())
  
  if (game.state == 0) {
  } else if (game.state == 1) {
  } else if (game.state == 2) {
  } else if (game.state == 3) {
  } 
}

function keyPressed() {
  if (keyCode == 38) {
    paddle[0].dir = -1
  }
  if (keyCode == 40) {
    paddle[0].dir = 1
  }
  console.log(key + "  " + keyCode)
}