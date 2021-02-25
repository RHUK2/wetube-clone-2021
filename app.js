import express from 'express';

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import { localMiddleware } from './middlewares';

import globalRouter from './routers/globalRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';
import routes from './routes';

const app = express();

app.set('view engine', 'pug');
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static('static'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(localMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;
