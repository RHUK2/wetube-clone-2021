import express from 'express';
import {
  postAddComment,
  postDeleteComment,
  postRegisterView
} from '../controllers/videoController';
import routes from '../routes';

const apiRouter = express.Router();

apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComment, postAddComment);
apiRouter.post(routes.deleteComment, postDeleteComment);

export default apiRouter;
