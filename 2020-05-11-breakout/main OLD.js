const canvasW = 300;
const canvasH = 300;

class Game {
  constructor(){
    this.state = "GAMEPLAY";
    this.gameplay = new Gameplay();
    this.menu = new Menu();
  }
  update() {
    switch (this.state) {
      case "GAMEPLAY":
        this.gameplay.update();
        break;
      case "MENU":
        this.menu.update();
        break;
      default:
        // pass
    }
  }
  changeState(state) {
    
  }
  control(keyCode){

  }    
}

class Gameplay {
  constructor(){
    this.ball = new Ball(canvasW / 3, canvasH * 0.8);
    this.paddle = new Paddle();
    this.bricks = [];
    for (let i = 0 ; i < 4 ; i++) {
      for (let j = 0 ; j < 6 ; j++) {
        this.bricks.push(new Brick(10 + i*canvasW / 4, 10 + j*30))
      }
    }
  }
  update(){
    this.checkCollision();
    this.ball.update();
    this.paddle.update();
    for (const brick of this.bricks) {
      brick.update();
    }    
    this.show()
  }
  show(){
    blendMode(DIFFERENCE);
    background(20, 40, 20, 150);
    blendMode(BLEND);
    this.ball.draw();
    this.paddle.draw();
    for (const brick of this.bricks) {
      brick.draw();
    }
  }
  checkCollision(){
    // Paddle collision
    if (this.ball.y + this.ball.h >= this.paddle.y) {
      if (this.ball.x + this.ball.w > this.paddle.x 
          && this.ball.x < this.paddle.x + this.paddle.w){
        if (this.ball.vy > 0 ) {this.ball.vy *= -1;}
        // Play sound
      }
    }
    // brick collision
    for (const brick of this.bricks) {
      let isHit = Collide.pointRect(this.ball, brick)
      if (isHit){
        const hitSide = Collide.pointRectSide(this.ball, brick)
        this.ball.collision(hitSide)
        brick.collision(isHit);
      }
    }
  }
}

class Collide {
  static pointRect(A, B) {
    if (A.x > B.x && A.x < B.x + B.w  &&
        A.y > B.y && A.y < B.y + B.h) {
      return true;
    }
    return false;
  }
  
  static pointRectSide(A, B) {
    if        (A.xOld < B.x && A.x >= B.x) {
      return "LEFT HIT"
    } else if (A.yOld < B.y && A.y >= B.y) {
      return "TOP HIT"
    } else if (A.xOld > B.x + B.w && A.x <= B.x + B.w) {
      return "RIGHT HIT"
    } else if (A.yOld > B.y + B.h && A.y <= B.y + B.h) {
      return "BOTTOM HIT"
    }
    return false;
  }    
}

// Ball is a point
class Ball {
  constructor(x, y){
    this.x = x
    this.y = y
    this.vx = 2
    this.vy = 2
    this.w = 5 //width
    this.h = 5 //height
  }
  
  update() {
    this.xOld = this.x
    this.yOld = this.y
    this.wallCollision()
    this.x += this.vx
    this.y += this.vy
  }
  
  draw() {
    noStroke();
    rectMode(CORNER);
    rect(this.x, this.y, this.w, this.h)
  }
  
  collision(type) {
    console.log(type)
    switch (type) {
      case "LEFT HIT":
        this.vx = -Math.abs(this.vx); break;
      case "RIGHT HIT":
        this.vx = Math.abs(this.vx); break;
      case "TOP HIT":
        this.vy = -Math.abs(this.vx); break;
      case "BOTTOM HIT":
        this.vy = Math.abs(this.vx); break;
    }
  }
  wallCollision(){
    if (this.x < 0 || this.x + this.w > width){
      this.vx *= -1;
    }    
    if (this.y < 0 || this.y + this.h > height){
      this.vy *= -1;
    }  
  }
}


class Paddle {
  constructor() {
    this.w = 50;
    this.h = 10;
    this.x = width / 2 - this.w / 2
    this.y = height - 30
    this.v = 0
    this.maxV = 5
  }
  update() {
    this._control()
    this.x += this.v
  }
  draw() {
    noStroke()
    rect(this.x, this.y, this.w, this.h, 5)
  }
  _control(){
    let leftIsDown = keyIsDown(LEFT_ARROW)
    let rightIsDown = keyIsDown(RIGHT_ARROW)
    this.v = 0
    if (leftIsDown  && rightIsDown) {
      this.v = 0
    }
    else if (leftIsDown) {
      this.v = -this.maxV
    }
    else if (rightIsDown) {
      this.v = this.maxV
    }
    else {
      this.v = 0
    }
  }
}


class Brick {
  constructor(x, y) {
    this.x = x
    this.y = y    
    this.w = 60;
    this.h = 20;
    this.isHit = false;
  }
  draw() {
    //stroke(120);
    noStroke()
    rect(this.x, this.y, this.w, this.h)
  } 
  update() {
    if (this.isHit){
      this.y += 1000
      this.x += 1000
      this.isHit = false
    }
  }
  collision(ball) {
    this.isHit = true;
  }
}


class Menu {
  
}

function setup() {
  createCanvas(canvasW, canvasH);
  game = new Game();
}

function draw() {
  game.update();
}

function keyPressed() {
	game.control(keyCode)
}
