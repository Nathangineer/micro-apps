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



Regex for the true/false categories
Don't know about c#, but in a scripting language I'd take the regexp route. For each side, calculate how many times it occurs in the combination and join the results together. For example, for the combination 12342 the counter string will be 121100. Then match the counter string against these patterns:

    /5/         = Five of a kind
    /4/         = Four of a kind
    /20*3|30*2/ = Full house
    /1{5}/      = Large Straight
    /[12]{4}/   = Small Straight
    /3/         = Three of a kind
    /2[013]*2/  = Two pair
    /2/         = One pair


For sorted digits
^([1-6])\1{2}([1-6])\2$|^([1-6])\3([1-6])\4{2}$
=
^(\d)\1{2}(\d)\2$|^(\d)\3(\d)\4{2}$


// UI for dice
// On roll, traditional-looking dice are scattered on the board in random positions and orientations
// Click on the dice you want to lock and it moves to the bottom, sorted from least to greatest


******************************************************************************/

let canvasW = 300
let canvasH = 300
let bgColor = "#FFF"
let lineWeight = 1
let game = {state: 0}
let dice = [false, false, false, false, false]
let scores = []

const BUTTON_W = 45
const BUTTON_H = 45

class Dice {
  constructor(x, y, value = false){
    this.x = x
    this.y = y
    this.w = BUTTON_W
    this.h = BUTTON_H
    this.value = 0
    this.active = true
    this.locked = false
  }
  show(){
    if (this.active) {
      let textFill = this.locked ? "#F00" : "#00F"
      let diceFill = this.locked ? "#CCC" : "#FFF"
      strokeWeight(3); fill(diceFill); stroke(0)
      rect(this.x, this.y, this.w, this.h, 6)
      
      let label = this.value === 0 ? "" : this.value 
      noStroke(); fill(textFill)
      textSize(45); textAlign(CENTER, CENTER)
      text(label, this.x + this.w/2, this.y + this.h/2)
      if (this.locked) {
        stroke(0)
        textSize(22)
        text("🔒", this.x + 8, this.y + this.h)
        textSize(12)
        text("🎲", this.x + 8, this.y + this.h + 4)
      }
    }
  }
  click(x, y){
    if (this.active) {
      if (x > this.x && y > this.y && 
          x < this.x + this.w && y < this.y + this.h) {
        this.locked = !this.locked
      }
    }
  }
  roll() {
    if (!this.locked) {
      this.value = Math.floor((Math.random() * 6)) + 1
    }
  }
}

class RollButton {
    constructor(x, y){
        this.x = x
        this.y = y
        this.w = BUTTON_W*3
        this.h = BUTTON_H
        this.text = "ROLL"
        this.active = true
    }
    show(){
        stroke(0); fill(255)
        rect(this.x, this.y, this.w, this.h, 20)
        fill("#000"); noStroke()
        textSize(35); textAlign(CENTER, CENTER)
        text(this.text, this.x+this.w/2, this.y+this.h/2)
    }
    click(x, y){
        if (x > this.x && y > this.y && 
          x < this.x + this.w && y < this.y + this.h) {
            dice.forEach(d => d.roll())
            console.log("roll")
        }
    }
}

class ScoreButton {
    constructor(x, y, name, callback){
        this.x = x
        this.y = y
        this.w = BUTTON_W
        this.h = BUTTON_H
        this.text = name
        this.callback = callback
        this.active = true
        this.score = null
    }
    show(){
        stroke(0); fill(255)
        rect(this.x, this.y, this.w, this.h, 10)
        fill("#000"); noStroke()
        textSize(12); textAlign(CENTER, BOTTOM)
        text(this.text, this.x+this.w/2, this.y+this.h/1.5)
        // Show this.score
        if (this.score != null) {
            text(this.score, this.x+this.w/2, this.y+this.h)
        } else { // Or show potential score if this.score is null
            fill(128)
            text(this.scoreDice(), this.x+this.w/2, this.y+this.h)
        }
    }
    click(x, y){
        if (x > this.x && x < this.x + this.w && 
            y > this.y && y < this.y + this.h ) {
                if (this.score === null) {
                    this.score = this.scoreDice()
                    console.log("score saved")
                }
        }
    }
    scoreDice() {
      let c = [0, 0, 0, 0, 0, 0]  // counts the occurance of 1 through 6
      dice.forEach((die, index) => c[die.value - 1] += 1)
      let counts = `${c[0]}${c[1]}${c[2]}${c[3]}${c[4]}${c[5]}`
      let diceTotal = 0
      dice.forEach(die => diceTotal += die.value)
      1 + dice[0] + dice[1] + dice[2] + dice[3] + dice[4] + dice[5]
       // console.table(diceTotal)
      return this.callback(counts, diceTotal)
    }
}


function setup() {
  for (i = 0; i < 5; i++){
    dice[i] = new Dice(54*i+10, 50)
  }
  rollButton = new RollButton(50, 110)
  
  // "UPPER SECTION"
  scores.push(new ScoreButton(10, 160, "Ones", (counts, diceTotal) => 1 * counts[0]))  
  scores.push(new ScoreButton(60, 160, "Twos", (counts, diceTotal) => 2 * counts[1]))
  scores.push(new ScoreButton(110, 160, "Threes", (counts, diceTotal) => 3 * counts[2]))
  scores.push(new ScoreButton(160, 160, "Fours", (counts, diceTotal) => 4 * counts[3]))
  scores.push(new ScoreButton(210, 160, "Fives", (counts, diceTotal) => 5 * counts[4]))
  scores.push(new ScoreButton(260, 160, "Sixes", (counts, diceTotal) => 6 * counts[5]))
  
      
      // score.upperSubTotal
      // score.bonus if 63 or more, give 35 points
      // score.upperTotal = score.upperSubTotal + score.bonus
      
      // "LOWER SECTION"
      //score.threeOfAKind = counts.match(/{3-5}/) ? total : 0
      //score.fourOfAKind =  counts.match(/{4-5}/) ? total : 0
  scores.push(new ScoreButton(10, 220, "3 of a\nkind", (counts, total) => total))
  scores.push(new ScoreButton(60, 220, "4 of a\nkind", (counts, total) => total))
  scores.push(new ScoreButton(110, 220, "Full\nHouse", (counts, total) => counts.match(/20*3|30*2/) ? 25 : 0))
  scores.push(new ScoreButton(160, 220, "Small\nStraight", (counts, total) => counts.match(/[12]{4}/) ? 30 : 0))
  scores.push(new ScoreButton(210, 220, "Large\nStraight", (counts, total) => counts.match(/1{4}/) ? 40 : 0))
  scores.push(new ScoreButton(260, 220, "Yahtzee", (counts, total) => counts.match(/5/) ? 50 : 0))
  scores.push(new ScoreButton(260, 110, "Chance", (counts, total) => total))

      //score.smallStraight = counts.match(/[12]{4}/) ? 30 : 0
      //score.largeStraight = counts.match(/1{4}/) ? 40 : 0
      //score.yahtzee = counts.match(/5/) ? 50 : 0
      //score.chance = total
      //score.yahtzeeBonusCounter
      //score.yahtzeeBonus = 100 * score.yahtzeeBonusCounter 
      // score.lowerTotal
      // score.grandtotal
   
  textOutput()
  createCanvas(canvasW, canvasH)
}

function draw() {
  background(bgColor)
  fill("#FFF")
  
  dice.forEach(e => e.show())
  scores.forEach(e => e.show())
  rollButton.show()
  
  // Game states
  // Click to roll dice
  // Roll, from 1 to 3, where you can "hold" dice and roll others
  // Rolls spent, must score. Can "throw" score for zeros. (roll and all dice are locked)
  //   The "potential" scores are always shown, except before roll 1
  // Click to roll dice (repeat loop until all scores are full)
  if (game.state == 0) { } 
  else if (game.state == 1) { }
}



function scoreFullHouse() {
  let string = ""
  dice.forEach(d => string += d.value)
  //(\1/
  
  return score
}

function mousePressed() {
  dice.forEach(d => d.click(mouseX, mouseY))
  scores.forEach(s => s.click(mouseX, mouseY))
  rollButton.click(mouseX, mouseY)
  console.log("click")
}


      // "UPPER SECTION"
      //score.ones = counter[0] * 1
      //score.twos = counter[1] * 2
      //score.threes = counter[2] * 3
      //score.fours = counter[3] * 4
      //score.fives = counter[4] * 5
      //score.sixes = counter[5] * 6
      // score.upperSubTotal
      // score.bonus if 63 or more, give 35 points
      // score.upperTotal = score.upperSubTotal + score.bonus
      
      // "LOWER SECTION"
      //score.threeOfAKind = counts.match(/{3-5}/) ? diceTotal : 0
      //score.fourOfAKind =  counts.match(/{4-5}/) ? diceTotal : 0
      //score.fullHouse = counts.match(/20*3|30*2/) ? 25 : 0
      //score.smallStraight = counts.match(/[12]{4}/) ? 30 : 0
      //score.largeStraight = counts.match(/1{4}/) ? 40 : 0
      //score.yahtzee = counts.match(/5/) ? 50 : 0
      //score.chance = diceTotal
      //score.yahtzeeBonusCounter
      //score.yahtzeeBonus = 100 * score.yahtzeeBonusCounter 
      // score.lowerTotal
      // score.grandtotal