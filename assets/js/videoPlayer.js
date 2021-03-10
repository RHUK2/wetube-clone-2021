const videoContainer = document.getElementById('jsVideoPlayer');
const videoPlayer = document.querySelector('#jsVideoPlayer video');
const playBtn = document.getElementById('jsPlayButton');
const volumeBtn = document.getElementById('jsVolumeButton');
const fullScrnBtn = document.getElementById('jsScreenButton');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');

const volumeRange = document.getElementById('jsVolume');

function registerView() {
  const videoId = window.location.href.split('/videos/')[1];
  fetch(`/api/${videoId}/view`, {
    method: 'post'
  });
}

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause">';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play">';
  }
}

function handleVolumeClick() {
  if (videoPlayer.muted) {
    console.log(videoPlayer.volume);

    videoPlayer.muted = false;
    volumeRange.value = videoPlayer.volume;
    volumeBtn.innerHTML = '<i class="fas fa-volume-up">';
  } else {
    console.log(videoPlayer.volume);
    videoPlayer.muted = true;
    volumeRange.value = 0;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute">';
  }
}

function exitFullScreen() {
  fullScrnBtn.innerHTML = '<i class="fas fa-expand">';
  // document.exitFullscreen();
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  fullScrnBtn.removeEventListener('click', exitFullScreen);
  fullScrnBtn.addEventListener('click', goFullScreen);
}

function goFullScreen() {
  fullScrnBtn.innerHTML = '<i class="fas fa-compress">';
  // videoContainer.requestFullscreen();
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }
  fullScrnBtn.removeEventListener('click', goFullScreen);
  fullScrnBtn.addEventListener('click', exitFullScreen);
}

const formatDate = seconds => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${hours}:${minutes}:${totalSeconds}`;
};

function setTotalTime() {
  const totalTimeString = formatDate(videoPlayer.duration);
  totalTime.textContent = totalTimeString;
}

function getCurrentTime() {
  const currentTimeString = formatDate(videoPlayer.currentTime);
  currentTime.textContent = currentTimeString;
}

function handleEnded() {
  playBtn.innerHTML = '<i class="fas fa-play">';
  videoPlayer.currentTime = 0;
}

function handleDrag(e) {
  const {
    target: { value }
  } = e;
  videoPlayer.volume = value;
  if (value === '0') volumeBtn.innerHTML = '<i class="fas fa-volume-mute">';
  else volumeBtn.innerHTML = '<i class="fas fa-volume-up">';
}

function init() {
  playBtn.addEventListener('click', handlePlayClick);
  volumeBtn.addEventListener('click', handleVolumeClick);
  fullScrnBtn.addEventListener('click', goFullScreen);
  videoPlayer.addEventListener('loadedmetadata', setTotalTime);
  videoPlayer.addEventListener('timeupdate', getCurrentTime);
  videoPlayer.addEventListener('ended', handleEnded);
  videoPlayer.addEventListener('ended', registerView);
  volumeRange.addEventListener('input', handleDrag);

  volumeBtn.addEventListener('mouseover', () => {
    volumeRange.style.display = 'block';
  });
  volumeRange.addEventListener('mouseleave', () => {
    volumeRange.style.display = 'none';
  });
  videoPlayer.addEventListener('mouseleave', () => {
    volumeRange.style.display = 'none';
  });
}

if (videoContainer) {
  init();
}
