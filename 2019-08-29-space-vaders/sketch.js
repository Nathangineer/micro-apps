// Description and date
//

let canvasW = 300
let canvasH = 300
let gameState = "START" // or "PLAYING" "WIN" "LOSE"


let ship;
let shipW = 15
let shipH = 20
let shipSpeed = 4
let killCount = 0;
let shipColor = "#F88"

let bulletMax = 12;
let bulletSpeed = 4
let bullets = Array(bulletMax);
let bulletCounter = 0; //Cycles from 0 to 10
let bulletColor ="#FD0"
let bulletTimer = 0
let bulletCooldown = 12 // frames

let alienRows = 5
let alienCols = 11
let totalAliens = alienRows * alienCols;
let aliens = Array(alienRows * alienCols);
let alienDist = 20
let alienW = 18
let alienH = 14
let alienColor = "#FAF"

class Ship {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = shipW
		this.h = shipH
		this.xVel = 0;
		this.maxSpeed = shipSpeed;
	}
	move(direction) {
		this.xVel = direction * this.maxSpeed;
	}
	update() {
		if (this.x < 0) { this.xVel = 1  * this.maxSpeed }
		else if (this.x > width) { this.xVel = -1 * this.maxSpeed }
		this.x += this.xVel;
	}
	draw() {
		rectMode(CENTER);
		fill(shipColor)
		quad(this.x - this.w / 4, this.y,
			 this.x + this.w / 4, this.y,
			 this.x + this.w, this.y + this.h,
			 this.x - this.w, this.y + this.h
		)
		//rect(this.x, this.y, shipW, shipH);
	}
}

class Bullet {
	constructor() {
		this.x = 10;
		this.y = 10;
		this.yVel = -bulletSpeed
		this.isFired = false;
	}
	update() {
		if (this.isFired === true) {
			this.y += this.yVel
		}
	}
	draw() {	
		if (this.isFired === true) {
			push()
			fill(bulletColor)
			noStroke()
			quad(this.x, this.y -5 , // TOP
				this.x + 3, this.y + 5, // RIGHT
				this.x, this.y + 25, // BOTTOM
				this.x - 3, this.y + 5  // LEFT
			)
			pop()
		}
	}
	fire(x, y) {
		this.isFired = true;
		this.x = x;
		this.y = y;
	}
	kill() {
		this.isFired = false;
		this.x = -100; // move off screen
	}
	get getPosition() {
		return {
			x : this.x,
			y : this.y
		}
	}
}

class Alien {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = alienW;
		this.h = alienH;
		this.speed = .5;
		this.direction = 1;
		this.dropTimer = 0; // Drop and change direction at 200?
		this.dropTimeMax = 150;
		this.dropDistance = 6;
		this.isAlive = true;
	}

	update() {
		this.x += this.speed * this.direction;
		this.dropTimer++;
		if (this.dropTimer > this.dropTimeMax) {
			this.direction *= -1;
			this.y += this.dropDistance;
			this.dropTimer = 0;
		}
	}
	
	draw(){
		rectMode(CORNER);
		fill(alienColor);
		quad(this.x, this.y,
			this.x + this.w / 2, this.y + this.h / 4,
			this.x + this.w, this.y,
			this.x + this.w / 2, this.y + this.h
		)
	}
	
	isHit(bullet) {
		return (
			bullet.x > this.x && 
			bullet.x < this.x + this.w && 
			bullet.y > this.y &&
			bullet.y < this.y + this.h
		)
	}
	
	destroy() {
		this.isAlive = false;
		this.y = height + 100;
	}
	
}


function setup() {
	createCanvas(canvasW, canvasH);
	
	// render background one time
	bg = createGraphics(canvasW, canvasH);

	// Draw to the graphics buffer.
	bg.background(0);
	for (let i = 0; i < 1000; i++){
		bg.fill(random(255))
		bg.noStroke()
		bg.circle(random(canvasW), random(canvasH), random(2.5));
	}
	ship = new Ship(width/2, height - shipH + 1);
	
	for (let i = 0; i < aliens.length; i++) {
		let x = (i % alienCols)*alienDist + 5
		let y = floor(i / alienCols)*alienDist*.8 + 10
		aliens[i] = new Alien(x, y);
	}

	for (let i = 0; i < bullets.length; i++) {
		bullets[i] = new Bullet();
	}
}

function reset() {
	ship = new Ship(width/2, height - 10);
	killCount = 0

	aliens = Array(totalAliens)
	for (let i = 0; i < aliens.length; i++) {
		let x = (i % alienCols)*alienDist + 5
		let y = floor(i / alienCols)*alienDist + 10
		aliens[i] = new Alien(x, y);
	}

	bullets = Array(bulletMax)
	bulletCounter = 0
	for (let i = 0; i < bullets.length; i++) {
		bullets[i] = new Bullet();
	}
    gameState = "PLAYING"
}
function draw() {
	background(0);
	image(bg, 0, 0);

    if (gameState === "START") {
		for (let i = 0; i < aliens.length; i++) {
			aliens[i].draw()
		}
		
		ship.draw();
		push()
			textSize(100)
			fill(255, 50); stroke(128, 180);
			strokeWeight(10)
			textAlign(CENTER, CENTER)
			text("▶", canvasW / 2, canvasH / 2)
		pop()
        noLoop()
    }
    else if (gameState === "PLAYING") {
		readControls()
		for (let i = 0; i < aliens.length; i++) {
			aliens[i].update();
			aliens[i].draw()
		}
		
		for (let i = 0; i < bullets.length; i++) {
			bullets[i].update();
			bullets[i].draw();
			for (let j = 0; j < aliens.length; j++) {
				if (aliens[j].isHit(bullets[i].getPosition)) {
					aliens[j].destroy();
					bullets[i].kill();
					killCount++;
				}
			}
		}
		if (killCount >= totalAliens) {
			fill(255); textSize(30); 
			textAlign(CENTER, CENTER);
        	gameState = "WIN"
		}
		ship.update();
		ship.draw();
    } 
    if (gameState === "WIN") {
		text('THE UNIVERSE IS\nSAVED FOREVER!\nDO IT AGAIN?', canvasW / 2, canvasH / 2);
        noLoop()
    }   
}

function input(clicked = false) {
    if (gameState === "START") {
        gameState = "PLAYING"
        loop()
    }
    else if (gameState === "WIN" || gameState === "LOSE") {
        reset()
        loop()
    }
}


function readControls() {
    // Steering
    if (keyIsDown(LEFT_ARROW)) {
        ship.move(-1);
    } else if (keyIsDown(RIGHT_ARROW)) {
        ship.move(1);
    } else {
        ship.move(0)
    }
    if (keyIsDown(LEFT_ARROW) && keyIsDown(RIGHT_ARROW)) {
        ship.move(0);
    }

	// mouse controls
	if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
		if (mouseX < ship.x) {
			ship.move(-1);
		} else {
			ship.move(1);
		}

	}
    
    //shoot
    bulletTimer++
	if (bulletTimer > bulletCooldown) {
		if (keyIsDown(32) || keyIsDown(38) || keyIsDown(87) || mouseIsPressed) { // keyIsDown(UP_ARROW)
			// Shoot bullet        
			bullets[bulletCounter].fire(ship.x, ship.y);  // Changed from x/y to x/y
			bulletCounter++
			if (bulletCounter > bulletMax - 1) { 
				bulletCounter = 0;
			}
			bulletTimer = 0
		}
		console.log(keyCode)
	} 
}		

function keyPressed() {
	input()
}
function mousePressed() {
	input(true)
}


