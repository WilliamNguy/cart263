/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

let speechRecognizer = new p5.SpeechRec();

/**
Description of preload
*/
function preload() {

}


/**
Description of setup
*/
function setup() {
    speechRecognizer.onResult = handleResult;
    speechRecognizer.continuous = true;
    speechRecognizer.start();
}


/**
Description of draw()
*/
function draw() {

}

function handleResult() {
    if (speechRecognizer.resultValue === true) {
        console.log(speechRecognizer.resultString);
    }
}