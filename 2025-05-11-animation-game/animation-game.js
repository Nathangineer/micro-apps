/* 
2025-05-11
Animation Engine
The goal is to have a full featured animation engine for 2D games. In order to
do this, there is a signal generator, which needs to be able to produce the 
following transformations:
- Movement in X
- Movement in Y
- Rotation about Z
- Stretch image in X
- Stretch image in Y
- Affine transformation in X
- Affine transformation in Y
- Timing for procedural animations
- Integration with inputs on these from other places

For movement of one type we need: 
- How to begin based off last position? Relative or absolute mode
- Direction/rotation
- Movement type
- Distance/magnitude
- Repitions
- How to end? Stay at final value, or reset to zero
 */

let canvasW = 300
let canvasH = 300
let bgColor = "#888"
let lineWeight = 1
game = {state: 0}


class Signal {
	constructor(setup = [{type: "SINE", period: 200, cycles: 8},
                       {type: "TRIANGLE", period: 100, cycles: 20}]) {
		this.start_time = millis()
    this.elapsed_time = 0
    this.signals = setup
    this.signals_backup = setup
    this.cycle_count = 0
    this.magnitude = 0  //clamped from -1 to 1
    this.period_percent = 0.00
    this.continuous = true // start new signals with final value of old signal
	}
  sine_signal(percent) {
    return sin(percent * 2 * PI)
  }
  triangle_signal(percent){ // triangle wave
    return -Math.abs(2 * percent - 1) + 1
  }
  linear_signal(percent){ // linear interpolate
    return percent
  }
  smooth_signal(percent){ // smoothed interpolate with sine wave segment
    return sin((1.5 + percent) * PI) / 2
  }
  pause_signal(percent) {
    console.log("signal paused" + percent)
  }
	get() {
    if (this.signals.length <= 0) {return 0}
    // convert time to a percent of total
    this.elapsed_time = millis() - this.start_time
    this.period_percent = this.elapsed_time / this.signals[0].period
    console.log(this.period_percent)
    if (this.period_percent > 1) {
      this.start_time = millis()
      this.cycle_count++
      if (this.cycle_count > this.signals[0].cycles) {
        this.signals.shift()
        this.cycle_count = 0
        return 0;
        console.log("empty animation")
      } 
      // if cycles above limit, shift the stack.
      // (check earlier: if stack empty, return 0 for signal)
    }
    let type = this.signals[0].type
    if (type == "SINE") {
      return this.sine_signal(this.period_percent)
    } else if (type == "TRIANGLE") {
      return this.triangle_signal(this.period_percent)
    } else if (type == "LINEAR") {
      return this.linear_signal(this.period_percent)
    } else if (type == "SMOOTH") {
      return this.smooth_signal(this.period_percent)
    } else if (type == "PAUSE") {
      return this.pause_signal(this.period_percent)
    }
    // this.magnitude = constrain(this.magnitude, -1, 1)
  }
  add_signals(signal_object_array) {
    
  }
  reset() {
		this.start_time = millis()
    this.elapsed_time = 0
    this.signals = [{type: "SINE", period: 2000, cycles: 2}]
    this.cycle_count = 0
    this.magnitude = 0  //clamped from -1 to 1
    this.period_percent = 0.00    
  }
}

function setup() {
  signal_1 = new Signal()
      
  textOutput()
  createCanvas(canvasW, canvasH)
}


function draw() {
  background(bgColor)
  fill("#FFF")
  let sig = signal_1.get()
  circle(sig*20+150, 100, 100)
  //console.log(sig)
  if (game.state == 0) {
    
  } else if (game.state == 1) {
    
  } else if (game.state == 2) {
    
  } else if (game.state == 3) {
    
  } 
}

function mouseClicked() {
  console.log(signal_1)
  signal_1.reset()
  console.log(signal_1)
}