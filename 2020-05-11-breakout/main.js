const WIDTH = 300;
const HEIGHT = 300;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  gamestate = new Gamestate();
}

function draw() {
  gamestate.update();
}

function keyPressed() {
	gamestate.control(keyCode)
}