"use strict";

let TILE_SIZE = 50;
let voice = new p5.Speech()
let speechRecognizer = new p5.SpeechRec();
let currentSpeech = "Here we go!";
let bgc = {
    red: 255,
    green: 255,
    blue: 255
};
let speed = 1;

let world = [
    [`W`, `W`, `W`, `W`, `W`, `W`, `W`, `W`, `W`, `W`],
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`],
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`],
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`],
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`],
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`],
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`],
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`],
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`],
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`],
    [`W`, `W`, `W`, `W`, `W`, `W`, `W`, `W`, `W`, `W`],
];

let player = {
    row: 9,
    col: 5
};

let fallingSquare = [];



/**
Description of preload
*/
function preload() {

}


/**
Description of setup
*/
function setup() {
    let canvasHeight = world.length * TILE_SIZE;
    let canvasWidth = world[0].length * TILE_SIZE;
    createCanvas(canvasWidth, canvasHeight);
    speechRecognizer.onResult = handleResult;
    speechRecognizer.continuous = true;
    speechRecognizer.start();
    for (let i = 0; i < 2; i++) {
        fallingSquare.push(new FallingSquare());
    }

}


/**
Description of draw()
*/
function draw() {
    background(bgc.red, bgc.green, bgc.blue);
    displayWorld();
    displayPlayer();
    for (let i = 0; i < fallingSquare.length; i++) {
        fallingSquare[i].update();
        fallingSquare[i].display();

        if (collideSquare(
            player.col * TILE_SIZE, player.row * TILE_SIZE, TILE_SIZE, TILE_SIZE,
            fallingSquare[i].col * TILE_SIZE, fallingSquare[i].row * TILE_SIZE, TILE_SIZE, TILE_SIZE,
        )) {
            bgc.green = 0;
            bgc.red = 255;
            bgc.blue = 0;
        }
    }
}

function displayWorld() {
    for (let row = 0; row < world.length; row++) {
        for (let col = 0; col < world[row].length; col++) {
            let tile = world[row][col];
            switch (tile) {
                case ` `:
                    break;
                case `W`:
                    displayWall(row, col);
                    break;
            }
        }
    }
}

function displayWall(row, col) {
    let x = col * TILE_SIZE;
    let y = row * TILE_SIZE;
    push();
    noStroke();
    fill(0);
    rect(x, y, TILE_SIZE);
    pop();
}

function displayPlayer() {
    let x = player.col * TILE_SIZE;
    let y = player.row * TILE_SIZE;
    push();
    noStroke();
    fill(255, 0, 0);
    rect(x, y, TILE_SIZE);
    pop();
}

function handleResult() {
    let move = {
        row: 0,
        col: 0
    };

    if (speechRecognizer.resultValue) {
        currentSpeech = speechRecognizer.resultString;
        console.log("heard something");
        console.log(speechRecognizer.resultString)
    }

    switch (currentSpeech) {
        case "left":
            move.col = -speed;
            break;
        case "right":
            move.col = speed;
            break;
        case "up":
            move.row = -speed;
            break;
        case "down":
            move.row = speed;
            break;
        case "pink":
            bgc.green = 0;
            bgc.red = 255;
            bgc.blue = 255;
            break;
        case "yellow":
            bgc.green = 255;
            bgc.red = 255;
            bgc.blue = 0;
            break;
        case "cyan":
            bgc.green = 255;
            bgc.red = 0;
            bgc.blue = 255;
            break;
        case "white":
            bgc.green = 255;
            bgc.red = 255;
            bgc.blue = 255;
    }
    let nextPosition = {
        row: player.row + move.row,
        col: player.col + move.col
    };

    if (world[nextPosition.row][nextPosition.col] !== `W`) {
        player.row = nextPosition.row;
        player.col = nextPosition.col;
    }

    if (currentSpeech == "faster") {
        speed++;
    }
    if (currentSpeech == "slower") {
        speed--;
    }
}

function collideSquare(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}
