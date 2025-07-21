/******************************************************************************
Name
Date
Description
A game that I call Tetrimino Attack.
The board is 6 tiles wide, because that's good for touch input.
12 tiles tall, because vertical screens

******************************************************************************/

let canvasW = 300
let canvasH = 300
let bgColor = "#021"
let lineWeight = 1
let game = {state: 0}
let TILE_SIZE = 25
const LEFT_MARGIN = 75
let TILE_TYPES = ["LIGHT", "NIGHT", "WATER", "EARTH", "FIRE"]// "CLOUDS", "FIRE", "TREES", "PEOPLE", "ANIMAL", "STONE"]
let ICONS = ["☀️", "🌙", "🌊", "🌱", "🔥"]
let COLORS = ["#FF0", "#005", "#06F", "#744", "#F80"]

class Tile {
  constructor(x, y, type){
    this.state = "FALLING"
    this.type = Math.floor(Math.random()*TILE_TYPES.length)
    this.color = COLORS[this.type]
    this.icon = ICONS[this.type]
    this.x
    this.y
    this.h = TILE_SIZE
    this.w = TILE_SIZE
  }
  /*
  Drop each tic,
  if a tile lands on a landed tile, the clump breaks into vertical stacks that fall to the bottom
  */
  draw() {
    stroke(0)
    fill(this.color)
    rect(this.x, this.y, this.h, this.w)
    textAlign(CENTER, CENTER)
    fill(this.color)
    textSize(TILE_SIZE*.7)
    noStroke(); fill(0)
    text(this.icon, this.x + this.h / 2, this.y + this.w / 2)
  }
  click() {

  }
}

let board = {rows: 12, cols: 6}
let tiles

function setup() {
  tiles = make2DArray(board.rows, board.cols, 0)
  tiles[2][1].state = "⭕"
  do2D(tiles, (i, j) => {
    tiles[i][j].x = j*TILE_SIZE + LEFT_MARGIN
    tiles[i][j].y = i*TILE_SIZE
    tiles[i][j].type = ICONS[Math.random()*ICONS.length]
  })
  textOutput()
  textAlign(CENTER, CENTER)
  createCanvas(canvasW, canvasH)
   pixelDensity(1)
}
function draw() {
  background(bgColor)
  fill(0)
  stroke(0)
  
  do2D(board, (i, j) => 
    tiles[i][j].draw()
  )
  
  checkMatches()
}

function checkMatches() {
  // make a "match grid" to track pieces to delete
  // more than 3 pieces eliminated at a time = points
  let matchedGrid = new Array(12 * 6).fill(0);

  //check rows
  for (let row = 0; row < 12; row++){
    let sameCounter = 1
    let lastType = tiles[row][0].type
    for (let col = 1; col < 6; col++){
      let thisType = tiles[row][col].type
      if (thisType === lastType) {
        sameCounter++
      } else {
        sameCounter = 1
      }
      if (sameCounter >= 3) {
        console.log(`match ${row} ${col}`)
        matchedGrid[row * 6 + col - 0] = 1
        matchedGrid[row * 6 + col - 1] = 1
        matchedGrid[row * 6 + col - 2] = 1
      }
      lastType = tiles[row][col].type
    }
  }
  console.log(matchedGrid)
}

function do2D(array, indexCallback2D) {
  for (let row = 0; row < board.rows; row++) {
    for (let col = 0; col < board.cols; col++) {
      indexCallback2D(row, col)
    }  
  }
}

function make2DArray(rows, columns, filler = 0) {
  let array2D = []
  for (let row = 0; row < rows; row++) {
    array2D.push([])
    for (let col = 0; col < columns; col++) {
      array2D[row].push(new Tile());
    }  
  }
  return array2D
}

function mouseReleased() {
  let xTile = floor((mouseX - LEFT_MARGIN) / TILE_SIZE);
  let yTile = floor(mouseY / TILE_SIZE);
  
  // Check if the click is within the board bounds
  if (xTile >= 0 && xTile < board.cols && 
      yTile >= 0 && yTile < board.rows) {
    console.log(`Clicked tile: ${xTile}, ${yTile}`);
    
    if (xTile > 0) { // Righthand swap
      // Swap the tiles in the array (note the yTile comes first in the 2D array)
      [tiles[yTile][xTile], tiles[yTile][xTile - 1]] = 
        [tiles[yTile][xTile - 1], tiles[yTile][xTile]];
      
      // Update their x positions to match the new array positions
      tiles[yTile][xTile].x = xTile * TILE_SIZE + LEFT_MARGIN;
      tiles[yTile][xTile - 1].x = (xTile - 1) * TILE_SIZE + LEFT_MARGIN;
    }
  }
}