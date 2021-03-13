import express from 'express';
import passport from 'passport';
import routes from '../routes';
import {
  getJoin,
  getLogin,
  getMe,
  githubLogin,
  kakaoLogin,
  logout,
  postGithubLogIn,
  postJoin,
  postKakaoLogin,
  postLogin
} from '../controllers/userController';
import { home, search } from '../controllers/videoController';
import { onlyPrivate, onlyPublic } from '../middlewares';

const globalRouter = express.Router();

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.logout, onlyPrivate, logout);
globalRouter.get(routes.search, search);

globalRouter.get(routes.github, githubLogin);
globalRouter.get(
  routes.githubCallback,
  passport.authenticate('github', { failureRedirect: routes.login }),
  postGithubLogIn
);

globalRouter.get(routes.kakao, kakaoLogin);
globalRouter.get(
  routes.kakaoCallback,
  passport.authenticate('kakao', { failureRedirect: routes.login }),
  postKakaoLogin
);

globalRouter.get(routes.me, getMe);

export default globalRouter;
