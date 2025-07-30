// Tile types
const TILE = {
  PLAYER: 'S',
  FLOOR: '.',
  WALL: '1',
  RED_KEY: 'r',
  RED_DOOR: 'R',
  BLUE_KEY: 'b',
  BLUE_DOOR: 'B',
  PUSH_BLOCK: 'P',
  GOAL: 'G',
};

const PLAYER_COLOR = "#d3d"
const FLOOR_COLOR = "#222"
const WALL_COLOR = "#966"
const RED_COLOR = "#F44"
const BLUE_COLOR = "#44F"
const PUSH_BLOCK_COLOR = "#FA3"
const GOAL_COLOR = "#FFF"

const GAME_MAP = [
  "111111111111",
  "1........BG1",
  "1.P.1P11P111",
  "1PPP1b.R...1",
  "1.11111111.1",
  "1.1...r.1..1",
  "1.P.1P..1.11",
  "1.1.PPPP1..1",
  "1.P.1.P....1",
  "1.1.1.....11",
  "1...1..1S111",
  "111111111111"
];

const TILE_SIZE = 25;

function drawBlank(x, y) {
    fill(FLOOR_COLOR);
    rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

// Tile Classes
class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  canEnter(player, moveDir) {
    return false;
  }

  onEnter(player) {}

  draw() {
    drawBlank(this.x, this.y)
  }
}

class Floor extends Tile {
  canEnter() {
    return true;
  }
}

class Wall extends Tile {
  draw() {
    fill(WALL_COLOR);
    rect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}

class Door extends Tile {
  constructor(x, y, color) {
    super(x, y);
    this.color = color;
    this.isOpen = false;
  }

  canEnter(player, moveDir) {
    if (this.isOpen) return true;
    if (player.hasItem(this.color + 'Key')) {
      this.isOpen = true;
      return true;
    }
    return false;
  }

  draw() {
    drawBlank(this.x, this.y)
    if (!this.isOpen) {
      if (this.color === 'red') fill(RED_COLOR) 
      else if (this.color === 'blue') fill(BLUE_COLOR) 
      else fill(255 * (frameCount % 2)) // for error color
      rect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      fill(FLOOR_COLOR);
      rect(this.x * TILE_SIZE + 8, this.y * TILE_SIZE + 8, 
           TILE_SIZE - 16, TILE_SIZE - 16);
    }
  }
}

class Key extends Tile {
  constructor(x, y, color) {
    super(x, y);
    this.color = color;
    this.collected = false;
  }

  canEnter() {
    return true;
  }

  onEnter(player) {
    if (!this.collected) {
      player.addItem(this.color + 'Key');
      this.collected = true;
    }
  }

  draw() {
    drawBlank(this.x, this.y)
    if (!this.collected) {
      if (this.color === 'red') fill(RED_COLOR) 
      else if (this.color === 'blue') fill(BLUE_COLOR) 
      else fill(255 * (frameCount % 2)) // for error color
      rect(this.x * TILE_SIZE + 8, this.y * TILE_SIZE + 8, 
           TILE_SIZE - 16, TILE_SIZE - 16);
    }
  }
}

class Goal extends Tile {
  constructor(x, y, color) {
    super(x, y);
  }

  canEnter() {
    return true;
  }

  onEnter(player) {
      // win level
  }

  draw() {
    drawBlank(this.x, this.y)
    push()
        rectMode(CORNER)
        noStroke()
        translate(this.x * TILE_SIZE, this.y * TILE_SIZE)
        let counter = 0
        for (let i = 0; i < 5; i++){
            for (let j = 0; j < 5; j++){
                fill(counter % 2 * 255)
                push()
                translate(i * TILE_SIZE / 5, j * TILE_SIZE / 5)
                rect(0, 0, TILE_SIZE / 5, TILE_SIZE / 5)
                pop()
                counter++
            }    
        }
      fill("") 
      rect(this.x * TILE_SIZE + 8, this.y * TILE_SIZE + 8, 
           TILE_SIZE - 16, TILE_SIZE - 16);
    pop()
  }
}

class PushBlock extends Tile {
  constructor(x, y) {
    super(x, y);
  }

  canEnter(player, moveDir) {
    const newX = this.x + moveDir.x;
    const newY = this.y + moveDir.y;
    
    if (newX < 0 || newX >= game.tiles[0].length || 
        newY < 0 || newY >= game.tiles.length) {
      return false;
    }

    const nextTile = game.tiles[newY][newX];
    if (nextTile.canEnter(player, moveDir)) {
      game.tiles[newY][newX] = this;
      game.tiles[this.y][this.x] = new Floor(this.x, this.y);
      this.x = newX;
      this.y = newY;
      return true;
    }
    return false;
  }

  draw() {
    drawBlank(this.x, this.y)
    fill(PUSH_BLOCK_COLOR);
    rect(this.x * TILE_SIZE + 3, this.y * TILE_SIZE + 3, 
         TILE_SIZE - 6, TILE_SIZE - 6, 2);
  }
}

// Player Class
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.inventory = new Set();
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  addItem(item) {
    this.inventory.add(item);
  }

  hasItem(item) {
    return this.inventory.has(item);
  }

  draw() {
    push()
    fill(PLAYER_COLOR);
    noStroke()
    translate(this.x * TILE_SIZE, this.y * TILE_SIZE)
    rect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4, 4);
    fill(255); circle(TILE_SIZE*.35, 4, 12)
    fill(255); circle(TILE_SIZE*.65, 9, 12)
    fill(0);   circle(TILE_SIZE*.35, 4, 5 )
    fill(0);   circle(TILE_SIZE*.65, 9, 5 )
    pop()
  }
}

// Game Class
class Game {
  constructor() {
    this.tiles = [];
    this.player = null;
    this.setup();
  }

  setup() {
    for (let y = 0; y < GAME_MAP.length; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < GAME_MAP[y].length; x++) {
        const char = GAME_MAP[y][x];
        this.tiles[y][x] = this.createTile(char, x, y);
        
        if (char === TILE.PLAYER) {
          this.player = new Player(x, y);
          this.tiles[y][x] = new Floor(x, y);
        }
      }
    }
  }

  createTile(char, x, y) {
    switch (char) {
      case TILE.WALL: return new Wall(x, y);
      case TILE.RED_KEY: return new Key(x, y, 'red');
      case TILE.BLUE_KEY: return new Key(x, y, 'blue');
      case TILE.RED_DOOR: return new Door(x, y, 'red');
      case TILE.BLUE_DOOR: return new Door(x, y, 'blue');
      case TILE.PUSH_BLOCK: return new PushBlock(x, y);
      case TILE.GOAL: return new Goal(x, y);
      default: return new Floor(x, y);
    }
  }

  canMoveTo(x, y, moveDir) {
    if (x < 0 || x >= this.tiles[0].length || y < 0 || y >= this.tiles.length) {
      return false;
    }
    return this.tiles[y][x].canEnter(this.player, moveDir);
  }

  movePlayer(dx, dy) {
    const newX = this.player.x + dx;
    const newY = this.player.y + dy;
    const moveDir = { x: dx, y: dy };

    if (this.canMoveTo(newX, newY, moveDir)) {
      this.tiles[newY][newX].onEnter(this.player);
      this.player.move(dx, dy);
      return true;
    }
    return false;
  }

  draw() {
    for (let y = 0; y < this.tiles.length; y++) {
      for (let x = 0; x < this.tiles[y].length; x++) {
        this.tiles[y][x].draw();
      }
    }
    this.player.draw();
  }
}

// Main sketch
let game;

function setup() {
  createCanvas(300, 300);
  game = new Game();
}

function draw() {
  background(0);
  game.draw();
}

function keyPressed() {
  let dx = 0, dy = 0;
  
  switch (keyCode) {
    case LEFT_ARROW: dx = -1; break;
    case RIGHT_ARROW: dx = 1; break;
    case UP_ARROW: dy = -1; break;
    case DOWN_ARROW: dy = 1; break;
  }

  if (dx !== 0 || dy !== 0) {
    game.movePlayer(dx, dy);
    redraw();
  }
}