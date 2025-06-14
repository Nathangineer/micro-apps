// A cool glider game, but some of the images don't
// load and I need to fix the key bindings
// morph the player into the shape of the arc?


const WIDTH = 800;
const HEIGHT = 400;

let player_tilt_up = 0
let player_tilt_down = 0
let player_going_right = true
let player_tilt_speed = .75 // degrees per frame
let player_pos
let player_dir
let player_vel
let player_bullets = []
let bullet_cooldown = 75 // ms
let bullet_timer = 0
let bullet_queued = false
let bullet_speed = 10

let camera_x = 0
let camera_player_offset = WIDTH / 2

class Bullet {
  constructor(pos, dir, vel) {
    this.pos = pos.copy().add(dir.copy().mult(25))
    this.dir = dir.copy()
    this.vel = vel.copy().normalize().mult(20)
    this.cooldown = 200 // ms
    this.cooldown_timer = 0
  }
  move() {
    this.pos.add(this.vel)
  }
  collide() {
    
  }
  show() {
    circle(this.pos.x, this.pos.y, 20)
  }
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  console.log("key bindings need to be patched");
  angleMode(DEGREES)

  player_pos = createVector(0, 20)  
  player_dir = createVector(1,  0)
  player_vel = createVector(2,  0)
}

function draw() {
  background(193, 245, 239);
  // draw background
  // I need a easier way to describe background elements and spacing.
  ellipse(-(camera_x % 4000)+2000, 50, 2000, 200)  
  rect(-(camera_x % WIDTH) + WIDTH, 270, 40, 150);
  fill(0, 153, 255);

  // move player
  player_dir.rotate((player_tilt_up - player_tilt_down) * player_tilt_speed)
  
  if (!player_going_right) {
    player_vel = createVector(-sqrt(player_pos.y) / 2, player_dir.heading()*.2)
  } else {
    player_vel = createVector(sqrt(player_pos.y) / 2, player_dir.heading()*.2)
    player_dir.setHeading(constrain(player_dir.heading(), -20, 20))
  }  
  

  player_pos.y += player_vel.y
  player_pos.x += player_vel.x
  player_pos.y = constrain(player_pos.y, 10, HEIGHT - 10)

  // shoot new bullet
  bullet_timer += deltaTime
  if (bullet_queued) {
    if (bullet_timer > bullet_cooldown) {
    player_bullets.push(new Bullet(player_pos, player_dir, player_vel))
    bullet_timer = 0
    }
  }
  
  // Draw things
  push()  
  {
    camera_x = player_pos.x - camera_player_offset
    translate(-camera_x, 0)
 
    // draw player
    push()
      translate(player_pos.x, player_pos.y)
      rotate(player_dir.heading())
      stroke(207, 180, 180);
      strokeWeight(5);
      line(-25, 0, 25, 0)
    pop()    
    
    // Draw bullets
    player_bullets.forEach(x => {x.move(); x.show()})   
  }
  pop() 
}

function constrain_angle(value, bound1, bound2) {
  value = value % 360
  
  limit1 = min(bound1, bound2)
  limit2 = max(bound1, bound2)
  
  let mid_point = (limit1 + limit2)/2
  let anti_mid_point = (mid_point + 180) % 360
  
  console.log(value)
  if (value > anti_mid_point && value < limit1) {
    return limit1
  } else if (value < anti_mid_point && value > limit2) {
    return limit2
  }
  return value
}

function keyPressed() {
  if (keyCode == 32) {
    bullet_queued = true
  }
  if (keyCode === RIGHT_ARROW   ) {
    player_tilt_up = 1
  }
  if (keyCode === LEFT_ARROW ) {
    player_tilt_down = 1
  }
  if (keyCode === 90 ) {
    player_going_right = !player_going_right
    player_dir.rotate(180)
  }
  console.log(keyCode)
}
function keyReleased() {
  if (keyCode == 32) {
    bullet_queued = false
  }
  if (keyCode === RIGHT_ARROW   ) {
    player_tilt_up = 0
  }
  if (keyCode === LEFT_ARROW ) {
    player_tilt_down = 0
  }
}