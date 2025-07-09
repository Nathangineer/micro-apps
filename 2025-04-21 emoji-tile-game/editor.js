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

const file_name = 'level01.json'  // name for save and load
const tiles_bg0 = {
  0:"🟦", 1:"🟩", 2:"🧱", 3:"🟥", 4:"🟨",  
  5:"🪟", 6: "⬛", 7:"🟪", 8:"🟧", 9:"🟫",
} 
let current_tile = 1
const tiles_bg1 = {
  0: "🌹",
  1: "🌷",
  2: "🌻",
  3: "🚧",
  4: "🪜",
  5: "🪵",
  6: "⛰",
  7: "🚪",
  8: "🕸️",
  9: "🌊",
} 
const tiles_obj = {
  0: "🍄",
  1: "🐝",
  2: "👻",
  3: "🚧",
  4: "🪜",
  5: "👨🏻‍🌾",
  6: "💣",
  7: "🛒",
  8: "🚩",
  9: "🕷",
} 

const objects = {
  "A": "🧌",
  "B": "👻",
  "C": "🐮",
}
//💣🚪🕳🔥🌊💧🌕⚡📦🧊🚌
// Plants 🌷🌹🪻🌻🌱🪴🌵🌱🌳🌲🌴🍄🍄‍🟫
// terrain: 🧱𖣯🪟🪨🪵🗻🔳️🪜🚧⛺🏰🏚🖼️
// colors: 🟥🟧🟨🟩🟦🟪🟫⬛⬜🔳🔲
// train: 🚂🚃🚞 🚋🚀🛸🌪🌈🌈
//🏺⚱️💰🪙💎📀
// Movable 🛒🛴
// NPC 👨🏻‍🌾🎩👒🧢🎓👑☂️☔
// enemies 🐝🐇👻🐻
// Haunted house 🕸️🕸🕯️🔘
// player 🏃🚶🧍🏻‍🏋🏻‍♂️🤸🧎🧎‍➡️🧑‍🦯🧑‍🦯🧘🏻‍♀️🚴🤾🧚🧚‍🧚‍🧜🧜‍♂🧜‍♀‍➡👨‍🦼‍➡👩‍🦼👩‍🦼‍➡️🧑‍🦽🧑‍🦽‍➡
// 💃🕺🕴🤺🤺🏇🪦

let current_object = "A"
const EDITOR_SIZE = 300 // square
const MENU_WIDTH = 0
const tile_amt = 20
const tile_total = tile_amt ** 2
let tile_size = EDITOR_SIZE / tile_amt

let map_bg0 = new Array(tile_total).fill(0);
let map_bg1 = new Array(tile_total).fill(0);
let map_obj = new Array(tile_total).fill(0);


function setup() {
  textOutput() // Create screen reader accessible description
  createCanvas(EDITOR_SIZE +  MENU_WIDTH, EDITOR_SIZE).attribute("title","Press 1-9 to change tile type. S to save. L to load an example.")
  textAlign(CENTER, CENTER)
  textSize(tile_size)
}

function draw() {
  // Reset graphics
  background("#55A")
  
  // Edit board if mouse clicked in bounds
  if (mouseX > 0 && mouseY > 0 && mouseX < EDITOR_SIZE && mouseY < EDITOR_SIZE){
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
    text(symbol, (i*tile_size) % EDITOR_SIZE + tile_size / 2, 
    floor(i / tile_amt) * tile_size + tile_size / 2)
  }
  
  // Undo system for the screen tiles
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

function saveFile(saveMe) {
  save(map_bg0, 'xo.txt')
  showSaveFilePicker()
}

async function handleData(rawData) {
  wait(10000)
  new_map = []
  
  // Process each row string in the raw data
  for (let i = 0; i < tile_total; i++) {
    // Split the string by commas
    let new_map = rawData[i].split(',')
  }
  console.log(rawData)
  console.log(map_bg0)
  
  return(new_map)
}

function handleFailure(error){
  console.log(error)
}

/*
  // draw gridlines
  noFill()
  stroke(0, 0, 0, 0)
  for (let i = 0; i < tile_total; i++){
    rect((i * tile_size) % EDITOR_SIZE, 
         floor(i / tile_amt) * tile_size, 
         tile_size, tile_size)
  }
  fill(0)
*/