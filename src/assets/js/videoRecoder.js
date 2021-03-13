const recorderContainer = document.getElementById('jsRecorderContainer');
const recordBtn = document.getElementById('jsRecordBtn');
const videoPreview = document.getElementById('jsVideoPreview');

let streamObject;
let videoRecorder;

function handleVideoData(e) {
  const { data: videoFile } = e;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(videoFile);
  link.download = 'record.webm';
  document.body.appendChild(link);
  link.click();
}

function stopRecording() {
  videoRecorder.stop();
  recordBtn.removeEventListener('click', stopRecording);
  recordBtn.addEventListener('click', getVideo);
  recordBtn.innerHTML = 'Start Recording';
}

function startRecording() {
  videoRecorder = new MediaRecorder(streamObject);
  videoRecorder.start();
  videoRecorder.addEventListener('dataavailable', handleVideoData);
  recordBtn.addEventListener('click', stopRecording);
}

async function getVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });
    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    videoPreview.play();
    recordBtn.innerHTML = 'Stop Recording';
    streamObject = stream;
    startRecording();
  } catch (err) {
    recordBtn.textContent = '😐 Cannot record';
  } finally {
    recordBtn.removeEventListener('click', getVideo);
  }
}

function init() {
  recordBtn.addEventListener('click', getVideo);
}

if (recorderContainer) {
  init();
}
