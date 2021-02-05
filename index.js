// require 함수는 express 폴더를 찾는다.
// const express = require("express");
import express from "express";
// express application을 만든다.
const app = express();

const PORT = 4000;

const handleListening = () =>
  console.log(`Listening on: http://localhost:${PORT}`);

const handleHome = (req, res) => res.send("hi it's my home");
const handleProfile = (req, res) => res.send("it's profile");

app.get("/", handleHome);
app.get("/profile", handleProfile);

app.listen(PORT, handleListening);
