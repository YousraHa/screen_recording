
let constraintObj = { 
    audio: true, 
    video: { 
        facingMode: "user", 
        // width: { min: 640, ideal: 1280, max: 1920 },
        // height: { min: 480, ideal: 720, max: 1080 } 
        // width : {ideal : 100%},
        // height: 100%
    },
    // screen: {
    //     mediaSource : "screen"
    // }
}; 

// function myOtherFunction(){
//     constraintObj.audio = false
//     console.log(constraintObj.audio, 'constr1')
// };

// width: 1280, height: 720  -- preference only
// facingMode: {exact: "user"}
// facingMode: "environment"

//handle older browsers that might implement getUserMedia in some way
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
    navigator.mediaDevices.getUserMedia = function(constraintObj) {
        let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraintObj, resolve, reject);
        });
    }
}else{
    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        devices.forEach(device=>{
            console.log(device.kind.toUpperCase(), device.label);
            //, device.deviceId
        })
    })
    .catch(err=>{
        console.log(err.name, err.message);
    })
};

navigator.mediaDevices.getUserMedia(constraintObj)
.then(function(mediaStreamObj) {
    //connect the media stream to the first video element
    let video = document.querySelector('video');
    
    if ("srcObject" in video) {
        video.srcObject = mediaStreamObj;
    } else {
        //old version
        video.src = window.URL.createObjectURL(mediaStreamObj);
    }
    
    video.onloadedmetadata = function(ev) {
        //show in the video element what is being captured by the webcam
        video.play();
    };

    // async function startRecording() {
    //     stream = await navigator.mediaDevices.getDisplayMedia({
    //       video: { mediaSource: "screen" }
    //     });
    
    //add listeners for saving video/audio
    let start = document.getElementById('btnStart');
    let stop = document.getElementById('btnStop');
    let vidSave = document.getElementById('vid2');
    let mediaRecorder = new MediaRecorder(mediaStreamObj);
    let chunks = [];
    
    start.addEventListener('click', (ev)=>{
        mediaRecorder.start();
        // var btn = document.getElementById("btnStop");
        console.log(mediaRecorder.state, 'start');
    })
    stop.addEventListener('click', (ev)=>{
        mediaRecorder.stop();
        // modal.style.display = "block";
        // $("close").modal('hide');
        $("#myModal").modal();
        console.log(mediaRecorder.state, 'stop');
    });
    mediaRecorder.ondataavailable = function(ev) {
        chunks.push(ev.data);
    }
        // stop.onclick = function() {
        //     modal.style.display = "block";
        //   }
    mediaRecorder.onstop = (ev)=>{
        let blob = new Blob(chunks, { 'type' : 'video/mp4;' });
        chunks = [];
        let videoURL = window.URL.createObjectURL(blob);
        vidSave.src = videoURL;
    }
})
.catch(function(err) { 
    console.log(err.name, err.message); 
});
// var promise = navigator.mediaDevices.getDisplayMedia(constraints)
// async function startCapture(displayMediaOptions) {
//     let captureStream = null;
  
//     try {
//       captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
//     } catch(err) {
//       console.error("Error: " + err);
//     }
//     return captureStream;
//   }

// jQuery pour le draggable
$(function () {
    $(".winston").draggable()
  });

//bout de code pour le screen sharing que j'essaie de faire fonctionner

// const videoElement = document.getElementById("video");
// const startt = document.getElementById("start");
// const stopp = document.getElementById("stop");

// var displayMediaOptions = {
//     video:{
//         cursor: 'always'
//     },
//     audio : false
// };



// async function startCapture(){
//     try{
//         videoElement.srcObject = await navigator.mediaDevices.getUserMedia(displayMediaOptions)
        
//     } catch(err) {
//         console.log(err, 'erreur')
//     }
// }

// startt.addEventListener("click", function(e){
//     startCapture()
// })

// stopp.addEventListener("click", function(e){
// stopCapture()
// })
// navigator.webkitGetUserMedia({audio:true,video:false}, function(stream){
//     document.getElementById('audio').src = window.URL.createObjectURL(stream);
//     });
// document.getElementById("webcam").muted = true;
// function abc (){
// var front = false;
// document.getElementById('flip-button').onclick = function() { front = !front; };
// var constraints = { audio: false };
// }
// console.log(constraintObj.audio, 'constr2')

function myFunction() {
    var x = document.getElementById("wbcm");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  };

//   const start1 = document.getElementById("start");
//   const stop1 = document.getElementById("stop");
//   const video1 = document.querySelector("video");
//   let recorder, stream;
  
//   async function startRecording() {
//     stream = await navigator.mediaDevices.getDisplayMedia({
//       video: { mediaSource: "screen" }
//     });
//     recorder = new MediaRecorder(stream);
  
//     const chunks = [];
//     recorder.ondataavailable = e => chunks.push(e.data);
//     recorder.onstop = e => {
//       const completeBlob = new Blob(chunks, { type: chunks[0].type });
//       video.src = URL.createObjectURL(completeBlob);
//     };
  
//     recorder.start1();
//   }
  
//   start1.addEventListener("click", () => {
//     start1.setAttribute("disabled", true);
//     stop1.removeAttribute("disabled");
  
//     startRecording();
//   });
  
//   stop1.addEventListener("click", () => {
//     stop1.setAttribute("disabled", true);
//     start1.removeAttribute("disabled");
  
//     recorder.stop1();
//     stream.getVideoTracks()[0].stop();
//   });