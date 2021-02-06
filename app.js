import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import { userRouter } from "./router";
const app = express();

const handleHome = (req, res) => res.send("hi it's my home");
const handleProfile = (req, res) => res.send("it's profile");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", handleHome);
app.get("/profile", handleProfile);

app.use("/user", userRouter);

export default app;
