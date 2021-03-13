import axios from 'axios';

const commentList = document.getElementById('jsCommentList');
const deleteCommentBtn = document.querySelectorAll('#jsDeleteCommentBtn');
const commentNumber = document.getElementById('jsCommentNumber');

const fakeDecreaseNumber = () => {
  commentNumber.textContent = parseInt(commentNumber.textContent, 10) - 1;
};

function fakeDeleteComment() {
  const li = commentList.querySelector('li');
  commentList.removeChild(li);
  fakeDecreaseNumber();
}

async function sendCommentForDel(comment) {
  const videoId = window.location.href.split('/videos/')[1];
  const response = await axios({
    url: `/api/${videoId}/delete`,
    method: 'POST',
    data: {
      comment
    }
  });
  if (response.status === 200) fakeDeleteComment();
}

function handleClick(e) {
  const comment = e.target.previousSibling.textContent;
  sendCommentForDel(comment);
}

function init() {
  deleteCommentBtn.forEach(deleteBtn => {
    deleteBtn.addEventListener('click', handleClick);
  });
}
if (commentList) {
  init();
}

export default handleClick;
