// A basic 15-puzzle
// Some less-basic spinoff ideas:
//   - convert an image into a puzzle
//   - import an image, and have it auto-shuffle in 
//     front of you. Novel image corruption effect

let canvasW = 300;
let canvasH = 300;
let board;

// Custom image code
let customImage
let customTiles = new Array(16).fill(0);
let dropzone
let useCustomImage = false

let textMessage

class Board{
  constructor(){
    this.tileArr = this.createBoard();
    this.emptyPos = createVector(3, 3);
    this.won = false;
    this.customTiles = []
  }
  createBoard(){
    let candidateBoard;
    while (true) {
      candidateBoard = this.shuffleBoard();
      if (this.isSolvable(candidateBoard)) {
        break 
      }
    }
    
    let finalBoard = [];
    finalBoard.push(candidateBoard.slice(0, 4 ));
    finalBoard.push(candidateBoard.slice(4, 8 ));
    finalBoard.push(candidateBoard.slice(8, 12));
    finalBoard.push(candidateBoard.slice(12,16));
    return finalBoard;
  }
  shuffleBoard(){
    let list = ["1", "5", "9",  "13",  
                "2", "6", "10", "14",
                "3", "7", "11", "15", 
                "4", "8", "12"];
    for (let i = 0 ; i < list.length ; i++) {
      let randIndex = floor(random(list.length - i));
      let temp = list[randIndex];
      list.splice(randIndex, 1);
      list.push(temp);
    }
    list.push(" ");
    return list;
  }
  isSolvable(list) {
    let inversions = 0;
    for (let i = 0 ; i < list.length ; i++) {
      let a = list[i];
      for (let j = i ; j < list.length ; j++) {
        let b = list[j];
        if (a < b) {inversions++;}
      } 
    }
    if (inversions % 2 == 1){
      return true;
    } 
    else {
      return false;
    }
  }
  click(x, y) {
    let clicked = createVector(Math.trunc(x / (canvasW / 4)), Math.trunc(y / (canvasH / 4)))
    let empty = this.emptyPos
    console.log(`x:${clicked.x} y:${clicked.y}`)
    if (clicked.x == empty.x + 1 && clicked.y == empty.y) {
      this.moveTile("LEFT")
    } else if (clicked.x == empty.x - 1 && clicked.y == empty.y) {
      this.moveTile("RIGHT")
    } else if (clicked.y == empty.y + 1 && clicked.x == empty.x) {
      this.moveTile("UP")
    } else if (clicked.y == empty.y - 1 && clicked.x == empty.x) {
      this.moveTile("DOWN")
    }
  }
  legalMoves(){
    let moveList = [];
    if (this.emptyPos.x < 3) { moveList.push("LEFT") }
    if (this.emptyPos.x > 0) { moveList.push("RIGHT")}
    if (this.emptyPos.y < 3) { moveList.push("UP")   }  
    if (this.emptyPos.y > 0) { moveList.push("DOWN") }
    return moveList;
  }
  moveTile(moveDir) {
    if (this.won) {return}
    if ( this.legalMoves().includes(moveDir) ) {
      let slideTile = createVector(this.emptyPos.x, this.emptyPos.y);
      switch (moveDir) {
        case "LEFT":
          slideTile.x += 1;
          break;
        case "RIGHT":
          slideTile.x -= 1;
          break;
        case "UP":
          slideTile.y += 1;
          break;
        case "DOWN":
          slideTile.y -= 1;
          break;
      }
      let tempTile = this.tileArr[slideTile.x][slideTile.y];
      this.tileArr[slideTile.x][slideTile.y] = this.tileArr[this.emptyPos.x][this.emptyPos.y];
      this.tileArr[this.emptyPos.x][this.emptyPos.y] = tempTile;
      this.emptyPos = slideTile;
    }
  }

  show(){
    let tileSize = canvasW / this.tileArr.length;
    textAlign(CENTER, CENTER);
    textSize(tileSize / 2);
    rectMode(CENTER);
    for (let i = 0 ; i < this.tileArr.length ; i++){
      for (let j = 0 ; j < this.tileArr[0].length ; j++){
        if (this.tileArr[i][j] != " ") {
          fill(180);
          stroke(90);
          //600/60
          strokeWeight(canvasW/60);
          rect(i*tileSize + tileSize/2, j*tileSize + tileSize/2, tileSize-10, tileSize-10);
          
          fill(30);
          stroke(200);
          strokeWeight(10);
          text(this.tileArr[i][j], i*tileSize + tileSize/2, j*tileSize + tileSize/2);
        }
      }
    }

    if (useCustomImage) {
      imageMode(CENTER)
      for (let i = 0 ; i < this.tileArr.length ; i++){
        for (let j = 0 ; j < this.tileArr[0].length ; j++){
          if (this.tileArr[i][j] != " ") {
            image(customTiles[this.tileArr[i][j] - 1], i*tileSize + tileSize/2, j*tileSize + tileSize/2, tileSize, tileSize)
          }
        }
      }
      if (this.won === true) {
        image(customTiles[15], 3*tileSize + tileSize/2, 3*tileSize + tileSize/2, tileSize, tileSize)
      }
    }
  }

  checkWin(){
    let winList = ["1",  "2",  "3",  "4", 
                   "5",  "6",  "7",  "8",
                   "9",  "10", "11", "12",
                   "13", "14", "15", " "];
    let flatList = [];
    for (let i = 0 ; i < this.tileArr.length ; i++){
      for (let j = 0 ; j < this.tileArr[0].length ; j++){
        flatList.push(this.tileArr[j][i]);
      }
    }
    for (let i = 0 ; i < winList.length ; i++) {
      if (winList[i] != flatList[i]) { 
        return;
      }
    } 
    this.win();
  }
  win() {
    this.won = true;
    
    textAlign(CENTER, CENTER);
    textSize(height / 5);
    fill(0);
    stroke(240);
    strokeWeight(10);
    
    text("You win!", width / 2, height / 2.2);
    textSize(height / 13);
    text("Press space to restart", width / 2, height / 1.7);  
  }
  reset(){
    if (this.won){
      this.won = false;
      this.tileArr = this.createBoard();
    }
  }
}

function setup() {
  createCanvas(canvasW, canvasH).attribute("title","Drag and drop to use custom image.");
  board = new Board();

  dropzone = select('#defaultCanvas0');
  dropzone.dragOver(highlight);
  dropzone.dragLeave(unhighlight);
  dropzone.drop(gotFile, unhighlight);
}

function draw() {
  background(0);
  board.show();
  board.checkWin();

  if (textMessage) {
    fill(255);
    textAlign(CENTER, CENTER);
    text(textMessage, width/2, height/2);
  }
}

function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      board.moveTile("LEFT");
      break;
    case RIGHT_ARROW:
      board.moveTile("RIGHT");
      break;
    case UP_ARROW:
      board.moveTile("UP");
      break;
    case DOWN_ARROW:
      board.moveTile("DOWN");
      break;
  }
  if (keyCode == 32) {
    board.reset();
  }
}
function mousePressed() {
  board.click(mouseX, mouseY)
  board.reset() // reset if win
}



function gotFile(file) {
  customImage = loadImage(file.data, img => {
    // This callback runs when image is loaded
    processCustomImage(img);
    useCustomImage = true;
  });
}
function highlight() {
  textMessage = "📤\nLoad Custom Image (Local)"
}
function unhighlight() {
  dropzone.style('background-color', '#fff');
  textMessage = ""
}

function processCustomImage(img) {
  let tileSize = Math.min(img.width / 4, img.height / 4) // Assuming square image divided into 4x4 grid
  for (let i = 0; i < 16; i++) {
    let x = (i % 4) * tileSize;
    let y = floor(i / 4) * tileSize;
    customTiles[i] = img.get(x, y, tileSize, tileSize);
  }
}