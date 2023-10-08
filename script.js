const video = document.getElementById("webcam");
const liveView = document.getElementById("liveView");
const demosSection = document.getElementById("demos");
const enableWebcamButton = document.getElementById("webcamButton");
const canvasElement = document.querySelector("#output-canvas");

// Check if webcam access is supported.
function getUserMediaSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it to call enableCam function which we will
// define in the next step.
if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

const net = handPoseDetection.SupportedModels.MediaPipeHands;
const detectorConfig = {
  runtime: "tfjs",
};

const state = {
  backend: "webgl",
};
async function loadModel() {
  // loading webgl backend
  await tf.setBackend(state.backend);
  console.log("backend set");
}
// Enable the live webcam view and start classification.
async function enableCam(event) {
  // Only continue if the COCO-SSD has finished loading.
  if (!model) {
    return;
  }

  // Hide the button once clicked.
  event.target.classList.add("removed");

  loadModel();
  // getUsermedia parameters to force video but not audio.
  const constraints = {
    video: true,
  };
  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream;
    let { width, height } = stream.getTracks()[0].getSettings();
    console.log(`${width}x${height}`);
    video.addEventListener("loadeddata", predictWebcam);
  });
}

// Placeholder function for next step.
let detector = undefined;
async function predictWebcam() {
  console.log("ok");
  // Load the MediaPipe handpose model.
  if (!detector) {
    console.log("model loading");
    detector = await handPoseDetection.createDetector(net, detectorConfig);
    console.log("model loaded");
  }
  const estimationConfig = { flipHorizontal: false };
  const hands = await detector.estimateHands(video);
  console.log("hands");
  if (hands[0]) {
    canvas.console.log(hands[0].keypoints);
    console.log("predictions");
    for (let i = 0; i < hands[0].keypoints.lenght; i++) {
      console.log(hands[0].keypoints[i]);
    }
  }

  // const model = await handpose.load();
  // console.log(model);
  // console.log("finger");
  // hands.forEach((finger) => {
  //   console.log(finger);
  // });

  // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain a
  // hand prediction from the MediaPipe graph.
  // const predictions = await model.estimateHands(video);
  // console.log(predictions);
  console.log("has the predictions been loaded?");
  // console.log(predictions.length);
  if (hands.length > 0) {
    console.log("inside");
    /*
    `predictions` is an array of objects describing each detected hand, for example:
    [
      {
        handInViewConfidence: 1, // The probability of a hand being present.
        boundingBox: { // The bounding box surrounding the hand.
          topLeft: [162.91, -17.42],
          bottomRight: [548.56, 368.23],
        },
        landmarks: [ // The 3D coordinates of each hand landmark.
          [472.52, 298.59, 0.00],
          [412.80, 315.64, -6.18],
          ...
        ],
        annotations: { // Semantic groupings of the `landmarks` coordinates.
          thumb: [
            [412.80, 315.64, -6.18]
            [350.02, 298.38, -7.14],
            ...
          ],
          ...
        }
      }
    ]
    */

    console.log(hands);
    for (let i = 0; i < hands[0].keypoints.length; i++) {
      const k = hands[0].keypoints[i].landmarks;
      console.log(k);

      // Log hand keypoints.
      // for (let j = 0; j < k.length; j++) {
      //   const [x, y, z] = k[j];
      //   console.log(`Keypoint ${j}: [${x}, ${y}, ${z}]`);
      // }
    }
  }
  setInterval(() => {
    predictWebcam();
  }, 5000);
}

// Pretend model has loaded so we can try out the webcam code.
var model = true;
demosSection.classList.remove("invisible");
