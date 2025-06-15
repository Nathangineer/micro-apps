/*
Snake 
[ ] Snake with position, velocity, acceleration, mass, force
[x] High score at the bottom
[ ] Noise to make walls
[ ] Additional obstacles
[ ] Different ships with different rocket properties
*/

/*! p5.fillgradient v0.1.2 (c) 2024 Jorge Moreno, @alterebro */
// https://github.com/alterebro/p5.fillGradient
"use strict";p5.prototype.fillGradient=function(){let o=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"linear";var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};let r=2<arguments.length&&void 0!==arguments[2]&&arguments[2];var e={linear:{from:[0,0],to:[width,height],steps:[color(255),color(0,96,164),color(0)]},radial:{from:[width/2,height/2,0],to:[width/2,height/2,max(width/2,height/2)],steps:[color(255),color(0,96,164),color(0)]},conic:{from:[width/2,height/2,90],steps:[color(255),color(0,96,164),color(0)]}};let a=o.toLowerCase(),i=(a=e[a]?a:"linear",Object.assign(e[a],t)),l=(r?r.canvas:canvas).getContext("2d"),n={linear:()=>l.createLinearGradient(i.from[0],i.from[1],i.to[0],i.to[1]),radial:()=>l.createRadialGradient(i.from[0],i.from[1],i.from[2],i.to[0],i.to[1],i.to[2]),conic:()=>l.createConicGradient(radians(i.from[2]),i.from[0],i.from[1])},c=n[a]();i.steps.forEach((o,t)=>{o=Array.isArray(o)?o:[o],t=o[1]||t/(i.steps.length-1),t=Math.min(1,Math.max(0,t));c.addColorStop(t,o[0])}),l.fillStyle=c};

const canvasW = 300
const canvasH = 280
const scoreBarH = 20

const speed = 25 // pixels per 60 frames (60 frames = 1 second)
let millisOffset = 0
let distance = 0

let score = 0
let hiScore = 0

let snake = {x:canvasW/5, y:canvasH/2, v:0, a:0, m:0, f:0, 
             color:"CFC", size:10, pathColor: "#040", pathSize:10}
let snakeTrail = Array(snake.x).fill(-100)

let cavePath = Array(canvasW).fill(0)
let caveSize = canvasH * .8 // start size
let caveShrinkRate = 0.0001

let caveLeaderPosition = canvasH/2
let caveLeaderTick = canvasW/ 5 * 8 
let caveLeaderTimer = 0
let caveFollowerPosition = canvasH/2
let P = .02  // Proportional
let I = .2
let D = 3.0

const spikeNum = 10
const bgPointDistance = canvasW / spikeNum
let bgPath = Array(spikeNum+5).fill(0)
let bgPointIndex = 0

let gravityForce = -.1
let rocketForce = .2

let wallColor = "#AA0"
let bgColor = "#2d2432"
let scoreBarColor = "#000"
let scoreTextColor = "#FF0"

let gameState = { 
                  clickToStart: true,
                  gamePlaying: false,
                  gameOver: false
                }
                  
function setup() {
  createCanvas(canvasW, canvasH + scoreBarH)
  textOutput() // Create screen reader accessible description
  textFont('Arial', 10)
  textStyle(BOLD)
  cursor(HAND)
  
  createCave()
  createBG()
  noStroke()
  background(bgColor)
  drawBG()
  drawSnakeTrail()
  drawSnake()
  drawCave()
  drawScoreBar()
}

function draw() {
  if (gameState.clickToStart == true) {
    textSize(canvasH/10); textAlign(CENTER); 
    text("CLICK TO PLAY", canvasW/2, canvasH/2)
  } 
  if (gameState.gamePlaying == true) {
    distance += deltaTime / 1000 * speed // fix this so it resets
    moveSnake()  
    moveCave()
    fillGradient('radial', {
      from : [snake.x, snake.y, 0], // x, y, radius
      to : [snake.x, snake.y, canvasW*2/5], // x, y, radius
      steps : [[bgColor,0], [bgColor,.08], ["#F00",.1], ["#FA0",.11], ["#FF0",.12], ["#0F0",.13], ["#00F",.14], [bgColor,.16], ["#000",.49], ["#000",1]] // Array of p5.color objects or arrays containing [p5.color Object, Color Stop (0 to 1)]
    });
    rect(0,0,canvasW,canvasH)
    
    drawSnakeTrail()
    drawSnake()    
    drawBG()

    drawCave()

    drawScoreBar()
    score = round(distance/20)*100
  }
  if (gameState.gameOver == true) {
    textSize(canvasH/10); textAlign(CENTER);
    if (score > hiScore) { 
      text("GAME OVER\nNEW HIGH SCORE", canvasW/2, canvasH/2)
    } else {
      text("GAME OVER", canvasW/2, canvasH/2) 
    }
    // update hi-score and announce if new score achieved 
  }
}


function moveSnake(){
  snake.a = snake.f + gravityForce
  snake.v = snake.v + snake.a
  snake.y = snake.y - snake.v
  snakeTrail.push(snake.y)
  snakeTrail.shift()
}
function drawSnake() {
  fill(snake.color)
  circle(snake.x, snake.y, snake.size)

}
function drawSnakeTrail() {
  // tie to distance
  for (let i = 0; i < snakeTrail.length; i+=2 ) {
    fill(lerpColor(snake.pathColor, snake.color, i/snakeTrail.length/2))
    circle(i, snakeTrail[i], snake.pathSize)
  }
}

function drawScoreBar() {
  fill(scoreBarColor)
  rect(0, canvasH, canvasW, canvasH + scoreBarH)
  fill(scoreTextColor)
  textSize(scoreBarH * .8)
  textAlign(LEFT, CENTER)
  text(`SCORE:${score}`, 5, canvasH + scoreBarH/2)
  textAlign(RIGHT, CENTER)
  text(`HIGH SCORE:${hiScore}`, canvasW -5, canvasH + scoreBarH/2)
}

function createCave() {
  for (let i = 0; i < cavePath.length; i++) {
    //cavePath[i] = noise(i/30)*250 + canvasH / 2
    
    caveLeaderTimer += 10
    if (caveLeaderTimer > caveLeaderTick) {
      caveLeaderPosition = random(50, canvasH - 50)
      caveLeaderTimer = 0
    }
    caveFollowerPosition -= (caveFollowerPosition - caveLeaderPosition) * P
    cavePath.push(caveFollowerPosition)
    cavePath.shift()
  }
}

function drawCave(){
  // Draw Cave Top and Bottom
  fill(wallColor)
  fillGradient('radial', {
      from : [snake.x, snake.y, 0], // x, y, radius
      to : [snake.x, snake.y, canvasW-snake.x], // x, y, radius
      steps : [[color(255),0], [color(0, 96, 164), .2],  [color(0), .8],  [color(0), 1]] // Array of p5.color objects or arrays containing [p5.color Object, Color Stop (0 to 1)]
  });
  beginShape()
    vertex(0, 0)
    for (let i = 0; i < cavePath.length; i++) {
      vertex(i, cavePath[i] - caveSize/2)
    }
    vertex(canvasW, 0)
  endShape(CLOSE)
  beginShape()
    vertex(0, canvasH)
    for (let i = 0; i < cavePath.length; i++) {
      vertex(i, cavePath[i] + caveSize/2)
    }
    vertex(canvasW, canvasH)
  endShape(CLOSE) 
}
function moveCave(){
  // Shrink Cave
  caveSize = caveSize - caveSize*caveShrinkRate

  // Generate future game based on random movement function
  caveLeaderTimer += deltaTime
  if (caveLeaderTimer > caveLeaderTick) {
    caveLeaderPosition = random(50, canvasH - 50)
    caveLeaderTimer = 0
  }
  caveFollowerPosition -= (caveFollowerPosition - caveLeaderPosition) * P
  fill("#888")
  circle(canvasW, caveFollowerPosition, 20)
  fill("#DDD")
  circle(canvasW, caveLeaderPosition, 20)  

  cavePath.push(caveFollowerPosition)
  cavePath.shift()

  if (snake.y < cavePath[snake.x] - caveSize/2 || snake.y > cavePath[snake.x] + caveSize / 2) {
    gameState.gamePlaying = false
    gameState.gameOver = true
  }  
}

function drawBG() {
  fillGradient('radial', {
      from : [snake.x, snake.y, 0], // x, y, radius
      to : [snake.x, snake.y, canvasW], // x, y, radius
      steps : [[color(91,73,101), 0],
               [color(0), .35],
               [color(0), 0.74],
               [color(182,146,202), 0.76],
               [color(0), 0.765],
               [color(0), 1]] // Array of p5.color objects or arrays containing [p5.color Object, Color Stop (0 to 1)]
  })
  
  beginShape()
    vertex(0, canvasH)
    for (let i = 0; i < bgPath.length; i++) {
      let offset = i * bgPointDistance - distance + bgPointIndex* bgPointDistance
      vertex(offset,                       canvasH - bgPath[i])
      vertex(offset + bgPointDistance / 2, canvasH            )
    }
    vertex(canvasW, canvasH)
  endShape(CLOSE)
  beginShape()
    vertex(0, 0)
    for (let i = 0; i < bgPath.length; i++) {
      let offset = i * bgPointDistance - distance + bgPointIndex* bgPointDistance
      vertex(offset,                       bgPath[i])
      vertex(offset + bgPointDistance / 2, 0            )
    }
    vertex(canvasW, 0)
  endShape(CLOSE)
  
  if (bgPointIndex != floor(distance/bgPointDistance)) {
    console.log(distance, bgPointIndex, floor(distance/bgPointDistance))
    bgPointIndex = floor(distance/bgPointDistance)

    bgPath.push(newBGPoint())
    bgPath.shift()
  }
}

function newBGPoint() {
  if (random() < .5){
    return random(0, caveSize)
  } else {
    return 0
  }
}

function createBG() {
  for (let i = 0; i < bgPath.length; i++) {
    bgPath[i] = newBGPoint()
  }
}


function keyPressed()   { interactionStart() }
function mousePressed() { interactionStart() }
function touchStarted() { interactionStart() }

function keyReleased()  { interactionEnd() }
function mouseReleased(){ interactionEnd() }
function touchEnded()   { interactionEnd() }

function interactionStart(){
  if (gameState.clickToStart == true) {
    gameState.clickToStart = false
    gameState.gamePlaying = true
  } 
  if (gameState.gameOver == true) {
    gameState.gameOver = false
    console.log("reset")
    resetGame()
    gameState.gamePlaying = true    
  }
  snake.f = rocketForce  
  
  // show rocket
}
function interactionEnd(){
  snake.f = 0
  // remove rocket 
}

function resetGame() {
  distance = 0
  snake.y = canvasH/2 
  snake.v = 0 
  snake.a = 0 
  snake.f = 0
  snakeTrail = Array(snake.x).fill(0)
  millisOffset = millis()
  
  if (score > hiScore) { hiScore = score }
  score = 0
  
  caveSize = canvasH * .8 // start size
  caveLeaderTimer = 0
  caveFollowerPosition = canvasH/2
  caveLeaderPosition = canvasH/2
  gameState.gamePlaying = true
  createCave()
}