/* 
2025-05-13
This is an upgraded version of the snake game I made in 2020.
//reate a get colors functions to have a gradient from yellow, white, purple,
and black, which will be difficult to see.
*/

const X_TILES = 15
const Y_TILES = 15
const TILE_SIZE = 20
const WIDTH = X_TILES * TILE_SIZE
const HEIGHT = Y_TILES * TILE_SIZE
const TEXT_SIZE = TILE_SIZE * .9
const APPLE_SIZE = TILE_SIZE * .9
const GUI_HEIGHT = 30
const FRAME_RATE = 4
const BORDER_W = 8

// state variables
let game_state = 0
// 0: Title screen, 1: Game, 2: Game Over or High Score
let score = 0
let noTurns = 0 // straight lines
let turns = 0
let turnsRight = 0
let turnsLeft = 0
let angle = 0
let moves = 0
let input_received = false

let appleEyeVector


class Snake {
  constructor() {
    this.alive = true
    this.length = 2
    this.body = [
        {x: Math.floor(X_TILES / 2), y: 5},
        {x: Math.floor(X_TILES / 2), y: 6}
      ]
      this.direction = {
        x: 0,
        y: 1
      }
  }
  move() {
    if (this.alive == false){return}
      let max = this.body.length - 1
      this.body.push({
        x: this.body[max].x + this.direction.x,
        y: this.body[max].y + this.direction.y
    })
    if (this.checkCollision()){
      game_state = 2
      this.alive = false
      this.body.pop()
      return
    }
    if (this.body.length > this.length) {
      this.body.shift()
    }
    input_received = false
  }
  checkCollision() {
    //Edge-of-map collision
      let lastX = this.body.slice(-1)[0].x
      let lastY = this.body.slice(-1)[0].y
    if (lastX <= 0 || lastX >= X_TILES - 1){
      this.alive = false
      return true
    }
    if (lastY <= 0 || lastY >= Y_TILES - 1){
      this.alive = false
      return true
    }
    //Self collision
    let headPos = this.body.slice(-1)[0]
      for (let i = 0; i < this.body.length -1; i++) {
      if (lastX == this.body[i].x && lastY == this.body[i].y){
        this.alive = false
        return true
      }
    }
    return false
  }
  isAppleEdible(apple) {
    let lastX = this.body.slice(-1)[0].x
    let lastY = this.body.slice(-1)[0].y
    if (apple.x == lastX && apple.y == lastY) {
      this.length++
	  score++
      return true
    }
  }
  draw() {
    // this shouldn't be calculated every frame
    for (let i = 0; i < this.body.length; i++) {
      fill(
        196 + sin(i * PI/4 + PI)*64,
        196 - sin(i * PI/10 + PI/3)*64,
        196 + sin(i * PI/13 + PI/5)*64	  
      )
      rect(
        this.body[i].x * TILE_SIZE,
        this.body[i].y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
      )
    }
    // draw eyes
    push()
    translate(this.body[this.body.length-1].x * TILE_SIZE, this.body[this.body.length-1].y * TILE_SIZE)
    let eyeX = appleEyeVector.x * 2
    let eyeY = appleEyeVector.y * 2
    fill(255); circle(TILE_SIZE*.3       , 2       , 12)
    fill(255); circle(TILE_SIZE*.7       , 9       , 12)
    fill(0);   circle(TILE_SIZE*.3 + eyeX, 2 + eyeY, 5 )
    fill(0);   circle(TILE_SIZE*.7 + eyeX, 9 + eyeY, 5 )
    
    // draw tongue
    fill(128)
    //circle(eyeX + TILE_SIZE/2 + this.direction.x * TILE_SIZE/2, eyeY + TILE_SIZE/2 + this.direction.y*TILE_SIZE/2, 10)
    pop()
  }
  changeDirection(direction) {
    let v0 = this.direction
    let v1 = direction
    
    if (v0.x != -v1.x && v0.x != v1.x){   // what did I mean by this? where are the y vectors?
      turns = turns + 1
      // count left and right turns seperately
      let crossProduct = v0.x * v1.y - v0.y * v1.x
      if (crossProduct > 0) {
        turnsRight++
      } else if (crossProduct < 0) {
        turnsLeft++
      }
      input_received = true
      this.direction = direction
    }
  }
}

class Apple {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.isEaten = false
	}
	move(isEaten) {
		if (isEaten) {
			let onSnake = true
			while(onSnake){
				this.x = floor(random(1, X_TILES - 1))
				this.y = floor(random(1, Y_TILES - 1))
				for (let i = 0; i < snake.body.length; i++) {
					if ((this.x == snake.body[i].x && this.y == snake.body[i].y)){
						onSnake = true
						break
					}
					onSnake = false
				}
			}
		}
	}
	draw() {
		fill(230, 0, 0)
		textAlign(CENTER, CENTER)
		textSize(APPLE_SIZE)
		text('🍎', this.x * TILE_SIZE+TILE_SIZE/2, this.y * TILE_SIZE+TILE_SIZE/2)
    
    let snakex = snake.body.slice(-1)[0].x
    let snakey = snake.body.slice(-1)[0].y
    appleEyeVector = createVector(this.x - snakex, this.y - snakey)
    
    appleEyeVector.normalize()
    
    
	}
}

let snake = new Snake()
let apple = new Apple(9, 9)
let font
///////////////////////////////////////////////////////////////////////////////
function preload() {
  //font = loadFont("UbuntuMono-Bold.ttf")  
}
///////////////////////////////////////////////////////////////////////////////
function setup() {
  //textFont("Consolas")
	createCanvas(WIDTH, HEIGHT + GUI_HEIGHT)
	frameRate(FRAME_RATE)
  appleEyeVector = createVector(0, 0)
}
///////////////////////////////////////////////////////////////////////////////
function draw() {
	background(45, 0, 45)
  noStroke()
	fill(255)
	textAlign(CENTER, CENTER)
	textSize(TEXT_SIZE)
  textLeading(TEXT_SIZE*1.3)

  // draw border
	fill(0)
	strokeWeight(BORDER_W)
	stroke(50, 50, 255)
	rect(TILE_SIZE, TILE_SIZE, WIDTH - TILE_SIZE*2, HEIGHT - TILE_SIZE*2)
	noStroke() 

  snake.draw()
  if (game_state == 0) {
    fill(255)
    text("I'm hungry!", WIDTH/2, HEIGHT/2)
    if (input_received == true) {
      input_received = false
      game_state = 1
    }
  }
  if (game_state == 1) {
    let eaten = snake.isAppleEdible(apple)
    apple.move(eaten)
    apple.draw()
    snake.checkCollision()
    snake.move()
    moves++
  }  
  if (snake.alive == false){
    //game_state = 2
    fill(255)
    text("Ouch", WIDTH/2, HEIGHT/2)
    // = `You turned left 25% more than right. You moved an average of x spaces between apples.
    //You turned on 70% of moves, instead of moving forward. You rotated this many degrees CW: 1080,
    //which is 23 rotations.`
  }


  
	textSize(TEXT_SIZE); fill(255)
  noTurns = moves - turns
	text(
`🐍 ${score+2}   🍎 ${score}   👟 ${moves}
⬅️ ${turnsLeft}   ➡️ ${turnsRight}   ⬆️ ${noTurns}`, 0, HEIGHT+GUI_HEIGHT/4, WIDTH)
}
///////////////////////////////////////////////////////////////////////////////

function resetGame() {
  game_state = 0
  score = 0
  noTurns = 0
  turns = 0
  turnsRight = 0
  turnsLeft = 0
  angle = 0
  moves = 0
  input_received = false
  snake = new Snake()
  apple = new Apple(9, 9)
}

function keyPressed() {
  if (game_state == 0) {
    game_state = 1
  }
  if (game_state === 1) {
    if (input_received) {return}

    let moveDir = {x: 0,  y: 0}

    switch (keyCode) {
      case LEFT_ARROW:
        moveDir.x = -1
        break
      case RIGHT_ARROW:
        moveDir.x = 1
        break
      case UP_ARROW:
        moveDir.y = -1
        break
      case DOWN_ARROW:
        moveDir.y = 1
        break
    }
    if (moveDir.x != 0 || moveDir.y != 0){
      snake.changeDirection(moveDir)
    }
  
  }
  else if (game_state == 2) {
    resetGame()
  }

}