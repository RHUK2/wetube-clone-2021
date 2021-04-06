import dotenv from 'dotenv';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import routes from './routes';

dotenv.config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
  region: 'ap-northeast-2'
});

const multerVideo = multer({
  // defalut는 nodejs 파일시스템
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: 'rhu-demo-bucket/videos'
  })
});
const multerAvatar = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: 'rhu-demo-bucket/avatars'
  })
});

export const uploadVideo = multerVideo.single('videoFile');
export const uploadAvatar = multerAvatar.single('avatar');

export const localMiddleware = (req, res, next) => {
  res.locals.siteName = 'Wetube';
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};
