let facemesh;
let video;
let predictions = [];
let detector;
let detections = [];
let facemeshActivated = false;

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO, videoReady);
    video.size(640, 480);
    video.hide();
    // 2 seconds delay
    setTimeout(() => {
        facemesh = ml5.facemesh(video, modelReady);
        facemesh.on("face", results => {
            predictions = results;
        });
        facemeshActivated = true;
    }, 3000);

    detector = ml5.objectDetector('cocossd', modelReady);
}

function videoReady() {
    detector.detect(video, gotDetections);
    // detector = ml5.objectDetector('cocossd', modelReady);
}

function gotDetections(error, results) {
    if (error) {
        console.error(error);
    }
    detections = results;
    detector.detect(video, gotDetections);
}

function modelReady() {
    if (facemeshActivated) {
        detector.detect(video, gotDetections);
    }
    console.log("Model ready!");
}

function draw() {
    image(video, 0, 0, width, height);

    if (facemeshActivated) {
        drawKeypoints();
    }

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

function drawKeypoints() {
    for (let i = 0; i < predictions.length; i++) {
        const keypoints = predictions[i].scaledMesh;
        for (let j = 0; j < keypoints.length; j++) {
            const [x, y] = keypoints[j];
            fill(0, 255, 0);
            ellipse(x, y, 5, 5);
        }
    }
}
