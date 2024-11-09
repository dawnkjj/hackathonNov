//SYNTAX SISTERS - GAME BASED ON FITNESS AND WELLBEING

// Variables for the game
var athlete_x, athlete_y;
var RaceFloor;
var moveLeft = false, moveRight = false;
var protein_Shakes, burger, hurdles;
var score, lifeCount;
var speed = 0;   
var maxSpeed = 5;       
var friction = 0.9;     
var EndLine_x = 950;  
var level = 1;  // Game would start at level 1

// Setup function to start the game logic
function setup() {
    createCanvas(1024, 576);
    RaceFloor = height * 3 / 4;
    lifeCount = 3;
    startGame();
}

// Draw function for my game
function draw() {
    if (level === 1) {
        background(174, 209, 206);  // Day sky for level 1
    } else if (level === 2) {
        background(20, 24, 82);  // Night sky for level 2
    }

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

    // Display the score of the gamei
    drawScore();  
    
    // Draw the athlete
    drawAthlete();

    // Draw the finishing line
    drawFinishLine();

    // Draw the hurdles on the track
    for (let i = 0; i < hurdles.length; i++) {
        hurdles[i].draw();
    }

    // Check and draw the protein shake to be collected 
    for (let i = 0; i < protein_Shakes.length; i++) {
        checkprotein_Shake(protein_Shakes[i]);
        drawprotein_Shake(protein_Shakes[i]);
    }

    // Draw each enemy and check for Impact
    for (let i = 0; i < burger.length; i++) {
        burger[i].draw();
        var isContact = burger[i].checkContact(athlete_x, athlete_y);
        if (isContact) {
            if (lifeCount > 0) {
                lifeCount--;
                startGame();  // Restart game after Impact
                break;
            }
        }
    }

    // Check for game over logic
    if (lifeCount < 1) {
        fill(255, 0, 0);
        textSize(40);
        textAlign(CENTER);
        text("Game over. Press space to restart the race.", width / 2, height / 2);
        if (keyIsPressed && keyCode === 32) {
            setup();
            startGame();
        }
        return;
    }

    // Move to level 2 when the finish line is reached (from level 1)
    if (athlete_x >= EndLine_x) {
        if (level === 1) {
            level = 2;  // Proceed to level 2
            startLevel2();
        } else {
            fill(0, 255, 0);
            textSize(40);
            textAlign(CENTER, CENTER);
            text("Congratulations, you finished the game!", width / 2, height / 2);
            noLoop();  // End the game when level 2 is completed
        }
        return;
    }

    // Check if the athlete is on a hurdle
    var isOnHurdle = false;
    for (let i = 0; i < hurdles.length; i++) {
        if (hurdles[i].checkImpact(athlete_x, athlete_y)) {
            isOnHurdle = true;
            break;
        }
    }
//START CODE - CODE REFERENCE TAKEN BY AARON YEO - FROM COURSERA NOTES ITP1 
    // Apply gravity if athlete is not on a hurdle
    if (!isOnHurdle && athlete_y < RaceFloor) {
        athlete_y += 5;
    } else if (athlete_y >= RaceFloor) {
    }
//END CODE - CODE REFERENCE TAKEN BY AARON YEO - FROM COURSERA NOTES ITP1 
    
    // Control athlete's horizontal movement with speed and friction
    if (moveLeft) speed = max(-maxSpeed, speed - 0.5);
    if (moveRight) speed = min(maxSpeed, speed + 0.5);
    athlete_x += speed;
    speed *= friction;
}


// Draw the athlete (main character)
function drawAthlete() {
    const adjustedY = athlete_y - 30; // Position a bit higher from the ground

    // Head of the athlete
    fill(210, 180, 140);
    ellipse(athlete_x, adjustedY - 70, 25, 30);

    // Eyes of the athlete
    fill(0);
    ellipse(athlete_x - 5, adjustedY - 73, 4, 6);
    ellipse(athlete_x + 5, adjustedY - 73, 4, 6);

    // Mouth of the athlete
    stroke(0);
    strokeWeight(1);
    line(athlete_x - 3, adjustedY - 65, athlete_x + 3, adjustedY - 65);

    // Torso of the athlete
    noStroke();
    fill(210, 180, 140);
    rect(athlete_x - 20, adjustedY - 55, 40, 45, 10);

    // Pecs of the athlete
    fill(209, 164, 105);
    ellipse(athlete_x - 9, adjustedY - 47, 15, 10);
    ellipse(athlete_x + 9, adjustedY - 47, 15, 10);

    // Abs of the athlete
    fill(209, 164, 105);
    rect(athlete_x - 8, adjustedY - 40, 6, 8, 3);
    rect(athlete_x + 2, adjustedY - 40, 6, 8, 3);
    rect(athlete_x - 8, adjustedY - 30, 6, 8, 3);
    rect(athlete_x + 2, adjustedY - 30, 6, 8, 3);
    rect(athlete_x - 8, adjustedY - 20, 6, 8, 3);
    rect(athlete_x + 2, adjustedY - 20, 6, 8, 3);

    // Arms of the athlete
    fill(210, 180, 140);
    ellipse(athlete_x - 28, adjustedY - 35, 12, 35);
    ellipse(athlete_x + 28, adjustedY - 35, 12, 35);
    ellipse(athlete_x - 28, adjustedY - 10, 8, 20);
    ellipse(athlete_x + 28, adjustedY - 10, 8, 20);

    // Legs of the athlete
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

//START CODE - CODE REFERENCE TAKEN BY AARON YEO - FROM COURSERA NOTES ITP1 
// Control key behavior for movement
function keyPressed() {
    // Left arrow code 
    if (keyCode === 37) moveLeft = true; 
    // Right arrow code
    else if (keyCode === 39) moveRight = true;  
    // Up arrow for jump
    if (keyCode === 38) athlete_y -= 120;  
}

// Stop movement when keys are released
function keyReleased() {
    if (keyCode === 37) moveLeft = false;
    else if (keyCode === 39) moveRight = false;
}
//END CODE - CODE REFERENCE TAKEN BY AARON YEO - FROM COURSERA NOTES ITP1 

// Initialise or reset game state for level 1
function startGame() {
    level = 1;
    athlete_x = 50;
    athlete_y = RaceFloor - 50; 

    score = 0;
    burger = [new Enemy(700, RaceFloor - 10, 200), new Enemy(400, RaceFloor - 10, 200)];
    protein_Shakes = [{ x: 316, y: 430, isCollected: false }];
    hurdles = [createHurdle(150, 50), createHurdle(400, 50)];

    moveLeft = moveRight = false;
    speed = 0;
}

// Initialise or reset game state to proceed to level 2
function startLevel2() {
    athlete_x = 50;
    athlete_y = RaceFloor - 50; 

    score = 0;
    burger = [new Enemy(750, RaceFloor - 10, 150), new Enemy(500, RaceFloor - 10, 200)]; // Modified positions for level 2
    protein_Shakes = [{ x: 400, y: 430, isCollected: false }, { x: 600, y: 430, isCollected: false }];
    hurdles = [createHurdle(250, 50), createHurdle(500, 50), createHurdle(750, 50)]; // Additional hurdle for level 2

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

// Check if the protein is collected and increase score (if true)
function checkprotein_Shake(protein_Shake) {
    if (!protein_Shake.isCollected && dist(athlete_x, athlete_y, protein_Shake.x, protein_Shake.y) < 20) {
        protein_Shake.isCollected = true;
        score += 1;
    }
}

// Draw each protein shake
function drawprotein_Shake(protein_Shake) {
    if (!protein_Shake.isCollected) {
        // Straw for protein shake 
        fill(110, 87, 42);
        rect(protein_Shake.x + 10, protein_Shake.y - 60, 5, 25);
        
        fill(255, 165, 0);
        rect(protein_Shake.x - 10, protein_Shake.y - 30, 45, 40);

        fill(100);
        rect(protein_Shake.x - 10, protein_Shake.y - 35, 45, 5);

        fill(255);
        rect(protein_Shake.x - 6, protein_Shake.y - 15, 40, 20);

        fill(0);
        textSize(10);
        textAlign(CENTER, CENTER);
        text("Protein", protein_Shake.x + 15, protein_Shake.y - 5);
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

        checkImpact: function (athleteX, athleteY) {
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

// Burger enemy object (burger) 
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
        
        fill(250, 12, 20);
        rect(this.currentX - 25, this.y - 20, 50, 5, 5);
        
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
