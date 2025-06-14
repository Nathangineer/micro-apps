/*----------------------------------------------------------------------------
https://en.wikipedia.org/wiki/Rotation_period_(astronomy)

Everything revolves CCW (Looking down at earth's north pole)
Everthing rotates CCW, except Venus

Planet diameters:
Sun    864,600 mi (1,391,400 km)
Earth    7,926 mi (   12,756 km)
Venus    7,521 mi (   12,104 km)
Mercury  3,032 mi (    4,880 km)

Synodic Periods of Planets to Earth (Time between conjunctions)
Mercury 115.88 days
Venus 583.9 days

Issues
Moon phase isn't right?
Elevation of the evening, morning star
   Venus Phase: Morning Star, Evening Star, 
                Eastern/western elongation
                Elevation in the sky in degrees
    https://en.wikipedia.org/wiki/Opposition_(astronomy)
YEAR SCALE
  Add dates for solstice, equinox, and quarter things
  Axis tilt graph is a sine wave
    Peak and valley are solstices
    Inflection points are equinoxes
  The cross quarter days are when the weather becomes what it would be without thermal lag
    2PI/8 is a right triangle angle. Right triangle. Square days
    Divides the year into eight partitions
  The constellations circle each year approximately
      

----------------------------------------------------------------------------*/

const MY_LONGITUDE = -122.2 // Negative is W, positive is E
const MY_LATITUDE = 48      // Negative is S, positive is N. Not used currently

const USE_CUSTOM_START_TIME = true
const CUSTOM_START_TIME = new Date('2026-04-06T01:29:00')
let currentTime = new Date()

const USE_FAST_FORWARD = false
const FAST_FORWARD_SPEED = 100 // Days per second?

let canvasW = 360
let canvasH = 640
let lineColor = 250
let lineWeight = 3
let fillColor = 0

// SUN
let sunX = canvasW * .50
let sunY = canvasH * .25
let sunDiameter = canvasW / 6
let sunColor = ('#FCE570')
// Sun rotation time 25d 9h 7m 11.6s 35d
let sunRayDiameter = sunDiameter * 1.2

// EARTH
let earthX = canvasW * .50
let earthY = canvasH * .75
let earthDiameter = sunDiameter   // 6,371 km
let youAreHereSize = earthDiameter / 20
// Earth Cycle time
EARTH_ROTATION_TIME = 86400000 // ms = 24H
let earthColor = ('#6B93D6')

// MOON
let moonDiameter = earthDiameter * 3474 / 6371  // 3,474 km
let moonDistance = earthDiameter * 2   //
const MOON_SYNODIC_TIME = 2551443840   // ms
let MOON_DATUM_TIME = new Date('2025-01-13T21:27:00') // Baseline full moon
let moonColor = ('#F6F1D5')

// MERCURY
let mercuryDiameter = moonDiameter * .4  // 2,440 km
let mercuryDistance = moonDiameter * 2.5
// const MERCURY_CYCLE_TIME = 7600530240 // ms = 87.9691 days
const MERCURY_SYNODIC_TIME = 10012032000 // ms = 115.88 days
let MERCURY_DATUM_TIME = new Date('2019-11-11T15:20:00')  // Last transit
let mercuryColor = ('#908E91')

// VENUS
let venusDiameter = moonDiameter * .5 // 6,052km
let venusDistance = moonDiameter * 4
const VENUS_CYCLE_TIME = 19414080000 // ms = 224.7 days
const VENUS_SYNODIC_TIME = 50448960000 // ms = 583.9 days
const VENUS_DATUM_TIME = new Date('2012-06-06T01:29:00') // Last transit
let venusColor = ('#8B91F1')


function setup() {
  textOutput() // Create screen reader accessible description
  createCanvas(canvasW, canvasH)
  angleMode(DEGREES)
  ellipseMode(CENTER)
  earthPoleTilt = (earthDiameter/2) * sin(23.44) // The earth's axis tilt
  if (USE_CUSTOM_START_TIME) {
    currentTime = new Date(CUSTOM_START_TIME)
  }
}


function draw() {
  resetGraphics()
  background(fillColor)

  // Logic to update time
  if (!USE_CUSTOM_START_TIME) {
    if (!USE_FAST_FORWARD) {
      currentTime = new Date()
    } else {
      currentTime = new Date(currentTime.getTime() + FAST_FORWARD_SPEED * 10000)
    }
  }
  if (USE_CUSTOM_START_TIME) {
    if (!USE_FAST_FORWARD) {
      currentTime = new Date(currentTime.getTime() + deltaTime)
    } else {
      currentTime = new Date(currentTime.getTime() + FAST_FORWARD_SPEED * 10000)
    }
  }

  // Draw planet paths
  noFill()
  drawPath(sunX, sunY, earthY - sunY) // Earth path
  drawPath(earthX, earthY, moonDistance) // Moon path
  drawPath(sunX, sunY, mercuryDistance) // Mercury path
  drawPath(sunX, sunY, venusDistance) // Venus path

  // Draw Planets
  drawSun()
  drawEarth()
  drawMoon()
  drawPlanet(mercuryDiameter, mercuryDistance, mercuryColor, MERCURY_SYNODIC_TIME, MERCURY_DATUM_TIME)
  drawPlanet(venusDiameter, venusDistance, venusColor, VENUS_SYNODIC_TIME, VENUS_DATUM_TIME)

  // Draw UI
  drawMainClock()

  // Draw stars
  // Draw moon as seen from Earth in the Corner
  // Labels: sunset, sunrise, moon phase
  // Moonrise, moonset times
  rect(0, 0, canvasW, canvasH) // TEMP
}


function drawPath(centerX, centerY, pathDistance){
  noFill()
  strokeWeight(2)
  circle(centerX, centerY, pathDistance*2)
  resetGraphics()
}


function drawSun(){
  let waviness = sin(frameCount*2) * 5
  fill(sunColor)
  stroke(sunColor)
  circle(sunX, sunY, sunDiameter)

  for (i = 0; i < 30; i++){
    let lineAngle = 12 * i + frameCount/10
    let lineStartX = sunX + sunDiameter * cos(lineAngle) / 2
    let lineStartY = sunY + sunDiameter * sin(lineAngle) / 2
    let lineEndX = sunX + (sunRayDiameter + waviness * (i % 2 * 2 - 1)) * cos(lineAngle) / 2
    let lineEndY = sunY + (sunRayDiameter + waviness * (i % 2 * 2 - 1)) * sin(lineAngle) / 2
    line(lineStartX, lineStartY, lineEndX, lineEndY)
  }
  resetGraphics()
}


function drawEarth(){
  // Calculate time since UTC solar midnight 
  let now = new Date()
  let elapsedSeconds = currentTime.getUTCHours()*3600 
                     + currentTime.getUTCMinutes()*60 
                     + currentTime.getUTCSeconds()
  let percentageOfDay = (elapsedSeconds / 86400)

  let timeAngle = -percentageOfDay * 360
  let youAreHereAngle = timeAngle + MY_LONGITUDE

  // Draw earth
  fill(earthColor); noStroke()
  circle(earthX, earthY, earthDiameter)  
  resetGraphics()

  // Calculate pole position. Good enough if leap day is ignored
  let startOfYear = new Date(currentTime.getFullYear(), 0, 0)
  let diff = currentTime - startOfYear  
  let dayOfYear = Math.floor(diff / 86400000)  // Divide by ms in day

  // Calculate axis offsets
  let axisAngle = (dayOfYear - 172) / 365 * 360 - 90 // Points towards the sun Jun 21
  poleX = earthX + cos(axisAngle) * earthPoleTilt
  poleY = earthY + sin(axisAngle) * earthPoleTilt

  // Draw longitude lines
  strokeWeight(lineWeight/5)
  let intersect = createVector(0, 0)
  for (i = 1; i < 13; i++){
    let lineAngle = 30 * i + timeAngle // +time of day
    intersect = lineCircleIntersect(earthX, earthY, earthDiameter, poleX, poleY, lineAngle)
    line(poleX, poleY, intersect.x, intersect.y)
  }  

  push()
  translate(earthX, earthY)
  rotate(axisAngle-90)
    // Draw latitude lines
    for (i = 1; i < 3; i++){
      circle(0, earthPoleTilt, i * 15)
    }
    arc(0, earthPoleTilt, 45, 45, 155,  25)
    arc(0, earthPoleTilt, 58, 58, 190, 350)
    arc(0, earthPoleTilt, 69, 69, 213, 327)
    arc(0, earthPoleTilt, 78, 78, 237, 303) 
    resetGraphics()
  pop() // reset coordinate system

  // Apply shadow to dark side
  shadePlanet(earthX, earthY, earthDiameter, false) 

  // Draw north pole dot
  strokeWeight(1)
  point(poleX, poleY)

  // Draw prime meridian. INCORRECT?
  stroke(200,200,0)
  intersect = lineCircleIntersect(earthX, earthY, earthDiameter, poleX, poleY, timeAngle+90)
  line(poleX, poleY, intersect.x, intersect.y)

  // draw you are here spot MATCH TO LATITUDE
  let youAreHereX = poleX + earthDiameter * cos(youAreHereAngle) * .35
  let youAreHereY = poleY + earthDiameter * sin(youAreHereAngle) * .35
  circle(youAreHereX, youAreHereY, youAreHereSize)

  // Draw you are here label

  // Draw pointer from clock to time
}


function drawMoon(){
  // calculate Moon angle
  let phasePercent = synodicPeriodPercent(MOON_SYNODIC_TIME, MOON_DATUM_TIME)
  let timeAngle = -phasePercent * 360 + 90
  moonX = earthX + moonDistance * cos(timeAngle)
  moonY = earthY + moonDistance * sin(timeAngle)

  // Draw Moon
  fill(moonColor)
  noStroke()
  circle(moonX, moonY, moonDiameter)
  shadePlanet(moonX, moonY, moonDiameter) 

  drawLunarPhaseName(phasePercent)

  /* /* Moonbeam bounce code. Not working yet */ /* 
  let waviness = sin(frameCount*2) * 5
  strokeWeight(2)
  stroke(moonColor)
  for (let i = 0; i < 30; i++){
    let lineAngle = 12 * i + frameCount/10
    let lineStartX = moonX
    let lineStartY = moonY
    let lineEndX = moonX + (100 + waviness * (i % 2 * 2 - 1)) * cos(timeAngle) / 2
    let lineEndY = moonY + (3 + waviness * (i % 2 * 2 - 1)) * sin(timeAngle) / 2
    line(lineStartX, lineStartY, lineEndX, lineEndY)
    console.log(lineStartX, lineStartY, lineEndX, lineEndY)
  }*/
}


function drawPlanet(planetDiameter, planetDistance, planetColor, synodicTime, datumDateTime){
  let phasePercent = -synodicPeriodPercent(synodicTime, datumDateTime)
  let timeAngle = phasePercent * 360 + 90
  planetX = sunX + planetDistance * cos(timeAngle)
  planetY = sunY + planetDistance * sin(timeAngle)

  noStroke()
  fill(planetColor)
  circle(planetX, planetY, planetDiameter)
  shadePlanet(planetX, planetY, planetDiameter, false) 
  resetGraphics()
}


function synodicPeriodPercent(synodicTime, datumDateTime) {
  let deltaMilliSeconds = abs(currentTime - datumDateTime ) % synodicTime
  let phasePercent = deltaMilliSeconds / synodicTime
  return phasePercent
}


function shadePlanet(x, y, diameter, earthLine = true) {
  // Shade the dark side
  planetSunAngle = atan2(y - sunY, x - sunX)
  fill(50)
  noStroke()
  blendMode(MULTIPLY)
  arc(x, y, diameter, diameter, planetSunAngle+270, planetSunAngle+90, CHORD)
  resetGraphics()

  // Draw line of section visible from earth
  if (earthLine == true) {
    planetEarthAngle = atan2(y - earthY, x - earthX) + 90
    let planetViewX = diameter * cos(planetEarthAngle) / 2
    let planetViewY = diameter * sin(planetEarthAngle) / 2
    strokeWeight(1)
    stroke(0)
    drawingContext.setLineDash([2, 3])
    line(x - planetViewX, y - planetViewY, 
         x + planetViewX, y + planetViewY)
   resetGraphics()
  }
}

function resetGraphics(){
  noFill()
  stroke(lineColor)
  strokeWeight(lineWeight)
  drawingContext.setLineDash([])
  blendMode(BLEND)
}

function drawMainClock(){
  textAlign(CENTER, CENTER)
  textSize(width/16)
  textStyle(BOLD)
  noStroke()
  fill(255) 
  let Year = currentTime.getYear() + 1900
  let Month = currentTime.getMonth()
  let monthName = monthNumberToName(Month)
  let Day = currentTime.getDate()
  let Hour = currentTime.getHours()
  let Min = currentTime.getMinutes()
  let Sec = currentTime.getSeconds()
  let noon = Hour >= 12? " pm" : " am"
  Hour %= 12
  if (Hour == 0) Hour = "12"
  if (Min < 10)  Min = "0" + Min
  if (Sec < 10)  Sec = "0" + Sec

  text(Hour + ":" + Min + ":" + Sec + noon 
       + "\n" + monthName + " " + Day + ", " + Year, width/2, height/2)

  resetGraphics()
}


function monthNumberToName(monthNumber) {
  const monthNames = [
    "January", "February", "March", "April", 
    "May", "June", "July", "August", 
    "September", "October", "November", "December"]

    return monthNames[monthNumber]
}

function drawLunarPhaseName(percent) {
  let phaseName = lunarPhaseName(percent)
  noStroke()
  fill(255)
  text(phaseName, canvasW/2, canvasH - 20)
}


function lineCircleIntersect(cX, cY, d, x0, y0, theta){
    let r = d / 2

    // Calculate the displacement from the circle's center to the ray's origin
    dx = x0 - cX
    dy = y0 - cY
    
    // Quadratic equation
    a = 1
    b = 2 * (dx * cos(theta) + dy * sin(theta))
    c = dx**2 + dy**2 - r**2
    D = b**2 - (4 * a * c)
    t = (-b + sqrt(D)) / (2 * a)
    
    // Calculate the intersection point using the parameter t
    x = x0 + t * cos(theta)
    y = y0 + t * sin(theta)

    let result = createVector(x, y)
    return result
}


// Convert this function to percentage, or convert the percentage to days
function lunarPhaseName(agePercent) {
  // Takes the lunar age as a number in the range 0 to 29
  // Returns a string representing the lunar phase or event

  //Convert from percent to days
  agePercent -= .5 // Convert offset from 0=full moon to 0=new moon
  let age = agePercent * 29.53059
  if (age < 0) { age += 29.53059 }

  if ((age <= 1) || (age >= 29)) {
    return "New Moon";
  } else if (age <= 6) {
    return "Waxing Crescent"
  } else if (age <= 8) {
    return "First Quarter"
  } else if (age <= 13) {
    return "Waxing Gibbous"
  } else if (age <= 16) {
    return "Full Moon"
  } else if (age <= 21) {
    return "Waning Gibbous"
  } else if (age <= 23) {
    return "Last Quarter"
  } else if (age < 29) {
    return "Waning Crescent"
  } else {
    return "No lunar phase for age: " + age;
  }
}