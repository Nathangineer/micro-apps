/******************************************************************************
Name
Date
Description
Block Falling Puzzle Game
Blocks fall from the sky but you don't know why until they hit the ground,
and you see them break and fall down. But sometimes, if they line up just right,
those pieces will connect, causing who knows not what mayem.

Indeterminate theme (e.g. Cookies, laundry, stones, 
******************************************************************************/

let canvasW = 300
let canvasH = 300
let bgColor = "#FFF"
let lineWeight = 1
let game = {state: 0}
let TILE_SIZE = 25
let TILE_TYPES = ["LIGHT", "NIGHT", "WATER", "EARTH", "CLOUDS", "FIRE", "TREES", "PEOPLE", "ANIMAL", "STONE"]
// interactions:   LIGHT    DUSK    +CLOUDS    ---       ---      --       +        +         -         ---
//                 NIGHT     --     (FISH)                                          -         +
//                 WATER     --       --      TREES             CLOUDS     +        +         +         idk
//                 EARTH     --       --        --      RAIN    STONE             Walkable Walkable  
//                 CLOUDS                       --       +?     No fire    +       +          +       
//                 FIRE                                           --    SMOKE    No village No trees  EXPLODE
//                 TREES                                                           +          +       +WATER
//                 PEOPLE                                                                   FOOD        +!     
//                 ANIMAL                                                         FOOD                  -
//                 STONE                                                                                -
// 
// (Sky: Sun, moon, stars, planets???)
// Above:  LIGHT, NIGHT, CLOUDS, SMOKE
// On:  FISH, INSECTS, ANIMALS, PEOPLE (wind)
// Below:  WATER, EARTH, STONE, TREES

// FIRE + EARTH creates STONE
// WATER + LIGHT creates free CLOUDS
// FIRE + WATER becomes CLOUDS
// FIRE + TREES becomes SMOKE
// SMOKE + COUDS creates ACID_RAINCLOUD
// EARTH near WATER grows TREES
// PEOPLE + WATER & TREES becomes village creates more PEOPLE
// CATS + 
// WATER near TREES on FIRE becomes polluted to a degreee??

// Peices can be directional, or have different pieces on each side.


class Tile {
  constructor(){
    this.state = "FALLING"
    this.type = TILE_TYPES[Math.floor(Math.random()*TILE_TYPES.length)]
    this.x
    this.y
    this.h
    this.w
  }
  /*
  Drop each tic,
  if a tile lands on a landed tile, the clump breaks into vertical stacks that fall to the bottom
  */
  draw() {
    rect(this.x, this.y, this.h, this.w)
  }
}

let board = {rows: 10, cols: 3}

function setup() {
  board.tile = make2DArray(board.rows, board.cols, 0)
  board.tile[2][1].state = "⭕"
  do2D(board, (i, j) => {board.tile[i][j].x = i*TILE_SIZE
  board.tile[i][j].y = j*TILE_SIZE
  })
  textOutput()
  textAlign(CENTER, CENTER)
  createCanvas(canvasW, canvasH)
}
function draw() {
  background(bgColor)
  fill(0)
  stroke(0)
  circle(100,100,100)
  
  board.tile.forEach(row => row.forEach(col => rect(row*10, col*10, 10, 10)))
  do2D(board, (i, j) => text(board.tile[i][j].state, board.tile[i][j].x, board.tile[i][j].y))
 
  if (game.state == 0) {
    
  } else if (game.state == 1) {
    
  } else if (game.state == 2) {
    
  } else if (game.state == 3) {
    
  } 
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