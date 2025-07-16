'use strict'

const WIDTH = 300;
const HEIGHT = 300;
let wave
let racer

class Wave {
  constructor(){
    //this.frameCount = 0;
    this.water = []
    this.waterLevel = height * 3/5;
    for (let i = -width/2 ; i < 0 ; i += 1) {
      this.water.push(sin(i/10)*8)
    }
  }
  
  update() {
    this.water.push(sin(frameCount/10)*8)
    this.water.shift(0, 1)
    this.frameCount++;
  }
  
  draw() {
    fill(0, 128, 255, 200)
    beginShape();
    vertex(0, height)
    for (let i = 0 ; i < width ; i += 1) {
      vertex(i * 2, this.water[i] + this.waterLevel)
    }
    vertex(width, height)
    endShape(CLOSE)
  }
}

class Racer {
  constructor() {
    this.x = 50
    this.y = 50
  }
  update() {

  }
  draw() {
    circle(this.x, this.y, 50)
  }
}

function setup() {
  createCanvas(WIDTH, HEIGHT)
  wave = new Wave()
  racer = new Racer()

}

function draw() {
  background(30)  
  wave.update()
  wave.draw()

  racer.draw()
}

function keyPressed() {
  if (key === "LEFT") {
    console.log("up")
  }
}