import dotenv from 'dotenv';
import passport from 'passport';
import GithubStrategy from 'passport-github';
import { githubLoginCallback } from './controllers/userController';
import User from './models/User';

dotenv.config();

// passport-local-mongoose가 만든 '전략' 사용
passport.use(User.createStrategy());
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: 'http://localhost:4000/auth/github/callback'
    },
    githubLoginCallback
  )
);

// '이봐, passport. 쿠키에 user.id를 담아줘'
passport.serializeUser(User.serializeUser());
// 'user.id를 사용자로 전환시켜줘'
passport.deserializeUser(User.deserializeUser());
