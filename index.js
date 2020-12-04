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

let isWebcamOn = true;
let isAudioOn = true;
let isRecording = true;





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
    const start = document.getElementById('btnStart');
    // const stop = document.getElementById('btnStop');
    const startMic = document.getElementById('startMic');
    const startWebcam = document.getElementById('startWebcam');
    const stopWebcam = document.getElementById('startWebcam')
    const vidSave = document.getElementById('vid2');
    const mediaRecorder = new MediaRecorder(mediaStreamObj);
    let chunks = [];

    
    start.addEventListener('click', (ev)=>{
        if(isRecording){
            mediaRecorder.start();
            isRecording = !isRecording;
            console.log(mediaRecorder.state, 'start');
            document.querySelector('#btnStart').textContent='STOP'
            // $('#btnStart').text('STOP');
        } else {
            mediaRecorder.stop();
            $("#myModal").modal();
            console.log(mediaRecorder.state, 'stop');
            // $('#btnStart').text('START');
            document.querySelector('#btnStart').textContent='START'
        }
    })
    
    startWebcam.addEventListener('click', (ev)=>{
        isWebcamOn = !isWebcamOn
        if(isWebcamOn){
            showElement()
            console.log('webcamstart', isWebcamOn)
            const track = mediaStreamObj.getTracks()[1];
            track.enabled = true
            $('#startWebcam').text('videocam');
        } else {
            console.log('webcamoff', isWebcamOn)
            hideElement()
            const track = mediaStreamObj.getTracks()[1];
            track.enabled = false

            $('#startWebcam').text('videocam_off');

        }
    });
    // stopWebcam.addEventListener('click', (ev)=>{
    //     if(!isWebcamOn){
    //         console.log('isweb', isWebcamOn)
    //         hideElement()
    //         const track = mediaStreamObj.getTracks()[1];
    //         track.enabled = false
    //     $('#startWebcam').text('videocam_off');
    //     } else{
    //     $('#startWebcam').text('videocam');
    //     }
    // });

    //micro
    startMic.addEventListener('click', (ev)=>{
        isAudioOn = !isAudioOn
        const track = mediaStreamObj.getTracks()[0];
        if (isAudioOn){
            track.enabled = true;
            console.log(mediaRecorder.state, 'start');
            $('#startMic').text('mic')
        } else {
            $('#startMic').text('mic_off')
             track.enabled = false

        }
    });
    // stopMic.addEventListener('click', (ev)=>{
    //     // isAudioOn = !isAudioOn
    //     if (!isAudioOn){
    //         var track = mediaStreamObj.getTracks()[0];
    //         track.enabled = false
    //         console.log(mediaStreamObj.getTracks(), 'gettracks')
    //         // mediaStreamObj.getTracks().forEach(track => track.stop())
    //         console.log(track,'track')
    //         console.log(mediaRecorder.state, 'stop');
    //         $('#startMic').text('mic_off')
    //     } else {
    //         $('#startMic').text('mic')
    //     }
    // });
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

let isAlarmOn = true;


// jQuery start
    $(function () {
        $(".winston").draggable()
    });

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

function showElement(){
    var x = document.getElementById("wbcm");
      x.style.display = "block";
}

function hideElement() {
    var x = document.getElementById("wbcm");
      x.style.display = "none";
  };
