/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";
let voice = new p5.Speech();

/**
Description of preload
*/
function preload() {

}


/**
Description of setup
*/
function setup() {
    createCanvas(windowWidth, windowHeight);

}


/**
Description of draw()
*/
function draw() {
    background(207, 185, 151);

}

function mousePressed() {
    voice.speak(`She sells sea shells on the seashores.`);
}