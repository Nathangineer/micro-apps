// 4-18
// Tile Editor. Should be able to output map file, and open map 
// file by drag and drop. Mapping will be done by clicking the 
// alway-open tile selector palette, and the drawn by clicking and 
// dragging the mouse in the 20x20 paintable area. Adding a by-tile 
// undo system would be nice. The buttons would include: an extendable 
// set of tiles, a save button, an undo button, and a load button. 
// No paint can tool, as the map isn't very big. Tiles cannot overlap 
// each other. Objects are placed on the layer above. Tiles in the 
// pallet have a two digit number assigned to them.

// 4-19
// Save and load features work. Add pallet and undo backup from time to time

var player_pos = {"x" : 0, "y" : 0}
var player_last_pos = {"x" : 0, "y" : 0}
var player_inventory = []

const SCREEN_SIZE = 400 // square
const MENU_WIDTH = 0
const tile_amt = 20
const tile_total = tile_amt ** 2
let tile_size = SCREEN_SIZE / tile_amt

function setup() {
  textOutput() // Create screen reader accessible description
  createCanvas(SCREEN_SIZE +  MENU_WIDTH, SCREEN_SIZE).attribute("title","Press 1-9 to change tile type. S to save")
  textAlign(CENTER, CENTER)
  textSize(20)
}

function draw() {
  // Reset graphics
  background("#55A")
  
  console.log(tile_size)
  // Edit board if mouse clicked in bounds
  if (mouseX > 0 && mouseY > 0 && mouseX < SCREEN_SIZE && mouseY < SCREEN_SIZE){
    var mouseIsOnCanvas = true
  }
  if (mouseIsPressed && mouseIsOnCanvas) {
    let coord_x = floor(mouseX / tile_size)
    let coord_y = floor(mouseY / tile_size)
    let index = coord_x + coord_y * tile_amt
    map_bg0[index] = current_tile
  }
  
  // Draw board
  for (let i = 0; i < tile_total; i++){
    let symbol = tiles_bg0[map_bg0[i]]
    text(symbol, (i*tile_size) % SCREEN_SIZE + tile_size / 2, 
    floor(i / tile_amt) * tile_size + tile_size / 2)
  }

  // draw gridlines
  noFill()
  stroke(0, 0, 0, 0)
  for (let i = 0; i < tile_total; i++){
    rect((i * tile_size) % SCREEN_SIZE, 
         floor(i / tile_amt) * tile_size, 
         tile_size, tile_size)
  }
  fill(0)
}

function keyPressed() {
  console.log("map_bg0", map_bg0)
  
  if (int(key) >= 0 && int(key) <= 9) { // Number
    current_tile = int(key)
  } else if (key === 's') { // Save
    saveJSON(map_bg0, file_name)
    console.log(map_bg0)
  } else if (key === 'l') { // Load
    map_bg0 = loadJSON(file_name)
  }
}

/*

*/