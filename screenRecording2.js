
const videoElem = document.querySelector("#vid");
const logElem = document.getElementById("log");
const startRecScreen = document.getElementById("startRecScreen");
let isScreenShare = true;


// Options for getDisplayMedia()

const displayMediaOptions = {
  video: {
    cursor: "always"
  },
  audio: true
};

function dumpOptionsInfo() {
    const videoTrack = videoElem.srcObject.getVideoTracks()[0];
    
    console.info("Track settings:");
    console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
    console.info("Track constraints:");
    console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
};

async function startCapture() {
  logElem.innerHTML = "";

  try {
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    dumpOptionsInfo();
  } catch(err) {
    console.error("Error: " + err);
  }
};


function stopCapture(evt) {
  let tracks = videoElem.srcObject.getTracks();
  console.log(tracks, 'tracksssss')

  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;
};


startRecScreen.addEventListener("click", function(evt) {
  isScreenShare = !isScreenShare
    if (!isScreenShare){
      $('#startRecScreen').text('screen_share')
      startCapture();
    } else {
      stopCapture();
      $('#startRecScreen').text('stop_screen_share')
    }
}, false);
