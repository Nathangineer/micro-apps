const WIDTH = 300;
const HEIGHT = 300;

const tileW = 15;
const tileH = 7
const gridSize = 20

//  1 __ 2      1 
//   |  |      /\ 2
//   |__|    4 \/
//  4    3     3

let tileArr = []
let tileMap;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  noiseDetail(6)
  for (let i = 0; i < gridSize; i++) {
    tileArr.push([])
    for (let j = 0; j < gridSize; j++) {
      tileArr[i].push(0)
    }
  }
}

function draw() {
  background(120, 120, 190);
  for (let i = 0; i < tileArr.length; i++) {
    for (let j = 0; j < tileArr[0].length; j++) {
      let k = millis() / 6000;
      tileArr[j][i] = noise(j / 100, i / 100, k) * 250
    }
  }
  tileMap = subSquares(tileArr);
  for (let i = 0; i < tileMap.length; i++) {
    for (let j = 0; j < tileMap[0].length; j++) {
      renderTile(tileMap[j][i], i, j)
    }
  }
}


// takes a large 2D array, and returns each tile as
// a set of 4 points in the form [a, b, c, d]
function subSquares(tileMap) {
  let tileArray = []
  for (let i = 0; i < tileMap.length - 1; i++) {
    let tileRow = []
    for (let j = 0; j < tileMap.length - 1; j++) {
      tileRow.push([
        tileMap[i][j],
        tileMap[i + 1][j],
        tileMap[i + 1][j + 1],
        tileMap[i][j + 1]
      ])
    }
    tileArray.push(tileRow)
  }
  return tileArray;
}


function renderTile(tile, xPos, yPos) {
  //transform points
  let tilePosX = (tileW/2) * xPos + tileW * yPos / 2;
  let tilePosY = tileH * yPos/2 - (tileH/2) * xPos;

  let p4 = tile[0]
  let p3 = tile[1]
  let p2 = tile[2]
  let p1 = tile[3]

  // shade based on slope direction
  fill(
    ((p1-p2)/30)*205+50,
    ((p2-p3)/30)*205+50, 
    ((p3-p4)/30)*205+50
  )

  beginShape();
  vertex(tilePosX + tileW / 2,
    p1 + tilePosY + 0)
  vertex(tilePosX + tileW,
    p2 + tilePosY + tileH / 2)
  vertex(tilePosX + tileW / 2,
    p3 + tilePosY + tileH)
  vertex(tilePosX + 0,
    p4 + tilePosY + tileH / 2)
  endShape(CLOSE);
}