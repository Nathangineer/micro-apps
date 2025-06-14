/******************************************************************************
Name
Date
Description
Circles motorcycle game. You drive a single tire. You 
can jump by holding and releasing your physics based (cheesable)
spring and mass system in the vertical direction.
Either a design of a unicycle with a heavy seat that bobs up
and down, or the same weight, kept visible on the side(s) of 
the tire. The spring and mass are always actively influencing
your movement, but perhaps you can learn to use that
weakness for good. The traction will interact with different
surfaces differently. I want mud driving physics in my wheel game!

But first, an attempt to get three types of collisions working:
- Circle and circle
- Circle and point
- Circle and line

The direction vector is mirrored when object hits a wall
The normal direction is scaled down by low elasticity
The parallel direction can be slowed down by friction
So all of these are possible
        
Ball /     Ball     Ball|      Ball
   \/       \_____     \|       \.(stops)
  WALL     WALL       WALL      WALL
100% Elast 0% Elast   0% Elast 100% Elast
  0% Frict 0% Frict 100% Frict 100% Frict
"BOUNCE"    "SLIDE"    "???"     "FLOP"

Hit detection can have a bonus radius that adds extra
springiness or friction if close enough.

For rolling, there are two variable for the ball:
- Moment of inertia. Harder to spin if heavier or weight at outstide.
- Friction. Is there perfect grip of the tire? or did you lose friction because it's wet.

******************************************************************************/

let canvasW = 300
let canvasH = 300
let bgColor = "#888"
let lineWeight = 1
let game = {state: 0}
let TILE_SIZE = 25

let circ = {}
let point1 = {}



const materials = []





class Ball {
  constructor(x, y, radius) {
    this.pos = createVector(x, y)
    this.vel = createVector(0, 0)
    this.acc = createVector(0, .01)
    this.norms = []          // corresponding list of normal vectors generated from the points?
    this.radius = radius
    this.grip_radius = 14
    this.elasticity = 1
    this.friction = 0
    this.mass = 1 // only matters for collisions with other movable objects
    this.rotational_intertia = 1 // mass * radius^2 (if mass was all at that radius, like in a ring or at six point along that ring etc.)
  }
  collide(event) {
    this.vel.reflect(event.normal)
    // target.elasticity
  }
  show() {
    circle(this.pos.x, this.pos.y, this.radius * 2)
  }
  move() {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
  }
}

class Vertex {
  constructor(Positions, material){
    this.point = 1  
    this.material = material
  } 
}
class Edge {
  constructor(Positions, attribute){
    
  }
}


class Solid_Polygon {
  constructor(points = []) {
    this.points = [{pos: createVector(50, 200), type: "STONE"},
                   {pos: createVector(200, 200), type: "STONE"},
                   {pos: createVector(200, 220), type: "STONE"},
                   {pos: createVector(50, 220), type: "STONE"}]
  }
  add_point(point){
    this.points.push(point)
  }
  getType(index) {
    return this.points[index].type
  }
  getLine(index) {
    return createVector(this.points[index].pos, this.points[index + 1].pos) 
    // case for last point is wrap around to first
  }
  getNormal(index){
  }
  show(){
    this.points.forEach((p, i) => line(p.pos.x, p.pos.y, this.points[i+1].x, this.points[i+1].x))
  }
}
/* Solid Polygon format:
Each point forms a line with the next point, except for the last point,
which will automatically connect to the first. The points in order define a closed loop, with a clear
"inside" and "outside" define by the righthand rule: if a line
is pointing up, the out-of-bounds portion is on the right side.
The "type" determines the surface text between that point and the NEXT point.
Types can be "NO_SLIP" (default) "SLIP" "REFLECT" "SLING_SHOT" "SAND" "BOOSTER"
   1 <--- 4    player
   |      ^    1 -> 2
   V playr|    ^ OOBv
   2 ---> 3    4 <- 4
      OOB   */
 
let ball
let polygon

function setup() {
  ball = new Ball(canvasW/2 - .035, 80, 20)
  polygon = new Solid_Polygon()
  textOutput()
  textAlign(CENTER, CENTER)
  createCanvas(canvasW, canvasH)
  
  vertex1 = createVector(150, 150)
}
function draw() {

  background(bgColor)
  fill(0)
  stroke(0)
  circle(vertex1.x, vertex1.y, 3)
  
  // check for collision for each object pair
  let collisionEvent = Circle_To_Vertex(ball, vertex1)
  // if collision, send a bounce signal to each object with each other's properties.  
  // (bounce signals for walls may be used for animations)
  if (collisionEvent) {
    ball.collide(collisionEvent)
    console.log(collisionEvent)
  }
  // after all that, move objects with sum of velocity vectors, mostly for if a ball is in a corner.
  ball.move()
  ball.show()
  
  if (game.state == 0) {} 
}


function Circle_To_Vertex(circle, vertex) {
  if (p5.Vector.dist(circle.pos, vertex) <= circle.radius) {
    console.log("hit")
    let normal = p5.Vector.sub(circle.pos, vertex)
    console.log(normal)
    let dist = normal.mag()
    return {
      distance: dist, 
      normal: normal, 
      surface_material: "NONE?", 
      object_material: circle.material
    }
      
  } else {
    return false
  }
}


function keyPressed() {
  if (keyCode == 38) {
    paddle[0].dir = -1
  }
  if (keyCode == 40) {
    paddle[0].dir = 1
  }
  console.log(key + "  " + keyCode)
}