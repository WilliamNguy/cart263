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

let typingSound;

let showButton = false;
let buttonClicked = false;

let activationTime = -1;

let personDetected = false;

let websiteURL = "https://pippinbarr.com/cart263/course-information/schedule.html";

var st = "ILoveCart263";
var allData = "";
var c = 0;
var stlength = st.length;

function preload() {
    typingSound = loadSound('assets/sounds/type.wav');
}

function naciFunction(event) {
    if (c >= stlength) {
        document.removeEventListener('keyup', naciFunction);
        showButton = true;
        return;
    }

    setTimeout(function () {
        if (handScannerActivated && eyeScannerActivated && voiceDetection) {
            allData = allData + st[c];
            c++;

            document.getElementById("dataArea").innerHTML = allData;

            if (typingSound.isLoaded()) {
                typingSound.play();
            }
        }
        // naciFunction();
    }, 100);
}

// setTimeout(naciFunction, 2000);

document.addEventListener('keyup', naciFunction);

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
                if (activationTime === -1) {
                    activationTime = millis();
                }
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

    personDetected = detections.some(object => object.label === "person");

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

    if (personDetected && facemeshActivated && handpose) {
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
        text("Type passcode:", 10, height - 20);

        // if (allData !== st) {
        // naciFunction();
        // }
    }

    if (showButton) {
        if (buttonClicked) {
            fill(200);
        } else {
            fill(255);
        }
        rect(width - 100, height - 50, 100, 50);
        fill(0);
        textSize(20);
        text("enter", width - 90, height - 20);
    }
}



function drawKeypoints() {
    for (let i = 0; i < predictions.length; i++) {
        const keypoints = predictions[i].scaledMesh;
        if (eyeScannerActivated) {
            for (let j = 381; j < 395; j += 1) {
                const [x, y] = keypoints[j];
                if (millis() - activationTime < 2000) {
                    fill(255, 0, 0);
                } else {
                    fill(0, 255, 0);
                }
                ellipse(x, y, 5, 5);
            }
        } else {
            for (let j = 0; j < keypoints.length; j++) {
                const [x, y] = keypoints[j];
                if (millis() - activationTime < 2000) {
                    fill(255, 0, 0);
                } else {
                    fill(0, 255, 0);
                }
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

function mousePressed() {
    if (showButton && mouseX > width - 100 && mouseX < width && mouseY > height - 50 && mouseY < height) {
        window.open(websiteURL, "_blank");
    }
}
