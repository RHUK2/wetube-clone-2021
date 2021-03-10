import axios from 'axios';
import handleClick from './deleteComment';

const addCommentForm = document.getElementById('jsAddComment');
const commentList = document.getElementById('jsCommentList');
const commentNumber = document.getElementById('jsCommentNumber');

const fakeIncreaseNumber = () => {
  commentNumber.textContent = parseInt(commentNumber.textContent, 10) + 1;
};

const fakeAddComment = comment => {
  const li = document.createElement('li');
  const span = document.createElement('span');
  const i = document.createElement('i');
  span.textContent = comment;
  i.classList.add('far');
  i.classList.add('fa-times-circle');
  i.addEventListener('click', handleClick);
  li.appendChild(span);
  li.appendChild(i);
  commentList.prepend(li);
  fakeIncreaseNumber();
};

async function sendCommentForAdd(comment) {
  const videoId = window.location.href.split('/videos/')[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: 'POST',
    data: {
      comment
    }
  });
  if (response.status === 200) fakeAddComment(comment);
}

function handleSubmit(e) {
  e.preventDefault();
  const commentInput = addCommentForm.querySelector('input');
  const comment = commentInput.value;
  sendCommentForAdd(comment);
  commentInput.value = '';
}

function init() {
  addCommentForm.addEventListener('submit', handleSubmit);
}

if (addCommentForm) {
  init();
}
