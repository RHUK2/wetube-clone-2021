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
    req.flash('error', "Passwords don't match");
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
  successRedirect: routes.home,
  successFlash: 'Welcome',
  failureFlash: "Can't log in. Check email and/or password"
});
// githbu
export const githubLogin = passport.authenticate('github', {
  successFlash: 'Welcome',
  failureFlash: "Can't log in at this time"
});
export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      await user.save();
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
export const kakaoLogin = passport.authenticate('kakao', {
  successFlash: 'Welcome',
  failureFlash: "Can't log in at this time"
});
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
      await user.save();
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
  req.flash('info', 'Logged out, see you later');
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
    req.flash('error', 'User not found');
    res.redirect(routes.home);
  }
};
export const getEditProfile = (req, res) =>
  res.render('editProfile', { pageTitle: 'Edit Profile' });
export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl
    });
    req.flash('success', 'Profile updated');
    res.redirect(routes.me);
  } catch (err) {
    req.flash('error', "Can't update profile");
    res.render('editProfile', { pageTitle: 'Edit Profile' });
  }
};
export const getChangePassword = (req, res) =>
  res.render('changePassword', { pageTitle: 'Change Password' });
export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 }
  } = req;
  try {
    if (newPassword !== newPassword1) {
      req.flash('error', "Passwords don't match");
      res.status(400);
      res.redirect(`/users${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (err) {
    req.flash('error', "Can't change password");
    res.status(400);
    res.redirect(`/users${routes.changePassword}`);
  }
};
