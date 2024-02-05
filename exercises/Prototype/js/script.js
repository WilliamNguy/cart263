"use strict";

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
    [`W`, `W`, `W`, `W`, `W`, `W`, `W`, `W`, `W`, `W`]
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`]
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`]
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`]
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`]
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`]
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`]
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`]
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`]
    [`W`, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, `W`]
    [`W`, `W`, `W`, `W`, `W`, `W`, `W`, `W`, `W`, `W`]
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

}


/**
Description of draw()
*/
function draw() {

}