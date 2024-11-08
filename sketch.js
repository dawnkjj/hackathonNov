// Variables to store athlete
var athlete_x, athlete_y;
var RaceFloor;
var moveLeft = false, moveRight = false;
var items, burger, hurdles;
var score, lifeCount;
var speed = 0;   
var maxSpeed = 5;       
var friction = 0.9;     
var EndLine_x = 950;  

// Setup function to initialize canvas and start game
function setup() {
    createCanvas(1024, 576);
    RaceFloor = height * 3 / 4;
    lifeCount = 3;
    startGame();
}

// Main draw function to render and update game elements every frame
function draw() {
    background(174, 209, 206);  // Background color

    // Draw the ground area for the track
    fill(178, 34, 34);
    rect(0, 432, 1024, 255);

    // Draw lane lines for track lanes
    stroke(255);
    strokeWeight(2);
    for (let i = 440; i < 576; i += 40) {
        line(0, i, width, i);
    }
    noStroke();

    // Draw start area
    fill(255);
    rect(0, 440, 35, 130);

    // Display start word text vertically in the start area
    push();
    translate(25, 505);
    rotate(-HALF_PI);
    fill(0);
    textSize(23);
    textAlign(CENTER, CENTER);
    text("START", 0, 0);
    pop();

    drawScore();  // Display the score

    // Draw the athlete character slightly above the ground
    drawAthlete();

    // Draw the static finish line
    drawFinishLine();

    // Draw each hurdle on the track
    for (let i = 0; i < hurdles.length; i++) {
        hurdles[i].draw();
    }

    // Check and draw items to be collected
    for (let i = 0; i < items.length; i++) {
        checkItem(items[i]);
        drawItem(items[i]);
    }

    // Draw each enemy and check for collision
    for (let i = 0; i < burger.length; i++) {
        burger[i].draw();
        var isContact = burger[i].checkContact(athlete_x, athlete_y);
        if (isContact) {
            if (lifeCount > 0) {
                lifeCount--;
                startGame();  // Restart game after collision
                break;
            }
        }
    }

    // Check for game over
    if (lifeCount < 1) {
        fill(255, 0, 0);
        textSize(40);
        textAlign(CENTER);
        text("Game over. Press space to restart the game.", width / 2, height / 2);
        if (keyIsPressed && keyCode === 32) {
            setup();
            startGame();
        }
        return;
    }

    // Display "You Win!" message when the finish line is reached
    if (athlete_x >= EndLine_x) {
        fill(0, 0, 0);
        textSize(40);
        textAlign(CENTER, CENTER);
        text("Well done, you won!", width / 2, height / 2);
        return;
    }


    // Check if the athlete is on a hurdle
    var isOnHurdle = false;
    for (let i = 0; i < hurdles.length; i++) {
        if (hurdles[i].checkCollision(athlete_x, athlete_y)) {
            isOnHurdle = true;
            break;
        }
    }

    // Apply gravity if athlete is not on a hurdle
    if (!isOnHurdle && athlete_y < RaceFloor) {
        athlete_y += 5;
    } else if (athlete_y >= RaceFloor) {
    }

    // Control athlete's horizontal movement with speed and friction
    if (moveLeft) speed = max(-maxSpeed, speed - 0.5);
    if (moveRight) speed = min(maxSpeed, speed + 0.5);
    athlete_x += speed;
    speed *= friction;
}

// Draw the athlete (main character)
function drawAthlete() {
    const adjustedY = athlete_y - 30; // Position a bit higher from the ground

    // Head
    fill(210, 180, 140);
    ellipse(athlete_x, adjustedY - 70, 25, 30);

    // Eyes
    fill(0);
    ellipse(athlete_x - 5, adjustedY - 73, 4, 6);
    ellipse(athlete_x + 5, adjustedY - 73, 4, 6);

    // Mouth
    stroke(0);
    strokeWeight(1);
    line(athlete_x - 3, adjustedY - 65, athlete_x + 3, adjustedY - 65);

    // Torso
    noStroke();
    fill(210, 180, 140);
    rect(athlete_x - 20, adjustedY - 55, 40, 45, 10);

    // Pecs
    fill(209, 164, 105);
    ellipse(athlete_x - 9, adjustedY - 47, 15, 10);
    ellipse(athlete_x + 9, adjustedY - 47, 15, 10);

    // Abs
    fill(209, 164, 105);
    rect(athlete_x - 8, adjustedY - 40, 6, 8, 3);
    rect(athlete_x + 2, adjustedY - 40, 6, 8, 3);
    rect(athlete_x - 8, adjustedY - 30, 6, 8, 3);
    rect(athlete_x + 2, adjustedY - 30, 6, 8, 3);
    rect(athlete_x - 8, adjustedY - 20, 6, 8, 3);
    rect(athlete_x + 2, adjustedY - 20, 6, 8, 3);

    // Arms
    fill(210, 180, 140);
    ellipse(athlete_x - 28, adjustedY - 35, 12, 35);
    ellipse(athlete_x + 28, adjustedY - 35, 12, 35);
    ellipse(athlete_x - 28, adjustedY - 10, 8, 20);
    ellipse(athlete_x + 28, adjustedY - 10, 8, 20);

    // Legs
    rect(athlete_x - 12, adjustedY - 8, 8, 30, 5);
    rect(athlete_x + 4, adjustedY - 8, 8, 30, 5);
    fill(139, 69, 19);
    ellipse(athlete_x - 8, adjustedY + 20, 7, 15);
    ellipse(athlete_x + 8, adjustedY + 20, 7, 15);
}

// Draw the static finish line with a checkered pattern
function drawFinishLine() {
    let squareSize = 20;
    let rows = 6;
    let cols = Math.ceil(130 / squareSize);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            fill((row + col) % 2 === 0 ? 0 : 255);
            rect(EndLine_x + col * squareSize, RaceFloor - (rows - row) * squareSize, squareSize, squareSize);
        }
    }
}

// Control key behavior for movement
function keyPressed() {
    if (keyCode === 37) moveLeft = true;  // Left arrow
    else if (keyCode === 39) moveRight = true;  // Right arrow
    if (keyCode === 38) athlete_y -= 120;  // Up arrow for jump
}

// Stop movement when keys are released
function keyReleased() {
    if (keyCode === 37) moveLeft = false;
    else if (keyCode === 39) moveRight = false;
}

// Initialize or reset game state
function startGame() {
    athlete_x = 50;
    athlete_y = RaceFloor - 50; // Start slightly higher above the ground

    score = 0;
    burger = [new Enemy(700, RaceFloor - 10, 200), new Enemy(400, RaceFloor - 10, 200)];
    items = [{ x: 316, y: 430, isCollected: false }];
    hurdles = [createHurdle(150, 50), createHurdle(400, 50)];

    moveLeft = moveRight = false;
    speed = 0;
}

// Display current score
function drawScore() {
    fill(0);
    noStroke();
    textSize(20);
    text("Score: " + score, 50, 30);
}

// Check if the item is collected and increase score if it is
function checkItem(item) {
    if (!item.isCollected && dist(athlete_x, athlete_y, item.x, item.y) < 20) {
        item.isCollected = true;
        score += 1;
    }
}

// Draw each collectible item
function drawItem(item) {
    if (!item.isCollected) {
        fill(255, 165, 0);
        rect(item.x - 10, item.y - 30, 45, 40);

        fill(100);
        rect(item.x - 10, item.y - 35, 45, 5);

        fill(255);
        rect(item.x - 6, item.y - 15, 40, 20);

        fill(0);
        textSize(10);
        textAlign(CENTER, CENTER);
        text("Protein", item.x + 15, item.y - 5);
    }
}

// Create a hurdle object
function createHurdle(x, width) {
    return {
        x: x,
        y: RaceFloor,
        width: width,
        height: 30,

        draw: function () {
            fill(60);
            rect(this.x, this.y - this.height, 5, this.height);
            rect(this.x + this.width - 5, this.y - this.height, 5, this.height);

            fill(255);
            rect(this.x, this.y - this.height, this.width, 5);

            fill(255, 0, 0);
            rect(this.x, this.y - this.height + 5, this.width, 5);
        },

        checkCollision: function (athleteX, athleteY) {
            if (
                athleteX + 20 > this.x &&
                athleteX - 20 < this.x + this.width &&
                athleteY >= this.y - this.height
            ) {
                if (athleteX < this.x) {
                    athlete_x = this.x - 20;
                } else if (athleteX > this.x + this.width) {
                    athlete_x = this.x + this.width + 20;
                }
                return true;
            }
            return false;
        }
    };
}

// Enemy object with movement
function Enemy(x, y, range) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentX = x;
    this.inc = 1;
    this.openMouth = true;

    this.update = function () {
        this.currentX += this.inc;
        if (this.currentX >= this.x + this.range) this.inc = -1;
        else if (this.currentX < this.x) this.inc = 1;
        
        this.openMouth = !this.openMouth;
    };

    this.draw = function () {
        this.update();

        fill(210, 180, 140);
        arc(this.currentX, this.y - 20, 50, 30, PI, TWO_PI, CHORD);

        fill(34, 139, 34);
        rect(this.currentX - 25, this.y - 15, 50, 5, 5);

        fill(255, 223, 0);
        rect(this.currentX - 25, this.y - 10, 50, 5);

        fill(139, 69, 19);
        rect(this.currentX - 25, this.y - 5, 50, 10);

        fill(210, 180, 140);
        arc(this.currentX, this.y, 50, 20, 0, PI, CHORD);
    };

    this.checkContact = function (gc_x, gc_y) {
        return dist(gc_x, gc_y, this.currentX, this.y) < 20;
    };
}
