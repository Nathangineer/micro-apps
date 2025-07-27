// Basic, probably unfinished game of checkers. 2019/08/26
// Player turns:
// Player selects a piece that can move
// Player makes a legal move:
//   To an immediately diagonal non-occupied space
//   If space is occupied by enemy, they may jump it to non-occupied space
//   If enemy is jumped enemy dies
//   Player can make a jump-only move after any jump




class Tile {
  constructor (row, col, color) {
		this.x = row;
		this.y = col;
		this.piece = color; //'red' or 'black' or 'empty'
		this.king = false;
	}
	draw(tileSize = 10){
		if (this.piece === 'red') {
			fill (200, 0, 0);
			ellipse(
				this.x*tileSize + tileSize/2, 
				this.y*tileSize + tileSize/2, 
				tileSize*0.8, tileSize*0.8);
		}
		else if (this.piece === 'black') {
			fill (0, 0, 0);
			ellipse(
				this.x*tileSize + tileSize/2, 
				this.y*tileSize + tileSize/2, 
				tileSize*0.8, tileSize*0.8);
		}
		
	}
}

class Board {
    constructor (tileSize) {
        this.tileSize = tileSize
        this.board = [
            [0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [2,0,2,0,2,0,2,0],
            [0,2,0,2,0,2,0,2],
            [2,0,2,0,2,0,2,0],
        ];
        for (let row = 0; row < 8; row++){
            for (let col = 0; col < 8; col++){
                if (this.board[row][col] === 1){
                    this.board[row][col] = new Tile(col, row, 'red');
                }
                else if (this.board[row][col] === 2){
                    this.board[row][col] = new Tile(col, row, 'black');
                }
                else {
                    this.board[row][col] = new Tile(col, row, 'empty');
                }
            }
        }
    }
    
    draw() {
        // Draw the background
        let white = false;
        noStroke();
        for (let row = 0; row < 8; row++){
            for (let col = 0; col < 8; col++){
                if (white){ 
                    fill(100,150,150);
                    white = !white;
                }
                else {
                    fill(255);
                    white = !white;
                }
                rect(
                    col*this.tileSize, row*this.tileSize,
                    this.tileSize, this.tileSize
                );
                this.board[row][col].draw(this.tileSize);
            }
            white = !white;
        }
    }
}

// Begin drawing code

let board;
let gameState = 0;

function setup() {
	createCanvas(300, 300);
	board = new Board(width/8);
}

function draw() {
	board.draw();
	noLoop()
}

function mousePressed(){
	if (gameState === 0) {
		//Send mouse xy to Board object
	} 
	console.log('pressed');
}
