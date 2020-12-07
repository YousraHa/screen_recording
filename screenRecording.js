const startRecBtn = document.getElementById("startRecBtn");
const recordedScreen = document.querySelector("#recordedScreen");
let recorder, stream;
let isScreenRecording = true;

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
}

startRecBtn.addEventListener("click", () => {
  isScreenRecording = !isScreenRecording
  if (!isScreenRecording){
    console.log("test1")
    startRecording();
    $('#startRecBtn').text('STOPscreen')
} else {
  console.log("test2")
  recorder.stop();
  stream.getVideoTracks()[0].stop();
  $('#startRecBtn').text('STARTscreen')
}
});

// stop.addEventListener("click", () => {
//   // stream.getVideoTracks()[0].stop();
//   // isRecording = !isRecording
//   if (!isRecording){
//     stop.setAttribute("disabled", true);
//     start.removeAttribute("disabled");
//     console.log("test1")
//     recorder.stop();
//     $('#start1').text('STOP')
// } else {
//     $('#start1').text('START')
// }
// });