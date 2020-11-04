let constraintObj = { 
    audio: true, 
    video: { 
        facingMode: "user", 
        // width: { min: 640, ideal: 1280, max: 1920 },
        // height: { min: 480, ideal: 720, max: 1080 } 
        // width : {ideal : 100%},
        // height: 100%
    }
}; 



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

    
    //add listeners for saving video/audio
    let start = document.getElementById('btnStart');
    let stop = document.getElementById('btnStop');
    let startMic = document.getElementById('startMic');
    let stopMic = document.getElementById('stopMic');
    let startWebcam = document.getElementById('startWebcam');
    let stopWebcam = document.getElementById('stopWebcam')
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
        $("#myModal").modal();
        console.log(mediaRecorder.state, 'stop');
    });
    //webcam
    startWebcam.addEventListener('click', (ev)=>{
        var track = mediaStreamObj.getTracks()[1];
        track.enabled = true
        // console.log(mediaStreamObj.getTracks(), 'gettracks')
        // mediaStreamObj.getTracks().forEach(track => track.stop())
        console.log(track,'track')
        console.log(mediaRecorder.state, 'stop');
    });
    stopWebcam.addEventListener('click', (ev)=>{
        var track = mediaStreamObj.getTracks()[1];
        track.enabled = false
        console.log(mediaStreamObj.getTracks(), 'gettracks')
        // mediaStreamObj.getTracks().forEach(track => track.stop())
        console.log(track,'track')
        console.log(mediaRecorder.state, 'stop');
    });
    //micro
    startMic.addEventListener('click', (ev)=>{
        var track = mediaStreamObj.getTracks()[0];
        track.enabled = true;
        // mediaRecorder.start();
        // console.log(track,'track');
        console.log(mediaRecorder.state, 'stop');
    });
    stopMic.addEventListener('click', (ev)=>{
        var track = mediaStreamObj.getTracks()[0];
        track.enabled = false
        console.log(mediaStreamObj.getTracks(), 'gettracks')
        // mediaStreamObj.getTracks().forEach(track => track.stop())
        console.log(track,'track')
        console.log(mediaRecorder.state, 'stop');
    });
    mediaRecorder.ondataavailable = function(ev) {
        chunks.push(ev.data);
    }
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

// jQuery pour le draggable
$(function () {
    $(".winston").draggable()
  });

function hideWebcam() {
    var x = document.getElementById("wbcm");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  };
