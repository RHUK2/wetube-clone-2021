import passport from 'passport';
import routes from '../routes';
import User from '../models/User';

export const getJoin = (req, res) => {
  res.render('join', { pageTitle: 'Join' });
};
export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
  } = req;

  if (password !== password2) {
    res.status(400);
    res.render('join', { pageTitle: 'Join' });
  } else {
    try {
      const user = User({
        name,
        email
      });
      await User.register(user, password);
      next();
    } catch (err) {
      console.log(err);
      res.redirect(routes.home);
    }
    //  To Do: Log user in
  }
};

export const getLogin = (req, res) => {
  res.render('login', { pageTitle: 'Login' });
};
// 'local'은 우리가 설치해준 '전략'을 의미, 로그인 시켜주는 역할, req.user 설정
export const postLogin = passport.authenticate('local', {
  failureRedirect: routes.login,
  successRedirect: routes.home
});
// githbu
export const githubLogin = passport.authenticate('github');
export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email }
  } = profile;
  console.log(name, email);
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      name,
      email,
      githubId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (err) {
    return cb(err);
  }
};
export const postGithubLogIn = (req, res) => {
  res.redirect(routes.home);
};
// kakao
export const kakaoLogin = passport.authenticate('kakao');
export const kakaoLoginCallback = async (_, __, profile, cb) => {
  const {
    id,
    username,
    _json: {
      kakao_account: { email },
      properties: { profile_image: profileImage }
    }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.kakaoId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      name: username,
      email,
      avatarUrl: profileImage
    });
    return cb(null, newUser);
  } catch (err) {
    return cb(err);
  }
};
export const postKakaoLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};

export const getMe = (req, res) => {
  res.render('userDetail', { pageTitle: 'User Detail', user: req.user });
};

export const userDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const user = await User.findById(id);
    res.render('userDetail', { pageTitle: 'User Detail', user });
  } catch (err) {
    res.redirect(routes.home);
  }
};
export const getEditProfile = (req, res) =>
  res.render('editProfile', { pageTitle: 'Edit Profile' });
export const changePassword = (req, res) =>
  res.render('changePassword', { pageTitle: 'Change Password' });
