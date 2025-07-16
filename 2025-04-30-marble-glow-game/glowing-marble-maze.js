// background screen  https://editor.p5js.org/xinxin/sketches/f_-25cGx9
// gradient
//movement feel like super monkey ball
// make sure forces are applied evenly in all directions. No bunnyhopping
// Glow Tadpole
// Explore a dark pond and other locales
// In Glow Tadpole you play as Glow Tadpole
// constants are objects to act, not be acted upon

/*! p5.fillgradient v0.1.2 (c) 2024 Jorge Moreno, @alterebro */
"use strict";p5.prototype.fillGradient=function(){let o=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"linear";var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};let r=2<arguments.length&&void 0!==arguments[2]&&arguments[2];var e={linear:{from:[0,0],to:[width,height],steps:[color(255),color(0,96,164),color(0)]},radial:{from:[width/2,height/2,0],to:[width/2,height/2,max(width/2,height/2)],steps:[color(255),color(0,96,164),color(0)]},conic:{from:[width/2,height/2,90],steps:[color(255),color(0,96,164),color(0)]}};let a=o.toLowerCase(),i=(a=e[a]?a:"linear",Object.assign(e[a],t)),l=(r?r.canvas:canvas).getContext("2d"),n={linear:()=>l.createLinearGradient(i.from[0],i.from[1],i.to[0],i.to[1]),radial:()=>l.createRadialGradient(i.from[0],i.from[1],i.from[2],i.to[0],i.to[1],i.to[2]),conic:()=>l.createConicGradient(radians(i.from[2]),i.from[0],i.from[1])},c=n[a]();i.steps.forEach((o,t)=>{o=Array.isArray(o)?o:[o],t=o[1]||t/(i.steps.length-1),t=Math.min(1,Math.max(0,t));c.addColorStop(t,o[0])}),l.fillStyle=c};

const WIDTH = 300;
const HEIGHT = 300;

const PLAYER_ACCEL = .25
const PLAYER_MAX_SPEED = 2
const PLAYER_SIZE = 20
const PLAYER_COLOR = "#00f"
const PLAYER_DRAG = .95
const RAY_RESOLUTION = 5 // This is very low
let walls = [];
let wallCount = 3;
let particle;
let player;


function setup() {
	createCanvas(WIDTH, HEIGHT);
	
	player = new Player(101, 101)
  particle = new Particle();
	for (let i = 0 ; i < wallCount ; i++){
		walls.push(new Wall(random(WIDTH), random(HEIGHT),
				            random(WIDTH), random(HEIGHT),));
	}
	walls.push(new Wall(0, 0, WIDTH, 0));
	walls.push(new Wall(WIDTH, 0, WIDTH, HEIGHT));
	walls.push(new Wall(WIDTH, HEIGHT, 0, HEIGHT));
	walls.push(new Wall(0, HEIGHT, 0, 0));
}

function draw() {
  blendMode(DARKEST)
	background(0);

  push();

  blendMode(SCREEN)
	particle.update(player.p.x, player.p.y);
	particle.look(walls);
  blendMode(BLEND)
  
  player.control()
  
  player.move()
  player.show()
  player.collision(walls)
  
  pop()
  fill(255, 10, 10)
  
  circle(200,200,200)  
}

function CircleLineCollision(Point, Radius, LineA, LineB) {
  // if distance from line is less than diameter
  let LineDir = p5.Vector.sub(LineB, LineA) //u
  let distance = p5.Vector.mag(
                   p5.Vector.cross(p5.Vector.sub(Point, LineA), (LineDir)) 
                 ) / LineDir.mag()
  if (distance < Radius) {
    // Check if point is within perpendicular bounds of line
    let Point1 = p5.Vector.sub(player.p, LineA)
    let Point2 = p5.Vector.sub(player.p, LineB)
    let Dot1 = p5.Vector.dot(Point1, LineDir)
    let Dot2 = p5.Vector.dot(Point2, LineDir)
    console.log(Dot1)
    if (Dot1 > 0 && Dot2 < 0) {
      console.log("Collide")
      // If inside the wall, move out of it
      let OrthoLine = p5.Vector.normalize(createVector(-LineDir.y, LineDir.x))
      let Direction1 = p5.Vector.cross(LineDir, Point1)
      Direction1 = Direction1.z
      if (Direction1 < 0) {
        OrthoLine.mult(-1)
      }
      player.p.add(OrthoLine.mult(distance - player.r + p5.Vector.mag(player.v)) )
      return "LINE"
    } else if (p5.Vector.mag(p5.Vector.sub(player.p, LineA)) < player.r) {
      // Mirror the direction vector
      let PointToCircle = p5.Vector.sub(player.p, Dot1)
      PointToCircle.normalize()
      let dotProduct = p5.Vector.dot(PointToCircle, player.v) * 2

      player.v = player.v.add(p5.Vector.mult(p5.Vector.normalize(player.v), dotProduct))
      //player.p.add(PointToCircle.mult(distance - player.r+1)) // + p5.Vector.mag(player.v)) )
      
      // If inside the wall, move out of it
      // If distance < radius
      //PointToCircle = p5.Vector.sub(PointToCircle, Point1)
      //PointToCircle = PointToCircle.z
      
      
      
      
      console.log("pointA")      
      return "POINT"
    } else if (p5.Vector.mag(p5.Vector.sub(player.p, LineB)) < player.r) {
      console.log("pointB")
      return "POINT"
    }
  }
  //console.log(distance)
  return false
  
  //return CircleLineCollision(player.pos, PLAYER_SIZE, this.a, this.b)
    // if center point of circle is within perpendicular bounds of line
      // reflect direction
    // if center point out of bounds
      // CirclePointCollision(circle, near point)
}
function CirclePointCollision(circleX, circleR, pointX, pointY) {
  // if distance is less than radius
  let Point = createVector(pointX, pointY)
    // reflect direction 
}
/////////////////////////////////////////////////////////////////////
class Player {
	constructor (pos1x, pos1y){
		this.p = createVector(pos1x, pos1y)
    this.v = createVector(0, 0)
    this.a = createVector(0, 0)
    this.accel = PLAYER_ACCEL
    this.r = PLAYER_SIZE / 2
	}
  control(){
    this.dir = createVector(0, 0)
    //console.log(this.dir)
    if (keyIsDown(UP_ARROW)) {
      this.dir.y += -1
    } if (keyIsDown(DOWN_ARROW)) {
      this.dir.y += 1
    } if (keyIsDown(LEFT_ARROW)) {
      this.dir.x += -1
    } if (keyIsDown(RIGHT_ARROW)) {
      this.dir.x += 1
    }
    this.dir = this.dir.limit(1).mult(PLAYER_ACCEL) // No bunnyhopping
    if ( !keyIsDown(UP_ARROW) && 
         !keyIsDown(DOWN_ARROW) && 
         !keyIsDown(LEFT_ARROW) && 
         !keyIsDown(RIGHT_ARROW) ){
         this.v.mult(PLAYER_DRAG) // Apply drag if AFK
    }
    player.a.x = this.dir.x * this.accel
    player.a.y = this.dir.y * this.accel
    player.a.limit(this.accel)
  }
  move(){
    this.v = this.v.add(this.a)
    this.v.limit(PLAYER_MAX_SPEED)
    this.p = this.p.add(this.v)
  }
	show() {
		noStroke()
    strokeWeight(3)
    fill(PLAYER_COLOR)
		circle(this.p.x - this.v.x, this.p.y - this.v.y)
    circle(this.p.x, this.p.y, PLAYER_SIZE)
    // DRAW 3D DOTS IN THE MARBLE LIKE MARBLE MADNESS
	}
  collision(walls) {
    for (const wall of walls) {
      let result = CircleLineCollision(this.p, this.r, wall.a, wall.b) 
      if (result == "LINE") {
        this.reflect(wall)
      }
    }
  }

  reflect(wall) {
    //this.v flip direction away from line
    const LineNorm = p5.Vector.normalize(p5.Vector.sub(wall.b, wall.a))
    const Dot = p5.Vector.dot(this.v, LineNorm)
    this.v = p5.Vector.sub(p5.Vector.mult(LineNorm, (Dot * 2)) , this.v)
    this.a = p5.Vector.mult(p5.Vector.normalize(this.v), 5).add(1)
  }
  reflectPoint(point) {
    
  }
}
///////////////////////////////////

function keyReleased() {
  player.a = createVector(0, 0)
}

class Ray {
	constructor (pos, angle) {
		this.pos = pos;
		this.dir = p5.Vector.fromAngle(angle);
	}
	update() {
		this.pos = createVector(player.p.x, player.p.y);
	}
	cast(wall) {
		const x1 = wall.a.x;
		const y1 = wall.a.y;
		const x2 = wall.b.x;
		const y2 = wall.b.y;

		const x3 = this.pos.x;
		const y3 = this.pos.y;
		const x4 = this.pos.x + this.dir.x;
		const y4 = this.pos.y + this.dir.y;

		const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if (den == 0) {
			return;
		}

		const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
		const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
		if (t > 0 && t < 1 && u > 0) {
			const pt = createVector();
			pt.x = x1 + t * (x2 - x1);
			pt.y = y1 + t * (y2 - y1);
			return pt;
		} else {
			return;
		}
	}
}


class Wall {
	constructor (pos1x, pos1y, pos2x, pos2y){
		this.a = createVector(pos1x, pos1y);
		this.b = createVector(pos2x, pos2y);
	}
	show() {
		stroke(0);
    strokeWeight(3)
		line(this.a.x, this.a.y, this.b.x, this.b.y);
    circle(this.a.x, this.a.y, 10)
	}
}


class Particle {
	constructor(){
		this.pos = createVector(width / 2, height / 2);
		this.rays = [];
		for (let i = 0 ; i < 360 ; i += RAY_RESOLUTION){
			this.rays.push(new Ray(this.pos, radians(i)));
		}
	}
	update(x, y) {
		this.pos.set(x, y)
	}
  
	look(walls){
    noStroke()
    fillGradient('radial', {
    from : [player.p.x, player.p.y, 0], // x, y, radius
    to : [player.p.x, player.p.y, 500], // x, y, radius
    steps : [
        color(255),
        color(96, 96, 164),
        color(0)
            ] });
            
    beginShape()
		for (const ray of this.rays) {
			ray.update();
			let minDist = Infinity;
			let nearPoint = null;
      
			for (const wall of walls){
				let target = ray.cast(wall);
				if (target) {
					let targetDist = p5.Vector.dist(ray.pos, target)
					if (targetDist < minDist){
						minDist = targetDist;
						nearPoint = target;
            
					}
				}
			}
      
			if (nearPoint) {
				//line(this.pos.x, this.pos.y, nearPoint.x, nearPoint.y);
        vertex(nearPoint.x, nearPoint.y)
			}
		}	
    endShape()
		for (const wall of walls) {
			wall.show();
		}
	}
	
	
}