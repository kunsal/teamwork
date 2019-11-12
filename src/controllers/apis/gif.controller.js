const GifModel = require('../../models/gif.model');
const CommentModel = require('../../models/comment.model');
const response = require('../../helpers/response');
const cloudinary = require('../../config/cloudinary-config');
const { serverError } = require('../../helpers/helper');

const Gif = new GifModel();
const Comment = new CommentModel();

const prepareGifData = (req, image) => {
  return {
    author: req.user.userId,
    title: req.body.title,
    imageUrl: image.url,
    imagePublicId: image.public_id,
    originalFilename: image.original_filename,
    height: image.height,
    width: image.width,
    createdAt: image.created_at,
    tags: image.tags.join(),
  }
}

const gifExists = async (id) => {
  const gif = await Gif.findBy('id', id);
  if (gif.rowCount < 1) return false;
  return gif.rows[0];
}

const create = async (req, res) => {
  try {
    const { file } = req;
    const fileError = await Gif.validateFile(file);
    if (fileError) return res.status(400).send(response.error(fileError));
    const { path } = file;
    const uniqueFilename = new Date().toISOString();
    const tags = req.body.tags ? req.body.tags : '';
    cloudinary.uploader.upload(path, {
      public_id: `teamwork/${uniqueFilename}`, tags: `${tags}`,
    }, async (err, image) => {
      if (err) return res.status(500).send(response.error('Image could not be uploaded'));
      await Gif.deleteFile(path);
      const gif = await Gif.create(prepareGifData(req, image));
      return res.status(201).send(response.success({message: 'GIF image successfully posted', ...gif.rows[0]}));
    });
  } catch (e) {
    serverError(res, e);
  }
};

const single = async (req, res) => {
  try {
    const gifId = req.params.id;
    const gif = await gifExists(gifId);
    if (!gif) return res.status(404).send(response.error('No GIF found'));
    // Get comments
    const comments = await Comment.findByType('postId', gifId, 'gif');
    return res.send(response.success({...gif, comments: comments.rows}));
  } catch (e) {
    serverError(res, e);
  }
};

const deleteGif = async (req, res) => {
  try {
    const { id } = req.params;
    const gif = await gifExists(req.params.id);
    if (!gif) return res.status(404).send(response.error('No GIF found'));
    // Only Original Poster or admin can delete this gif
    if (req.user.userId === gif.author) {
      const deletedGif = await Gif.delete('id', req.params.id);
      if (deletedGif.rowCount < 1) return res.status(400).send(response.error('Gif could not be deleted'));
      // Delete gif comments
      await Comment.delete('postId', id);
      return res.send(response.success({message: 'GIF post successfully deleted', ...deletedGif.rows[0]}));
    }
    return res.status(401).send(response.error('Unauthorized'));
  } catch (e) {
    serverError(res, e);
  }
};

const commentOnGif = async (req, res) => {
  try {
    const gifId = req.params.id;
    const gif = await gifExists(req.params.id);
    if (!gif) return res.status(404).send(response.error('No GIF found'));
    const { error } = Comment.validate(req.body);
    if (error) return res.status(400).send(response.error(error.details[0].message));
    const data = {
      commenter: req.user.userId,
      comment: req.body.comment,
      postType: 'gif',
      postId: gifId,
    };
    const commented = await Comment.create(data);
    return res.send(response.success({message: 'Comment successfully created', ...commented.rows[0]}));
  } catch (e) {
    serverError(res, e);
  }
};

const flagGif = async (req, res) => {
  try {
    const gifId = req.params.id;
    const gif = await Gif.findBy('id', gifId);
    if (gif.rowCount === 0) return res.status(404).send(response.error('Article does not exist'));
    const { error } = Gif.validateFlag(req.body);
    if (error) return res.status(400).send(response.error(error.details[0].message));
    const data = {
      inappropriate: req.body.inappropriate
    }
    const updatedGif = await Gif.update(data, gifId);
    res.send(response.success({ message: 'Article flag updated successfully', ...updatedGif.rows[0]}));
  } catch(e) {
    res.status(500).send('An error occurred. Please try again');
  }
}

module.exports = {
  create,
  single,
  deleteGif,
  commentOnGif,
  flagGif
};
