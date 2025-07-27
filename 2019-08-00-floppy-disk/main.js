const canvasW = 300
const canvasH = 300
let gameState = "START" // or "PLAYING" "GAME OVER"


"use strict";p5.prototype.fillGradient=function(){let o=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"linear";var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};let r=2<arguments.length&&void 0!==arguments[2]&&arguments[2];var e={linear:{from:[0,0],to:[width,height],steps:[color(255),color(0,96,164),color(0)]},radial:{from:[width/2,height/2,0],to:[width/2,height/2,max(width/2,height/2)],steps:[color(255),color(0,96,164),color(0)]},conic:{from:[width/2,height/2,90],steps:[color(255),color(0,96,164),color(0)]}};let a=o.toLowerCase(),i=(a=e[a]?a:"linear",Object.assign(e[a],t)),l=(r?r.canvas:canvas).getContext("2d"),n={linear:()=>l.createLinearGradient(i.from[0],i.from[1],i.to[0],i.to[1]),radial:()=>l.createRadialGradient(i.from[0],i.from[1],i.from[2],i.to[0],i.to[1],i.to[2]),conic:()=>l.createConicGradient(radians(i.from[2]),i.from[0],i.from[1])},c=n[a]();i.steps.forEach((o,t)=>{o=Array.isArray(o)?o:[o],t=o[1]||t/(i.steps.length-1),t=Math.min(1,Math.max(0,t));c.addColorStop(t,o[0])}),l.fillStyle=c};

class DiskMan {
    constructor (x, y) {
        this.x = x
        this.y = y
        this.w = 30
        this.h = 30
        this.vy = -5
        this.ay = .2
        this.batteries = 0
    }
    draw() {
        push()
        translate(this.x+5, this.y+15)
        //rotate(PI*.45 + this.vy/15)
        translate(-15, -15)
        noStroke()
        fill(255, 0, 0)
        rect(0, 0, this.w, this.h)
        fill(200)
        rect(0 +this.w*.2, 0, this.w*.6, this.h*.4)
        fill(255, 0, 0)
        rect(0 +this.w*.55, 0 + this.h *.1, this.w*.15 , this.h*.2 )
        pop()
        this.y = constrain(this.y , 0, height - this.h )
    }
    hop() {
        //this.img = getImage("space/octopus")
        this.vy = -5
    }
    fall() {
        //this.img = getImage("space/octopus")
        this.vy += this.ay
        this.y += this.vy
        
        this.vy = constrain(this.vy, -5, 10)
    }
    batteryGrab(battery) {
        if (this.x + this.w > battery.x && 
              this.x < battery.x + battery.w && 
              this.y + this.h > battery.y && 
              this.y < battery.y + battery.h) {

            // hide battery? Or shrink and collect in ship?
            battery.y = this.y
            if (battery.collected === false) {
              this.batteries++
              battery.h = this.x - battery.x + 50
            }
            battery.collected = true
            gameState = "GAME OVER"
        }
    }
}

class Battery {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.w = 15
        this.h = 50
        this.collected = false
    }
    update() {
        diskette.batteryGrab(this)
        this.x -= 2
        if (this.x < 0) {
            console.log("offscreen")
            //this.x = width + 50 + random(200)
            this.y = 1000 //random(50, 250)
            console.log(batteries.length)
            this.collected = false
        }
    }
    draw() {
        noStroke( )
        //strokeWeight(2)
        fillGradient('linear', {
            from : [this.x, this.y], // x, y
            to : [this.x + this.w, this.y  ], // x, y
            steps : [["#FF0", 0], ["#000", 1]] // Array [p5.color Object, Color Stop (0 to 1)]
        });
        rectMode(CORNER)
        rect(this.x, this.y, this.w, this.h)
        rect(this.x + 3, this.y, this.w - 6, -3)
    }
}

var diskette
var batteries

function setup() {
  createCanvas(canvasW, canvasH)
}

function draw() {
    background(8, 43, 89)
    //fill(130, 79, 43)
    if (gameState === "START") {
        textSize(30)
        textAlign(CENTER, CENTER)
        text("CLICK TO START", canvasW / 2, canvasH / 2)
        noLoop()
    }
    else if (gameState === "PLAYING") {
        batteries.forEach(battery => {
            battery.update()
            battery.draw()
        })
        
        if (diskette.batteries/batteries.length >= 1) {
            textSize(15)
            fill(204, 245, 90)
            text(`${diskette.batteries} battery`, 
                70 + sin(millis() * 0.008) * 5, 
                200 + cos(millis() * 0.005) * 5)
        }
        
        diskette.fall()
        diskette.draw()
        loop()
    } 
    if (gameState === "GAME OVER") {
        text(`GAME OVER\n\nBatteries: ${diskette.batteries}`, canvasW / 2, canvasH / 2)
        noLoop()
    }      
}
function input() {
    if (gameState === "START") {
        gameState = "PLAYING"
        reset()
        redraw()
    }
    else if (gameState === "PLAYING") {
        diskette.hop()
        console.log("hop")
    }
    else if (gameState === "GAME OVER") {
        reset()
    }
}
function keyPressed() {
    input()
}
function mousePressed() {
    input()
}

function reset() {
    diskette = new DiskMan(50, 100)
    batteries = []
    for (var i = 0; i < 1; i++) {  
        batteries.push(new Battery(i * 150 + width + 50, random(50, 250)))
    }
        gameState = "PLAYING"
        redraw()
}