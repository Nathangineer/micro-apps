let canvasW = 300
let canvasH = 300

let towers;
const numDisks = 10;
const minDiskWidth = 20;
const maxDiskWidth = 95;
const diskHeight = 25;
let baseY = canvasH - 10
let pegHeight = diskHeight * (numDisks + 1);
const towerX = [60, 150, 240];
let buttonsOld = [];
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
    stroke(0, 100)
    strokeWeight(1)
    movable ? fill(255, 100) : fill(128, 100)
    rect(this.x, this.y, this.w, this.h)
    noStroke()
    fill(0)
    textAlign(LEFT, TOP)
    text(this.name, this.x, this.y)
  }
}


function setup() {
    const canvas = createCanvas(canvasW, canvasH);
    
    resetGame();
    createButtons();
    shuffly()
}

function draw() {
    background(240);
    drawTowers();
    drawDisks();
    buttons.forEach(b => b.show())
}

function drawTowers() {
    // Draw base
    fill(139, 69, 19); // Brown
    rect(0, baseY, canvasW, 20);
    
    // Draw pegs
    strokeWeight(5);
    stroke(101, 67, 33); // Dark brown
    for (let i = 0; i < 3; i++) {
        line(towerX[i], baseY, towerX[i], baseY - pegHeight);
    }
}

function drawDisks() {
    noStroke();
    for (let towerIdx = 0; towerIdx < 3; towerIdx++) {
        for (let diskIdx = 0; diskIdx < towers[towerIdx].length; diskIdx++) {
            const diskSize = towers[towerIdx][diskIdx];
            const diskW = minDiskWidth + (diskSize-1) * 
                          (maxDiskWidth - minDiskWidth) / (numDisks-1);
            const x = towerX[towerIdx] - diskW/2;
            const y = baseY - (diskIdx+1) * diskHeight;
            
            // Color based on disk size
            colorMode(HSB)
            fill(map(diskW, minDiskWidth, maxDiskWidth, 0, 360), 100, 100);
            rect(x, y, diskW, diskHeight, 5);
            colorMode(RGB)
        }
    }
}

function createButtons() {
    const container = select('#button-container');
    const directions = [
        {from: 0, to: 1}, {from: 0, to: 2},
        {from: 1, to: 0}, {from: 1, to: 2},
        {from: 2, to: 0}, {from: 2, to: 1}
    ];

    directions.forEach((dir, i) => { //(name, x, y, w, h, callback)
        buttons.push(new Button(
          `T${dir.from} → T${dir.to}`,
          0, 30*i, 50, 20,
          dir.from, dir.to
        ))
    })
    // Add reset button
    //const resetBtn = createButton('Reset Game').mousePressed(resetGame)
    //const suffleBtn = createButton('Shuffle x10000').mousePressed(shuffly)
}

function moveDisk(from, to, move = true) {
    if (towers[from].length === 0) return; // Source tower empty
    
    const sourceTop = towers[from][towers[from].length-1];
    const targetTop = towers[to][towers[to].length-1];
    
    // Check move validity
    if (towers[to].length === 0 || sourceTop < targetTop) {
      if (move) {
        const disk = towers[from].pop();
        towers[to].push(disk);
      } else {
        return true
      }
      return false
    }
}

function resetGame() {
    towers = [[], [], []];
    // Initialize first tower with disks (largest at bottom)
    for (let i = numDisks; i > 0; i--) {
        towers[0].push(i);
    }
}


function shuffly() {
    for (let i = 0; i < 100; i++) {
      moveDisk(random([0, 1, 2]), random([0, 1, 2]))
    }
}

function mousePressed() {
  buttons.forEach(b => b.click());
}

/*
function setup() {
  createCanvas(300, 300, WEBGL);

  angleMode(DEGREES);

  // Use a normal material, which uses color to illustrate what direction each face of the geometry is pointing
  normalMaterial();
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