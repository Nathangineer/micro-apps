let canvasW = 300
let canvasH = 300

let towers
const numDisks = 8
const minDiskWidth = 30
const maxDiskWidth = 95
const diskHeight = 25
const towerX = [55, 150, 245]
let baseY = canvasH - 70
let buttonY = baseY + 15
let pegHeight = diskHeight * (numDisks + 0.25)
let buttonsOld = []
let buttons = []


class Button {
  constructor(name, x, y, w, h, from, to) {
    this.name = name
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.from = from
    this.to = to
  }
  click() {
    if (mouseX > this.x && mouseX < this.x + this.w &&
        mouseY > this.y && mouseY < this.y + this.h) {
          moveDisk(this.from, this.to)
          console.log(this.name)
    }
  }
  show() {
    let movable = moveDisk(this.from, this.to, false)
    stroke(0)
    strokeWeight(3)
    movable ? fill(80, 250, 80) : fill(128)
    rect(this.x, this.y, this.w, this.h, 5)
    noStroke()
    movable ? fill(0) : fill(64)
    textAlign(CENTER, CENTER)
    textSize(30)
    text(this.name, this.x + this.w/2, this.y + this.h/2+1)
  }
}


function setup() {
    const canvas = createCanvas(canvasW, canvasH)

    resetGame()
    createButtons()
    //shuffleDisks()
}

function draw() {
    background(30, 0, 30)
    drawTowers()
    drawDisks()
    buttons.forEach(b => b.show())
}

function drawTowers() {
    // Draw pegs
    strokeCap(SQUARE)
    strokeWeight(5)
    for (let i = 0; i < 3; i++) {
        stroke(128) // Dark brown
        line(towerX[i] - 2, baseY, towerX[i] - 2, baseY - pegHeight)
        stroke(220)
        line(towerX[i] + 2, baseY, towerX[i] + 2, baseY - pegHeight)
    }

    // Draw base
    noStroke()
    fill(40) // Brown
    rect(0, baseY, canvasW, height)
}

function drawDisks() {
    noStroke()
    for (let towerIdx = 0; towerIdx < 3; towerIdx++) {
        for (let diskIdx = 0; diskIdx < towers[towerIdx].length; diskIdx++) {
            const diskSize = towers[towerIdx][diskIdx]
            const diskW = minDiskWidth + (diskSize - 1) *
                          (maxDiskWidth - minDiskWidth) / (numDisks-1)
            const x = towerX[towerIdx] - diskW/2
            const y = baseY - (diskIdx+1) * diskHeight

            // Color based on disk size
            colorMode(HSB)
            fill(map(diskW, minDiskWidth, maxDiskWidth, 0, 360), 100, 90)
            rect(x, y, diskW, diskHeight, 5)
            fill(map(diskW, minDiskWidth, maxDiskWidth, 0, 360), 100, 100)
            rect(x + diskW/3, y, diskW - diskW/2, diskHeight, 0)
            rect(x + diskW/3, y, diskW - diskW/3, diskHeight, 5)
            colorMode(RGB)
        }
    }
}

function createButtons() {
    const container = select('#button-container')
    const directions = [
        {from: 0, to: 2, name:`◄`},
        {from: 0, to: 1, name:`►`},
        {from: 1, to: 0, name:`◄`},
        {from: 1, to: 2, name:`►`},
        {from: 2, to: 1, name:`◄`},
        {from: 2, to: 0, name:`►`}
    ]

    directions.forEach((dir, i) => { //(name, x, y, w, h, callback)
        buttons.push(new Button(
          `${dir.name}`,
           10 + 47.5 * i + ((i+1) % 2)*4, buttonY, 40, 40,
          dir.from, dir.to
        ))
    })
}

function moveDisk(from, to, move = true) {
    if (towers[from].length === 0) return // Source tower empty

    const sourceTop = towers[from][towers[from].length-1]
    const targetTop = towers[to][towers[to].length-1]

    // Check move validity
    if (towers[to].length === 0 || sourceTop < targetTop) {
      if (move) {
        const disk = towers[from].pop()
        towers[to].push(disk)
      } else {
        return true
      }
      return false
    }
}

function resetGame() {
    towers = [[], [], []]
    // Initialize first tower with disks (largest at bottom)
    for (let i = numDisks; i > 0; i--) {
        towers[0].push(i)
    }
}


function shuffleDisks() {
    for (let i = 0; i < 10000; i++) {
        moveDisk(random([0, 1, 2]), random([0, 1, 2]))
    }
}

function mousePressed() {
  buttons.forEach(b => b.click())
}

/*
function setup() {
  createCanvas(300, 300, WEBGL)

  angleMode(DEGREES)

  // Use a normal material, which uses color to illustrate what direction each face of the geometry is pointing
  normalMaterial()
}

function draw() {
  background(250)
  stroke(0)

  // Cylinder
  push()
  rotateX(-20)
  translate(0, 0, 0)
  rotateWithFrameCount()
  cylinder(70, 10, 24)
  translate(0, 10, 0)
  cylinder(80, 10, 24)
  pop()

  push()
  rotateX(-20)
  translate(0, -10, 0)
  rotateWithFrameCount()
  cylinder(70, 10, 24)
  translate(0, 30, 0)
  cylinder(80, 10, 24)
  pop()
}

// Rotate 1 degree per frame along all three axes
function rotateWithFrameCount() {
  //rotateZ(frameCount)
  //rotateX(frameCount)
  rotateY(frameCount)
}*/