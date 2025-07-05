/******************************************************************************
Name
Date
Description
Dice game. Basically yahtzchee but the controls are minimal. There
is a button for ROLL, which always works, because the only other actions
are clicking dice to lock them or reorder them (Autosort options? Low to high?)
and clicking a category to lock your score in for the round. If you've rolled
three times, the ROLL button says PICK a score category. The categories are always
prepopulated with how many points you would get if you scored it with your current
dice. Should it be a scorecard? How many players should it allow? Keyboard shortcuts
to save dice and to roll. Touch enabled. Emoji for the dice buttons.

Then go crazy and make it 8 sided dice, and you you roll 8 of them for bespoke
categories, and then it's balatro and you have to use your dice under
increasingly weirder and weirder rules. Challenge the player by giving them
a D20 in place of one of their normal dice, but the rules are all the same.
You pull the five dice out of a grab bag, like scrabble. You can discard and draw
new dice between rounds. Crazy dice ideas:
Wrong side count: D2, D4, D8, D10, D20, D100
D6 with different arrangements of numbers: Only odds/evens, etc.
D6 with half one number, half another. Or with all one number.
Playing card. It doesn't roll. The number just is what it is.
Higher numbers on D6: 2 through 7, or all 7s
The zero dice. Can be used in small/large straights

Types (each type has dice that are styled differently.
Normal
- Standard D6
D&D Dice
- D4, D8, D10, D20, D100
Coin
- D2: 12 (01 16 67 6💯)
Pattern
- 113355 224466 (1357911 2468-10-12 02468-10 446688) 
Half-and-half D6s
- 12 13 14 15 16 23 24 25 26 34 35 36 45 46 56 (67 6-13 06 05
Same number
- 111111 222222 333333 444444 55555 66666 (777777 888888 000000) 
CARDS
- D1: A 2 3 4 5 6 7 8 9 10 J Q K

// UI for dice
// On roll, traditional-looking dice are scattered on the board in random positions and orientations
// Click on the dice you want to lock and it moves to the bottom, sorted from least to greatest


******************************************************************************/
'use strict'

let canvasW = 300
let canvasH = 300
let game = {state: 0}

let dice = [false, false, false, false, false]
let scores = []
let scoreTopSubtotal
let scoreTopBonus = 0
let scoreTopTotal
let yahtzeeCounter
let scoreLowerTotal
let scoreGrandTotal

let gameStates = ["CLICK TO START", "ROLL1", "ROLL2", "MUST_SCORE", "END"]
let gameState = gameStates[0] 
let rollTryCounter = 1
let rollTryMax = 3
let rollButton

// UI
const DICE_SIZE = 40
const SCORE_W = 45
const SCORE_H = 40
const BUTTON_H = 40
const PIP_DIST = DICE_SIZE / 3.6
const PIP_SIZE = 9
const DICE_Y = 85
const UPPER_Y = 118
const LOWER_Y = 210
const SPACING = 45
const MARGIN = 15

//colors
let bgColor = "#AAF"

let diceColor = "#000"
let diceFill = "#FFF"
let diceLockedColor = "#000"
let diceLockedFill = "#DDD"

let scoreEmptyColor = "#000000"
let scoreEmptyFill = "#FFFFFF"
let scorePreviewColor = "#222200"
let scorePreviewFill = "#0F0"
let scoreFinalColor = "#000"
let scoreFinalFill = "#CCC"
let scoreRadius = 0
let scoreTextSize = 9.5

let rollColor = "#000"
let rollFill = "#0F0"
let rollsOverFill = "#DDD"
let rollRadius = 20
let rollTextSize = 30


class Dice {
  constructor(x, y, value = false){
    this.x = x
    this.y = y
    this.w = DICE_SIZE
    this.h = DICE_SIZE
    this.value = 0
    this.active = false
    this.locked = false
    this.angle = 0
  }
  show(){
    push()
    translate(this.x, this.y)
    rotate(this.angle)
    if (this.active) {
      let outlineColor = this.locked ? diceLockedColor : diceColor
      let diceFillColor = this.locked ? diceLockedFill : diceFill
      strokeWeight(3); fill(diceFillColor); stroke(outlineColor)
      rectMode(CENTER, CENTER)
      rect(0, 0, this.w, this.h, 6)

      fill(outlineColor); noStroke();
      if ([4,5,6].includes(this.value)) circle(-PIP_DIST, -PIP_DIST, PIP_SIZE) // NW
      if ([6].includes(this.value)) circle(-PIP_DIST, 0, PIP_SIZE) // W
      if ([2,3,4,5,6].includes(this.value)) circle(-PIP_DIST, PIP_DIST, PIP_SIZE) // SW
      if ([1,3,5].includes(this.value)) circle(0, 0, PIP_SIZE) // MID
      if ([2,3,4,5,6].includes(this.value)) circle(PIP_DIST, -PIP_DIST, PIP_SIZE) // NE
      if ([6].includes(this.value)) circle(PIP_DIST, 0, PIP_SIZE) // E
      if ([4,5,6].includes(this.value)) circle(PIP_DIST, PIP_DIST, PIP_SIZE) // SE
      if (this.locked) {
          textAlign(CENTER,BOTTOM)
          stroke(0)
          textSize(22)
          text("🔒", 1, this.h / 2 + PIP_SIZE)
          textSize(12)
          text("🎲", 1, this.h / 2 + PIP_SIZE)
      }
    }
    pop()
  }
  click(x, y){
    if (this.active) {
      if (x > this.x - this.w / 2 && y > this.y - this.h / 2 && 
          x < this.x + this.w / 2 && y < this.y + this.h / 2) {
        this.locked = !this.locked
      }
    }
    if (this.locked) this.angle = 0
  }
  roll() {
    if (!this.locked) {
      this.value = Math.floor((Math.random() * 6)) + 1
      this.angle = (Math.random() * 2 * PI)
      this.active = true
    }
  }
  reset() {
      this.value = 0      
      this.active = false
      this.locked = false
  }
}

class RollButton {
    constructor(x, y){
        this.x = x
        this.y = y
        this.w = DICE_SIZE*6.5
        this.h = BUTTON_H
        this.text = "ROLL"
        this.active = true
    }
    show(){ 
        fill(rollFill);
        if (rollTryCounter === 1) {
            this.text = "ROLL"
        } else if (rollTryCounter === 2) {
            this.text = "REROLL"
        } else if (rollTryCounter === 3) {
            this.text = "FINAL ROLL"
        } else if (rollTryCounter === 4) {
            this.text = "CHOOSE SCORE"
            fill(rollsOverFill)
        }
   stroke(rollColor);  strokeWeight(3)
        rect(this.x, this.y, this.w, this.h, 20)

        fill(rollColor); noStroke()
        textSize(rollTextSize); textAlign(CENTER, CENTER)
        text(this.text, this.x+this.w/2, this.y+this.h/2)
    }
    click(x, y){
        if (x > this.x && y > this.y && 
            x < this.x + this.w && y < this.y + this.h  &&
            rollTryCounter <= rollTryMax) {
            dice.forEach(d => d.roll())
            rollTryCounter++
        }
    }
}
class ScoreButton {
    constructor(x, y, name, callback){
        this.x = x
        this.y = y
        this.w = SCORE_W
        this.h = SCORE_H
        this.scoreName = name
        this.callback = callback
        this.score = null
        this.textColor = "#000000"
        this.scoreFill = "#FFFFFF"
    }
    show(){
        let scoreValue
        // For actual score
        if (this.score != null) {
            this.textColor = scoreFinalColor
            this.scoreFill = scoreFinalFill
            scoreValue = this.score
            if (this.scoreName === "Yahtzee"  && this.scoreDice() > 0) {
              this.textColor = scorePreviewColor
              this.scoreFill = scorePreviewFill
            }
        } else {
            scoreValue = this.scoreDice()
            if (scoreValue != 0) {
              this.textColor = scorePreviewColor
              this.scoreFill = scorePreviewFill
            } else { // Potential score of 0
              this.textColor = scoreEmptyColor
              this.scoreFill = scoreEmptyFill
            }
        }
        fill(this.scoreFill); stroke(this.textColor); strokeWeight(2)
        rect(this.x, this.y, this.w, this.h, scoreRadius)
        
        fill(this.textColor); textSize(scoreTextSize); textAlign(CENTER, CENTER); noStroke(); textStyle(BOLD)
        text(`${this.scoreName}\n${scoreValue}`, this.x+this.w/2, this.y+this.h/2+1)
    }
    click(x, y){
        if (x > this.x && x < this.x + this.w && 
            y > this.y && y < this.y + this.h ) {
            if (this.score === null && rollTryCounter > 1) {
                this.score = this.scoreDice()
                rollTryCounter = 1
                dice.forEach(d => d.reset())
            } else if (this.scoreName === "Yahtzee") { // I know this is bad coding practice
                this.score += this.scoreDice()
                dice.forEach(d => d.reset())
            }
        }
    }
    scoreDice() {
      // counts the occurance of 1 through 6
      let counters = [0, 0, 0, 0, 0, 0]
      dice.forEach(die => counters[die.value - 1] += 1)
      let counts = `${counters[0]}${counters[1]}${counters[2]}${counters[3]}${counters[4]}${counters[5]}`
      
      let diceTotal = 0
      dice.forEach(die => diceTotal += die.value)

      return this.callback(counts, diceTotal)
    }
}


function setup() {
  for (let i = 0; i < 5; i++){
    dice[i] = new Dice(59*i+30, DICE_Y)
  }
  rollButton = new RollButton(15, 10)
  
  // "UPPER SECTION"
  scores.push(new ScoreButton(MARGIN + SPACING * 0, UPPER_Y, "Ones",  (counts) => 1 * counts[0]))  
  scores.push(new ScoreButton(MARGIN + SPACING * 1, UPPER_Y, "Twos",  (counts) => 2 * counts[1]))
  scores.push(new ScoreButton(MARGIN + SPACING * 2, UPPER_Y, "Threes",(counts) => 3 * counts[2]))
  scores.push(new ScoreButton(MARGIN + SPACING * 3, UPPER_Y, "Fours", (counts) => 4 * counts[3]))
  scores.push(new ScoreButton(MARGIN + SPACING * 4, UPPER_Y, "Fives", (counts) => 5 * counts[4]))
  scores.push(new ScoreButton(MARGIN + SPACING * 5, UPPER_Y, "Sixes", (counts) => 6 * counts[5]))
  
  // "LOWER SECTION"
  scores.push(new ScoreButton(MARGIN + SPACING * 0, LOWER_Y, "3 of a\nkind", (counts, total) => counts.match(/3|4|5/) ? total : 0))
  scores.push(new ScoreButton(MARGIN + SPACING * 1, LOWER_Y, "4 of a\nkind", (counts, total) =>  counts.match(/4|5/) ? total : 0))
  scores.push(new ScoreButton(MARGIN + SPACING * 2, LOWER_Y, "Full\nHouse", (counts) => counts.match(/20*3|30*2/) ? 25 : 0))
  scores.push(new ScoreButton(MARGIN + SPACING * 3, LOWER_Y, "Small\nStraight", (counts) => counts.match(/[12]{4}/) ? 30 : 0))
  scores.push(new ScoreButton(MARGIN + SPACING * 4, LOWER_Y, "Large\nStraight", (counts) => counts.match(/1{4}/) ? 40 : 0))
  scores.push(new ScoreButton(MARGIN + SPACING * 5, LOWER_Y, "Yahtzee", (counts) => counts.match(/5/) ? 50 : 0))
  scores.push(new ScoreButton(MARGIN + SPACING * 0, LOWER_Y + SCORE_H, "Chance", (counts, total) => total))
   
  textOutput()
  createCanvas(canvasW, canvasH)
}

function draw() {
  background(bgColor)
  
  dice.forEach(d => d.show())
  scores.forEach(s => s.show())
  rollButton.show()
  showScoreTotals()

  // Game states? End condition? High score? Wordl style clipboard output?
  if (game.state == 0) { } 
  else if (game.state == 1) { }
}

function showScoreTotals() {
    scoreTopSubtotal = 0
    for (let i = 0; i <= 5; i++) {
        scoreTopSubtotal += scores[i].score
    }
    if (scoreTopSubtotal >= 63) scoreTopBonus = 35
    let topBonusMessage = scoreTopBonus === 0 ? "n/a" : scoreTopBonus
    scoreTopTotal = scoreTopSubtotal + scoreTopBonus
    scoreLowerTotal = 0
    for (let i = 6; i < scores.length; i++) {
        scoreLowerTotal += scores[i].score
    }
    scoreGrandTotal = scoreTopSubtotal + scoreTopBonus + scoreLowerTotal
    yahtzeeCounter = constrain(scores[11].score / 50 - 1, 0, Infinity)

    textSize(12)
    textAlign(LEFT, TOP) 
    text(`Upper section subtotal — ${scoreTopSubtotal}\nBonus if over 62 points — ${topBonusMessage}\nUpper section total — ${scoreTopTotal}`, canvasW / 4, UPPER_Y + SPACING)
    text(`Lower section subtotal — ${scoreLowerTotal}\nBonus Yahtzees — ${yahtzeeCounter*50}\nGrand total — ${scoreGrandTotal}`, canvasW / 4, LOWER_Y + SPACING)
}

function mousePressed() {
  dice.forEach(die => die.click(mouseX, mouseY))
  scores.forEach(score => score.click(mouseX, mouseY))
  rollButton.click(mouseX, mouseY)
}