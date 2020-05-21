var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var constant; // pipe contanst calcolated by adding the pipe gap and the end of top pipe. Determines the starting point of the bottom pipe.
var score = 0;
const pipeGap = 85; // Gap between the top and bottom pipe.
const gravity = 1.5; // speed in which the bird drops to the ground
var birdX = 10;
var birdY = 150;

var pipe = [];
pipe[0] = {
    x : canvas.width,
    y : 0
}

// Game resources
var background;
var pipeTop;
var pipeBottom
var foreground;
var flappyBird;
var flySound;
var scoreSound;

/**
 * Initializes the images and sound resources for the game.
 */
function initResources() {
    background = new Image();
    background.src = "images/bg.png";

    pipeTop = new Image();
    pipeTop.src = "images/pipeNorth.png";

    pipeBottom = new Image();
    pipeBottom.src = "images/pipeSouth.png";

    foreground = new Image();
    foreground.src = "images/fg.png";

    flappyBird = new Image();
    flappyBird.src = "images/bird.png";

    flySound = new Audio();
    flySound.src = "sounds/fly.mp3";

    scoreSound = new Audio();
    scoreSound.src = "sounds/score.mp3";
}

/**
 * On key press, moves the bird up by 25pixels.
 * @param {keyPress} evt 
 */
function moveUp(evt) {
    birdY -= 25;
    flySound.play();
}

/**
 * Re-draws the flappy bird and pipes on the screen after a specific time interval.
 */
function draw() {
    context.drawImage(background, 0, 0);

    for (var i = 0; i < pipe.length; i++) {
        // Bottom pipe will have the same X co ordinate but an additional constant to have a gap between the pipes added to the y co-ordinate.
        constant = pipeTop.height + pipeGap;
        context.drawImage(pipeTop, pipe[i].x, pipe[i].y);
        context.drawImage(pipeBottom, pipe[i].x, pipe[i].y + constant);

        pipe[i].x--;
        addNewPipes(i);
        detectCollision(i);
        checkAndIncrementScore(i);
    }

    context.drawImage(foreground, 0, canvas.height - foreground.height);
    context.drawImage(flappyBird, birdX, birdY);
    birdY += gravity;

    updateScore();
    requestAnimationFrame(draw);
}

/**
 * Adds a new pipe object into the head of the pipe array.
 * @param index Index of the current pipe object
 */
function addNewPipes(index) {
    //TODO(Sudarshan): Make the logic of adding new pipes more dynamic wrt the screen size. ALso ensure random pipe sizes are within bounds.  
    if (pipe[index].x === 25) {
        pipe.push({
            x : canvas.width,
            y : Math.floor(Math.random() * pipeTop.height) - pipeTop.height
        });
    }
}
/** 
 * Detecting if there is a collision. Could be one of the following reasons,
 * 1. hits the top pipe face front or when in between the pipes
 * 2. hits the bottom pipe face front or when in between the pipes
 * 3. hits the ground
 * @param index Index of the current pipe object
 */
function detectCollision(index) {
    if (birdX + flappyBird.width >= pipe[index].x && birdX <= pipe[index].x + pipeTop.width // Case 1
        && (birdY <= pipe[index].y + pipeTop.height || birdY + flappyBird.height >= pipe[index].y + constant) // Case 2
        || birdY + flappyBird.height >= (canvas.height - foreground.height)) { // Case 3
        // Restart the game if there is a collision
        location.reload();
    }
}

/**
 * Checks if the current pipe object has almost crossed the canvas. If yes, increment the score.
 * @param index Index of the current pipe object
 */
function checkAndIncrementScore(index) {
    //TODO(Sudarshan): Ensure robust check to determine if the bird has crossed the current pipe.
    if (pipe[index].x === 5) {
        score++;
        scoreSound.play();
    }
}

/**
 * Writes the score to the bottom left corner of the screen.
 */
function updateScore() {
    context.fillStyle = "#000";
    context.font = "20px Verdana";
    context.fillText("Score : " + score, 10, canvas.height - 20);
}

// Key press event listener
document.addEventListener("keydown", moveUp);
initResources();
draw();