/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";


/**
Description of preload
*/


let video;
let detector;
let detections = [];

function preload() {

}


function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO, videoReady);
    video.size(640, 480);
    video.hide();
}

function videoReady() {
    // Models available are 'cocossd', 'yolo'
    detector = ml5.objectDetector('cocossd', modelReady);
}

function gotDetections(error, results) {
    if (error) {
        console.error(error);
    }
    detections = results;
    detector.detect(video, gotDetections);
}

function modelReady() {
    detector.detect(video, gotDetections);
}

function draw() {
    image(video, 0, 0);

    for (let i = 0; i < detections.length; i += 1) {
        const object = detections[i];
        stroke(0, 255, 0);
        strokeWeight(4);
        noFill();
        rect(object.x, object.y, object.width, object.height);
        noStroke();
        fill(255);
        textSize(24);
        text(object.label, object.x + 10, object.y + 24);
    }
}