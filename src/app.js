import path from 'path';
// Server FrameWork
import express from 'express';
// Middleware
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import morgan from 'morgan';
import { localMiddleware } from './middlewares';
// Router
import globalRouter from './routers/globalRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';
import routes from './routes';
// passport Config
import './passport';
import apiRouter from './routers/apiRouter';

dotenv.config();

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.PRODUCTION
        ? process.env.ATLAS_CONNECTION_KEY
        : process.env.MONGO_URL
    })
  })
);
// passport 초기화
app.use(passport.initialize());
app.use(passport.session());

app.use(localMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);

export default app;
