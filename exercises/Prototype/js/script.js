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
    row: 5,
    col: 5
};



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

}


/**
Description of draw()
*/
function draw() {
    background(bgc.red, bgc.green, bgc.blue);
    displayWorld();
    displayPlayer();
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
