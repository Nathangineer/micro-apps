const WIDTH = 300;
const HEIGHT = 300;

let numberList;
let numberOfBars = 60
let state = 0;
let message = ""
const TEXT_SIZE = 20

function setup() {
  createCanvas(WIDTH, HEIGHT).attribute("title","Click to reset");
  numberList = new NumberList()
  frameRate(100)
  textAlign(LEFT,TOP)
  textSize(TEXT_SIZE)
}

function draw() {
  background(0);
  numberList.draw();
  if (state === 0) {
    numberList.shuffle()
    message = "Shuffling..."
  }
  if (state === 1){
    numberList.bubbleSort()
    message = "Sorting..."
  } else if (state === 2) {
    message = "Sorted"
    console.log("done")
    noLoop()
  }
  fill(255)
  text(message, 0, 0)
}

class NumberList {
  constructor() {
    this.l = numberOfBars
    this.barW = width/this.l
    this.yMag = width/this.l
    this.numbers = []
    for (let i = 0; i < this.l; i++) {
      this.numbers.push(Math.random()*this.l)
    }
    this.shuffleCount = 0
    this.bubbleSortIndex = 0
    this.unsortCount = 0
  }
  draw() {
    for (let i = 0; i < this.numbers.length; i++) {
      noStroke();
      colorMode(HSB)
      fill(200);
      let bright = i % 2 === 1 ? 100 : 75
      fill(map(this.numbers[i], 0, this.l, 0, 360), 100, bright)
      rect(
        i * this.barW,
        height,
        this.barW,
        -this.numbers[i] * this.yMag
      )
      colorMode(RGB)
    }
  }
  shuffle() {
    let rando = floor(random(0, this.l - this.shuffleCount))
    let temp = this.numbers.splice(rando, 1)[0]
    this.numbers.push(temp)
    this.shuffleCount++
    if (this.shuffleCount >= this.l) {
      state = 1
    }
  }
  bubbleSort(){
    if (this.bubbleSortIndex < this.l - 1) {
      this.bubbleSortIndex++
    } else {
      if (this.unsortCount === 0  && this.bubbleSortIndex >= this.l - 1) {
        state = 2
        return
      }
      this.bubbleSortIndex = 0
      this.unsortCount = 0
    }

    let i = this.bubbleSortIndex
    let compare1 = this.numbers[i]
    let compare2 = this.numbers[i+1]
    if (compare1 > compare2) {
      this.numbers[i] = compare2
      this.numbers[i+1] = compare1 
      this.unsortCount++
    } 

    fill(0, 0, 255);
    rect(
      i * this.barW,
      height,
      this.barW+0.5,
      -this.numbers[i] * this.yMag
    )
  }
}

function mouseReleased() {
  reset()
}

function reset() {
  state = 0;
  numberList = new NumberList()
  loop()
}
