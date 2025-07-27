/******************************************************************************
Name: Remix of a javascript version of asteroids
Date
Description
******************************************************************************/

// Create background stars
const starsContainer = document.getElementById('stars');
for (let i = 0; i < 1000; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    const size = Math.random() * 3;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.opacity = Math.random();
    starsContainer.appendChild(star);
}

// Game variables
let ship;
let asteroids = [];
let bullets = [];
let bulletCooldown = 5 // frames
let bulletTimer = 0
let score = 0;
let level = 1;
let lives = 3;
let gameState = "start"; // "start", "playing", "gameOver"
let gameOverScreen;
let finalScoreDisplay;

function setup() {
    const canvas = createCanvas(300, 300);
    canvas.parent('game-canvas');
    textStyle(BOLD)
    
    // Initialize ship
    resetShip();
    
    // Create initial asteroids
    createAsteroids(5);
}

function draw() {
    clear()
    
    if (gameState === "playing") {
        readControls()
        // Update and draw game objects
        updateBullets();
        updateShip();
        updateAsteroids();
        
        // Check collisions
        checkCollisions();
        
        // Draw HUD
        drawHUD();
        
        // Check level progression
        if (asteroids.length === 0) {
            level++;
            createAsteroids(3 + level);
        }
    } else if (gameState === "start") {
        drawStartScreen();
    } else if (gameState === "gameOver") {
        drawGameOverScreen()}
}

function readControls() {
    // Thrust
    if (keyIsDown(UP_ARROW)) {
        ship.thrusting = true;
    } else {
        ship.thrusting = false
    }
    
    // Steering
    if (keyIsDown(LEFT_ARROW)) {
        ship.rotationSpeed = -0.08;
    } else if (keyIsDown(RIGHT_ARROW)) {
        ship.rotationSpeed = 0.08;
    } else {
        ship.rotationSpeed = 0
    }
    if (keyIsDown(LEFT_ARROW) && keyIsDown(RIGHT_ARROW)) {
        ship.rotationSpeed = 0
    }
    
    //shoot
    bulletTimer++
    if (keyIsDown(32) && bulletTimer > bulletCooldown) {
        // Shoot bullet
        bullets.push({
            pos: createVector(ship.pos.x, ship.pos.y),
            vel: p5.Vector.fromAngle(ship.rotation - HALF_PI).mult(5)
        });
        bulletTimer = 0
    } 
}

function drawStartScreen() {
    push();
    textAlign(CENTER, CENTER); 
    textSize(32);
    fill(200, 255, 255);
    text("CLICK TO START", width/2, height/2);
    
    textSize(16);
    text("Arrows or WASD to move\nSpace to shoot\nH for hyperspace", width/2, height/2 + 70);
    text("", width/2, height/2 + 90);
    pop();
}

function drawGameOverScreen() {
    push();
    textSize(32);
    fill(0, 255, 255);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width/2, height/2);
    
    textSize(16);
    fill(200, 255, 255);
    text(`Final Score: ${score}`, width/2, height/2 + 40);
    
    textSize(16);
    text("Play again?", width/2, height/2 + 70);
    pop();
}

function drawHUD() {            
    // Draw lives indicator
    push();
    fill(0, 255, 255);
    for (let i = 0; i < lives; i++) {
        const x = 30 + i * 25;
        const y = 30;
        
        // Draw a ship for each life
        push();
        scale(0.75)
        translate(x, y);
        rotate(0);
        drawShipShape();
        pop();
    }
    pop();
    
    // draw score and level
    push();
    textSize(20);
    fill(0, 255, 255);
    textAlign(RIGHT, TOP);
    text(score, width - 10, 10);
    
    textSize(20);
    fill(200, 255, 255);
    textAlign(RIGHT, BOTTOM);
    text(`Level ${level}`, width - 10, height - 10);
    pop();
}

function startGame() {
    gameState = "playing";
    
    // Reset game variables
    score = 0;
    level = 1;
    lives = 3;
    
    // Clear game objects
    asteroids = [];
    bullets = [];
    
    // Create new ship
    resetShip();
    
    // Create initial asteroids
    createAsteroids(5);
}

function resetShip() {
    ship = {
        pos: createVector(width/2, height/2),
        vel: createVector(0, 0),
        rotation: 0,
        radius: 5,
        thrusting: false,
        rotationSpeed: 0.0,
        thrustPower: 0.05,
        invincible: true,
        invincibleTimer: 120 // 2 seconds at 60fps
    };
}

function createAsteroids(count) {
    for (let i = 0; i < count; i++) {
        // Position asteroids at the edges of the screen
        let x, y;
        if (random() < 0.5) {
            x = random() < 0.5 ? -20 : width + 20;
            y = random(height);
        } else {
            x = random(width);
            y = random() < 0.5 ? -20 : height + 20;
        }
        
        asteroids.push({
            pos: createVector(x, y),
            vel: p5.Vector.random2D().mult(random(.25, .5)),
            radius: random(20, 30),
            type: 'large',
            vertices: floor(random(5, 10)),
            offsets: Array(floor(random(5, 10))).fill().map(() => random(-0.4, 0.4))
        });
    }
}

function updateShip() {
    // Apply rotation
    ship.rotation += ship.rotationSpeed;
    
    // Apply thrust
    if (ship.thrusting) {
        let thrust = p5.Vector.fromAngle(ship.rotation - HALF_PI);
        thrust.mult(ship.thrustPower);
        ship.vel.add(thrust);
        // Limit speed
        ship.vel.limit(5);
    }
    
    // Apply friction
    ship.vel.mult(0.99);
    
    // Update position
    ship.pos.add(ship.vel);
    
    // Screen wrapping
    if (ship.pos.x > width + ship.radius) ship.pos.x = -ship.radius;
    else if (ship.pos.x < -ship.radius) ship.pos.x = width + ship.radius;
    if (ship.pos.y > height + ship.radius) ship.pos.y = -ship.radius;
    else if (ship.pos.y < -ship.radius) ship.pos.y = height + ship.radius;
    
    // Update invincibility
    if (ship.invincible) {
        ship.invincibleTimer--;
        if (ship.invincibleTimer <= 0) {
            ship.invincible = false;
        }
    }
    
    // Draw ship
    push();
    translate(ship.pos.x, ship.pos.y);
    rotate(ship.rotation);
    
    // Draw invincibility effect
    if (ship.invincible) {
        const alpha = (frameCount % 10 < 5) ? 150 : 100;
        fill(0, 255, 255, alpha);
        stroke(0, 200, 255, alpha);
    } else {
        fill(0);
        stroke(0, 255, 255);
    }
    
    strokeWeight(2);
    drawShipShape();
    
    // Draw thrust flame
    if (ship.thrusting) {
        const flameSize = random(10, 20);
        fill(255, 255, 0);
        noStroke();
        triangle(
            -5, 10,
            0, 15 + flameSize,
            5, 10
        );
        fill(255, 128, 0);
        triangle(
            -5, 10,
            0, flameSize,
            5, 10
        );
    }
    pop();
}

function drawShipShape() {
    // Draw the ship as a triangle
    fill(0)
    stroke(255)
    strokeWeight(1.5)
    triangle(
        -8, 8,
        0, -15,
        8, 8
    );
    fill(255)
    noStroke()
    triangle(
        -4, -4,
        0, 8,
        4, -4
    );
}

function updateAsteroids() {
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const a = asteroids[i];
        
        // Update position
        a.pos.add(a.vel);
        
        // Screen wrapping
        if (a.pos.x > width + a.radius) a.pos.x = -a.radius;
        else if (a.pos.x < -a.radius) a.pos.x = width + a.radius;
        if (a.pos.y > height + a.radius) a.pos.y = -a.radius;
        else if (a.pos.y < -a.radius) a.pos.y = height + a.radius;
        
        // Draw asteroid
        push();
        translate(a.pos.x, a.pos.y);
        
        // Draw asteroid shape
        fill(0);
        stroke(255);
        strokeWeight(1.5);
        
        beginShape();
        for (let j = 0; j < a.vertices; j++) {
            const angle = map(j, 0, a.vertices, 0, TWO_PI);
            const r = a.radius * (1 + a.offsets[j]);
            const x = r * cos(angle);
            const y = r * sin(angle);
            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    }
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        
        // Update position
        b.pos.add(b.vel);
        
        // Remove bullets that go off screen
        if (b.pos.x < 0 || b.pos.x > width || b.pos.y < 0 || b.pos.y > height) {
            bullets.splice(i, 1);
            continue;
        }
        
        // Draw bullet
        push();
        fill(255);
        noStroke();
        circle(b.pos.x, b.pos.y, 6);
        
        fill(0);
        circle(b.pos.x, b.pos.y, 3);
        pop();
    }
}

function checkCollisions() {
    // Check bullet-asteroid collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        
        for (let j = asteroids.length - 1; j >= 0; j--) {
            const a = asteroids[j];
            
            if (dist(b.pos.x, b.pos.y, a.pos.x, a.pos.y) < a.radius) {
                // Remove bullet and asteroid
                bullets.splice(i, 1);
                
                // Break asteroid into smaller ones
                breakAsteroid(j);
                
                // Add score based on asteroid size
                if (a.type === 'large') score += 20;
                else if (a.type === 'medium') score += 50;
                else if (a.type === 'small') score += 100;
                
                break;
            }
        }
    }
    
    // Check ship-asteroid collisions
    if (!ship.invincible) {
        for (let i = asteroids.length - 1; i >= 0; i--) {
            const a = asteroids[i];
            
            if (dist(ship.pos.x, ship.pos.y, a.pos.x, a.pos.y) < ship.radius + a.radius) {
                // Lose a life
                lives--;
                
                if (lives <= 0) {
                    gameOver();
                } else {
                    // Reset ship with invincibility
                    resetShip();
                }
                break;
            }
        }
    }
}

function breakAsteroid(index) {
    const a = asteroids[index];
    
    if (a.type === 'large') {
        // Break into 2 medium asteroids
        for (let i = 0; i < 2; i++) {
            asteroids.push({
                pos: createVector(a.pos.x, a.pos.y),
                vel: p5.Vector.random2D().mult(random(0.25, .5)),
                radius: a.radius * 0.6,
                type: 'medium',
                vertices: floor(random(4, 7)),
                offsets: Array(floor(random(4, 7))).fill().map(() => random(-0.4, 0.4))
            });
        }
    } else if (a.type === 'medium') {
        // Break into 3 small asteroids
        for (let i = 0; i < 3; i++) {
            asteroids.push({
                pos: createVector(a.pos.x, a.pos.y),
                vel: p5.Vector.random2D().mult(random(0.5, 2  )),
                radius: a.radius * 0.5,
                type: 'small',
                vertices: floor(random(3, 6)),
                offsets: Array(floor(random(3, 6))).fill().map(() => random(-0.4, 0.4))
            });
        }
    }
    
    // Remove original asteroid
    asteroids.splice(index, 1);
}

function gameOver() {
    gameState = "gameOver";
}

function keyPressed() {
    if (gameState === "start"  || gameState === "gameOver") {
      startGame()
    }
    /*
    if (gameState !== "playing") return;
    
    if (keyCode === UP_ARROW) {
        ship.thrusting = true;
    } else if (keyCode === LEFT_ARROW) {
        ship.rotationSpeed = -0.08;
    } else if (keyCode === RIGHT_ARROW) {
        ship.rotationSpeed = 0.08;
    } else if (key === ' ') {
        // Shoot bullet
        bullets.push({
            pos: createVector(ship.pos.x, ship.pos.y),
            vel: p5.Vector.fromAngle(ship.rotation - HALF_PI).mult(10)
        });
    } else if (key === 'h' || key === 'H') {
        // Hyperspace - teleport to random location
        ship.pos = createVector(random(width), random(height));
        ship.vel.mult(0); // Stop momentum
        ship.invincible = true;
        ship.invincibleTimer = 120;
    }*/
   if (key === 'h' || key === 'H') {
        // Hyperspace - teleport to random location
        ship.pos = createVector(random(width), random(height));
        ship.vel.mult(0); // Stop momentum
        ship.invincible = true;
        ship.invincibleTimer = 120;
    }
}

function keyReleased() {
    if (keyCode === UP_ARROW) {
        ship.thrusting = false;
    } else if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
        ship.rotationSpeed = 0;
    }
    console.log(keyCode)
}

// Initialize p5 sketch
new p5();