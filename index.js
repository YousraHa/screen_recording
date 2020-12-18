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
const displayMediaOptions = {
    video: {
      cursor: "always"
    },
    audio: true
  };

let isWebcamOn = true;
let isAudioOn = true;
let isRecording = true;
let isScreenRecording = true;
let isScreenShare = true;






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
    const startMic = document.getElementById('startMic');
    const startLiveCam = document.getElementById('startLiveCam');
    const mediaRecorder = new MediaRecorder(mediaStreamObj);
    const startRecBtn = document.getElementById("startRecBtn");
    const recordedScreen = document.querySelector("#recordedScreen");
    const videoElem = document.querySelector("#vid");
    const logElem = document.getElementById("log");
    const startLiveScreen = document.getElementById("startLiveScreen");
    const mouseTarget = document.getElementsByTagName("footer")[0];
    let recorder, stream;

    
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

    async function startRecording() {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { 
            mediaSource: "screen",
            cursor: "always" }
        });
        recorder = new MediaRecorder(stream);
      
        const chunks = [];
        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = e => {
          const completeBlob = new Blob(chunks, { type: chunks[0].type });
          recordedScreen.src = URL.createObjectURL(completeBlob);
        };
        recorder.start();
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

      

    
    // EVENTLISTENERS
    
    mouseTarget.addEventListener('mouseenter', e => {
    console.log('entrer')
    var x = document.getElementsByClassName("flex")[0]
    x.style.display = "block";
    });
    
    mouseTarget.addEventListener('mouseleave', e => {
    console.log('sortir')

    var x = document.getElementsByClassName("flex")[0]
    x.style.display = "none";
    });
    

    startLiveScreen.addEventListener("click", (evt) => {
        isScreenShare = !isScreenShare
          if (!isScreenShare){
            // $('#startLiveScreen').text('screen_share');
            document.querySelector('#startLiveScreen').textContent='screen_share';
            startCapture();
          } else {
            stopCapture();
            // $('#startLiveScreen').text('stop_screen_share')
            document.querySelector('#startLiveScreen').textContent='stop_screen_share';
          }
      }, false);

    //   RECORDING SCREEN
    startRecBtn.addEventListener("click", () => {
        isScreenRecording = !isScreenRecording
        if (!isScreenRecording){
          console.log("test1")
          startRecording();
          showScreen()
        //   $('#startRecBtn').text('cancel_presentation');
          document.querySelector('#startRecBtn').textContent='cancel_presentation';
      } else {
        console.log("test2")
        recorder.stop();
        stream.getVideoTracks()[0].stop();
        // hideScreen();
        // $('#startRecBtn').text('present_to_all');
        document.querySelector('#startRecBtn').textContent='present_to_all';
      }
      });
    // END RECORDING SCREEN

    // LIVE WEBCAM

    startLiveCam.addEventListener('click', (ev)=>{
        isWebcamOn = !isWebcamOn
        if(isWebcamOn){
            showElement();
            console.log('webcamstart', isWebcamOn);
            const track = mediaStreamObj.getTracks()[1];
            track.enabled = true;
            // $('#startLiveCam').text('videocam');
            document.querySelector('#startLiveCam').textContent='videocam';

        } else {
            console.log('webcamoff', isWebcamOn)
            hideElement();
            const track = mediaStreamObj.getTracks()[1];
            track.enabled = false;
            // $('#startLiveCam').text('videocam_off');
            document.querySelector('#startLiveCam').textContent='videocam_off';
        }
    });
    // END LIVE WEBCAM

    //MICRO
    startMic.addEventListener('click', (ev)=>{
        isAudioOn = !isAudioOn
        const track = mediaStreamObj.getTracks()[0];
        if (isAudioOn){
            track.enabled = true;
            console.log(mediaRecorder.state, 'start');
            // $('#startMic').text('mic')
            document.querySelector('#startMic').textContent='mic';
        } else {
            // $('#startMic').text('mic_off')
            document.querySelector('#startMic').textContent='mic_off';
            track.enabled = false;
        }
    });
    // END MICRO
    // END EVENTLISTENERS
    
    })
    .catch(function(err) { 
        console.log(err.name, err.message); 
    });

    

    // FUNCTIONS
    
    function showElement(){
        var x = document.getElementById("wbcm");
        x.style.display = "block";
    };
    
    function hideElement() {
        var x = document.getElementById("wbcm");
        x.style.display = "none";
    };

    function showScreen(){
        var x = document.getElementById("recordedScreen");
        x.style.display = "block";
    };
    
    function hideScreen() {
        var x = document.getElementById("recordedScreen");
        x.style.display = "none";
    };
    // function show(){
    //     var x = document.getElementById("hide");
    //     x.style.display = "block";
    // };
    
    // function hide() {
    //     var x = document.getElementById("hide");
    //     x.style.display = "none";
    // };

    $(function () {
        $(".winston").draggable()
    });
    // END FUNCTIONS

        //add listeners for saving video/audio
    // const start = document.getElementById('btnStart');
    // const stop = document.getElementById('btnStop');
    // const stopWebcam = document.getElementById('startWebcam')
    // const vidSave = document.getElementById('vid2');

    
    // start.addEventListener('click', (ev)=>{
    //     if(isRecording){
    //         mediaRecorder.start();
    //         isRecording = !isRecording;
    //         console.log(mediaRecorder.state, 'start');
    //         document.querySelector('#btnStart').textContent='STOP'
    //         // $('#btnStart').text('STOP');
    //     } else {
    //         mediaRecorder.stop();
    //         $("#myModal").modal();
    //         console.log(mediaRecorder.state, 'stop');
    //         // $('#btnStart').text('START');
    //         document.querySelector('#btnStart').textContent='START'
    //     }
    // })

    // mediaRecorder.ondataavailable = function(ev) {
    //     chunks.push(ev.data);
    // }
    // mediaRecorder.onstop = (ev)=>{
    //     let blob = new Blob(chunks, { 'type' : 'video/mp4;' });
    //     chunks = [];
    //     let videoURL = window.URL.createObjectURL(blob);
    //     vidSave.src = videoURL;
    // }


// jQuery start
    

    // $(function(){
    //     $('#click_advance').click(function() { 
    //         console.log('click click');
    //         isAlarmOn = !isAlarmOn
    //         if(isAlarmOn){
    //             $('#GFG_Span').text('alarm_on');
    //         } else {
    //             $('#GFG_Span').text('alarm_off');
    //         }
            
    //     });
        
    // });

//jQuery end


