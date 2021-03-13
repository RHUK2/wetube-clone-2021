import routes from '../routes';
import Video from '../models/Video';
import Comment from '../models/Comment';

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render('home', { pageTitle: 'Home', videos });
  } catch (err) {
    res.render('home', { pageTitle: 'Home', videos: [] });
  }
};
export const search = async (req, res) => {
  const {
    query: { term: searchingBy }
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: 'i' }
    });
  } catch (err) {
    console.log(err);
  }
  res.render('search', { pageTitle: 'Search', searchingBy, videos });
};
export const getUpload = (req, res) => {
  res.render('upload', { pageTitle: 'Upload' });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location }
  } = req;
  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: req.user.id
  });
  req.user.videos.push(newVideo.id);
  await req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};
export const videoDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id)
      .populate('creator')
      .populate('comments');
    const comments = await Comment.find({});
    res.render('videoDetail', { pageTitle: video.title, video, comments });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};
export const getEditVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator.toString() !== req.user.id) {
      throw Error();
    } else {
      res.render('editVideo', { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (err) {
    res.redirect(routes.home);
  }
};
export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (err) {
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    console.log(id);
    if (video.creator.toString() !== req.user.id) {
      console.log(video.creator, req.user.id);
      console.log(typeof video.creator, typeof req.user.id);
      throw Error();
    } else {
      await Video.findOneAndDelete({ _id: id });
    }
  } catch (err) {
    console.log(err);
  }
  res.redirect(routes.home);
};

//

export const postRegisterView = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (err) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user
  } = req;
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id
    });
    video.comments.push(newComment._id);
    video.save();
  } catch (err) {
    console.log(err);
    res.status(400);
  } finally {
    res.end();
  }
};

export const postDeleteComment = async (req, res) => {
  const {
    params: { id },
    body: { comment }
  } = req;
  try {
    const video = await Video.findById(id).populate('comments');
    const temp = video.comments.find(element => element.text === comment);
    await Comment.findByIdAndDelete(temp._id);
  } catch (err) {
    console.log(err);
    res.status(400);
  } finally {
    res.end();
  }
};
