// require 함수는 express 폴더를 찾는다.
const express = require("express");
// express application을 만든다.
const app = express();

const PORT = 4000;

function handleListening() {
  console.log(`Listening on: http://localhost:${PORT}`);
}

app.listen(PORT, handleListening);
