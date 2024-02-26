let facemesh;
let video;
let predictions = [];
let detector;
let detections = [];
let facemeshActivated = false;
let handpose;
let hands = [];

let speechRecognizer;
let voiceDetection = false;

let handScannerActivated = false;
let eyeScannerActivated = false;

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
            if (predictions.length === 0) {
                facemeshActivated = false;
            } else {
                facemeshActivated = true;
                if (!speechRecognizer) {
                    speechRecognizer = new p5.SpeechRec();
                    speechRecognizer.onResult = handleResult;
                    speechRecognizer.continuous = true;
                    speechRecognizer.start();
                }
            }
        });
        facemeshActivated = true;
    }, 6000);

    detector = ml5.objectDetector('cocossd', modelReady);


    handpose = ml5.handpose(video, modelReady);
    handpose.on("hand", results => {
        hands = results;
    })


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
    drawHands();

    if (voiceDetection && handScannerActivated && eyeScannerActivated) {
        fill(0);
        rect(0, height - 50, width, 50);
        fill(255);
        textSize(24);
        text("login:", 10, height - 20);
    }
}

function drawKeypoints() {
    for (let i = 0; i < predictions.length; i++) {
        const keypoints = predictions[i].scaledMesh;
        if (eyeScannerActivated) {
            for (let j = 381; j < 395; j += 1) {
                const [x, y] = keypoints[j];
                fill(0, 255, 0);
                ellipse(x, y, 5, 5);
            }
        } else {
            for (let j = 0; j < keypoints.length; j++) {
                const [x, y] = keypoints[j];
                fill(0, 255, 0);
                ellipse(x, y, 5, 5);
            }
        }
    }
}

function drawHands() {
    if (handScannerActivated) {
        for (let i = 0; i < hands.length; i++) {
            const landmarks = hands[i].landmarks;
            for (let j = 0; j < landmarks.length; j++) {
                const [x, y] = landmarks[j];
                fill(255, 0, 0);
                ellipse(x, y, 10, 10);
            }
        }
    }
}

// function handleResult() {
//     if (speechRecognizer.resultValue === true) {
//         console.log(speechRecognizer.resultString);
//         voiceDetection = true;
//     } else {
//         voiceDetection = false;
//     }
// }

function handleResult() {
    if (speechRecognizer.resultValue) {
        console.log("Result value: " + speechRecognizer.resultValue);
        console.log("Result string: " + speechRecognizer.resultString);
        if (speechRecognizer.resultString.toLowerCase().includes("activate hand scanner")) {
            handScannerActivated = true;
        }
        if (speechRecognizer.resultString.toLowerCase().includes("activate eye scanner")) {
            eyeScannerActivated = true;
        }
        voiceDetection = true;
    } else {
        voiceDetection = false;
    }
}
