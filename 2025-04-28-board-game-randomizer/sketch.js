// 
// Pyramid Descent Board Game 2025-04-28
// 

// Include gradient:
/*! p5.fillgradient v0.1.2 (c) 2024 Jorge Moreno, @alterebro */
"use strict";p5.prototype.fillGradient=function(){let o=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"linear";var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};let r=2<arguments.length&&void 0!==arguments[2]&&arguments[2];var e={linear:{from:[0,0],to:[width,height],steps:[color(255),color(0,96,164),color(0)]},radial:{from:[width/2,height/2,0],to:[width/2,height/2,max(width/2,height/2)],steps:[color(255),color(0,96,164),color(0)]},conic:{from:[width/2,height/2,90],steps:[color(255),color(0,96,164),color(0)]}};let a=o.toLowerCase(),i=(a=e[a]?a:"linear",Object.assign(e[a],t)),l=(r?r.canvas:canvas).getContext("2d"),n={linear:()=>l.createLinearGradient(i.from[0],i.from[1],i.to[0],i.to[1]),radial:()=>l.createRadialGradient(i.from[0],i.from[1],i.from[2],i.to[0],i.to[1],i.to[2]),conic:()=>l.createConicGradient(radians(i.from[2]),i.from[0],i.from[1])},c=n[a]();i.steps.forEach((o,t)=>{o=Array.isArray(o)?o:[o],t=o[1]||t/(i.steps.length-1),t=Math.min(1,Math.max(0,t));c.addColorStop(t,o[0])}),l.fillStyle=c};


let totalPlayers = 2
let playerTokens = ["🍬", "🍭", "🍫", "♜", "🐜"]

let canvasW = 300
let canvasH = 300
let pointIndexCounter = 0
let springTension = .8 // Force per pixel from springLength
let springLength = 15
let drag = .98
let repel = 4000
let pointMass = 10
let pointNum = 80
const margin = 35
const tileSize = 15
let gameState = { clickToStart: true,
                  playerRoll: false,
                  playerDone: false,
                  gameOver: false
                }
let players = new Array(totalPlayers).fill(0) // Only stores progress
let currentPlayer = 0
let diceRoll = 0
let message = "Click to Start"

function pointObject() {
  this.x = Math.random()*(canvasW-margin*2)+margin
  this.y = Math.random()*(canvasH-margin*2)+margin
  this.index = pointIndexCounter
  this.vx = 0
  this.vy = 0
  this.ax = 0
  this.ay = 0
  this.fx = 0
  this.fy = 0
  this.mass = pointMass
  this.color = ""
}

let points = new Array(pointNum+1)

function setup() {
  createPoints()
  createCanvas(canvasW, canvasH);
  textStyle(BOLD)
  textSize(canvasH/15)
}

function draw() {
  fillGradient('radial', {
    from : [canvasW/2, canvasH/2, 900, 0], // x, y, angle(degrees)
    steps : [[color(152, 107, 54), 0],
             [color(152, 107, 54), .25],
             [color(198, 151, 98), .5],
             [color(243, 194, 140), .75],     
             [color(52, 17, 54), 1]]}
    )
  
  rect(-5, -5, canvasW+10, canvasH+10)

  movePoints()
  // draw start and goal
  fill("#fff"); noStroke()
  circle(margin, canvasH - margin, 30)
  circle(canvasW / 2, canvasH /2, 30)
  drawPoints()

  if (gameState.clickToStart == true) {message = "Click to start"} 
  if (gameState.clickToStart == false) {
    if (gameState.playerRoll == true) {
      drawPlayers()
      message = `${playerTokens[currentPlayer]} Roll`
    }
    if (gameState.playerDone == true) {
      drawPlayers()
      message = `${playerTokens[currentPlayer]} Moves ${diceRoll} Space${diceRoll == 1 ? "" : "s"}`
    }
    if (gameState.gameOver == true) {
      message = `${currentPlayer+1} wins!`
    }
  }
  
  // Display message
  stroke(255); fill(0); 
  textAlign(CENTER, TOP); textSize(25)
  strokeWeight(2)
  text(message, canvasW/2, 0)
}


function drawPlayers() {
  for (let i = 0; i < players.length; i++) {
    let pct = i / players.length
    fill(sin(pct*30*PI)*100+155, sin(pct*20*PI)*100+155, sin(pct*50*PI)*100+155, 255)
    let pieceX = points[players[i]].x
    let pieceY = points[players[i]].y

    fill(255)
    textSize(25); textAlign(CENTER, CENTER)
    text(playerTokens[i], pieceX, pieceY)
  }
}

function createPoints() {
  for (let i = 0; i < points.length; i++) {
    points[i] = new pointObject()
    pointIndexCounter++
  }
  points[0].x = canvasW / 2
  points[0].y = canvasH / 2
  
  points[points.length -1].x = margin
  points[points.length -1].y = canvasH - margin
}

function movePoints() {
  //reset forces
  for (let i = 0; i < points.length; i++) {
    points[i].fx = 0
    points[i].fy = 0    
  }
  //add up forces from connections
  for (let i = 0; i < points.length - 1; i++) {
    let xDistance = points[i].x - points[i + 1].x
    let yDistance = points[i].y - points[i + 1].y 
    let distance = Math.sqrt(xDistance ** 2 + yDistance ** 2)
    let springForce = (distance - springLength)*springTension
    let xForce = springForce * xDistance / distance
    let yForce = springForce * yDistance / distance 
    points[i].fx -= xForce
    points[i].fy -= yForce
    points[i+1].fx += xForce
    points[i+1].fy += yForce
  }
  // Repulsion points between points
  for (let i = 0; i < points.length; i++) {
  for (let j = 0; j < points.length; j++) {
    if (i != j) {
      let xDistance = points[i].x - points[j].x
      let yDistance = points[i].y - points[j].y
      let distance = Math.sqrt(xDistance ** 2 + yDistance ** 2)
      let repelForce = repel / ((distance / 1) ** 3)
      let xForce = repelForce * xDistance / distance
      let yForce = repelForce * yDistance / distance 
      points[i].fx += xForce
      points[i].fy += yForce
    }
  }}
  // Move Points
  for (let i = 1; i < points.length - 1; i++) {
    points[i].ax = points[i].fx / points[i].mass
    points[i].ay = points[i].fy / points[i].mass
    
    points[i].vx += points[i].ax
    points[i].vy += points[i].ay

    points[i].vx = constrain(points[i].vx * drag,-3, 3)
    points[i].vy = constrain(points[i].vy * drag,-3, 3)

    // wall collision
    if (points[i].x < margin) {points[i].x = margin}
    if (points[i].x > canvasW - margin) {points[i].x = canvasW - margin}
    if (points[i].y < margin) {points[i].y = margin}
    if (points[i].y > canvasH - margin) {points[i].y = canvasH - margin}
    
    points[i].x += points[i].vx
    points[i].y += points[i].vy 
  }
}

function drawPoints() {
  noFill()
  stroke(177)
  strokeWeight(tileSize*1.5)
  beginShape()
  curveVertex(points[0].x, points[0].y)
  for (let i = 0; i < points.length; i++) {
    curveVertex(points[i].x, points[i].y)
  }
  curveVertex(points[pointNum].x, points[pointNum].y)
  endShape()
  
  stroke(255)
  strokeWeight(tileSize+2)
  beginShape()
    curveVertex(points[0].x, points[0].y)
  for (let i = 0; i < points.length; i++) {
    curveVertex(points[i].x, points[i].y)
  }
  curveVertex(points[pointNum].x, points[pointNum].y)
  endShape();  
  
  // Draw points
  noStroke(); strokeWeight(2)
  for (let i = 0; i < points.length; i++) {
    let pct = i / points.length
    fill(0,160)
    circle(points[i].x, points[i].y, tileSize*1.125)
    fill(0,160)
    circle(points[i].x, points[i].y, tileSize*1.3)
    colorMode(HSB)
    fill(pct*360, 100, 100)
    circle(points[i].x, points[i].y, tileSize)
    colorMode(RGB)
    fill(0,80)
    circle(points[i].x, points[i].y, tileSize*.85)
  }
}

function mousePressed() {
  if (gameState.clickToStart == true) {
    gameState.clickToStart = false
    gameState.playerRoll = true
  } 
  else if (gameState.playerRoll == true) {
    diceRoll = floor(random() * 6 + 1)
    repel += diceRoll
    springLength += diceRoll * .2 / totalPlayers
    // movePlayer
    players[currentPlayer] += diceRoll
    console.log(players)
    // Check for win condition
    if (players[currentPlayer] >= points.length) {
      players[currentPlayer] = points.length - 1
      gameState.playerRoll = false
      gameState.gameOver = true      
    } else {
      gameState.playerRoll = false
      gameState.playerDone = true
    }
  } 
  else if (gameState.playerDone == true) {
    gameState.playerDone = false
    gameState.playerRoll = true  
    currentPlayer++
    if (currentPlayer >= players.length) {
      currentPlayer = 0
    }
  } 
  else if (gameState.gameOver == true) {
    gameState.gameOver = false
    resetGame()
    gameState.clickToStart = true
  }
}


function resetGame() {
  players = new Array(totalPlayers).fill(0) // Only stores progress
  currentPlayer = 0
  diceRoll = 0
  createPoints()
  message = "Click to Start"
}