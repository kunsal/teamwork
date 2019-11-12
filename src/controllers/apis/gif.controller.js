const GifModel = require('../../models/gif.model');
const CommentModel = require('../../models/comment.model');
const response = require('../../helpers/response');
const cloudinary = require('../../config/cloudinary-config');

const Gif = new GifModel();
const Comment = new CommentModel();

const create = async (req, res) => {
  try {
    const { file } = req;
    const fileError = await Gif.validateFile(file);
    if (fileError) return res.status(400).send(response.error(fileError));
    const { path } = file;
    const uniqueFilename = new Date().toISOString();
    cloudinary.uploader.upload(path, {
      public_id: `teamwork/${uniqueFilename}`, tags: `${req.body.tags}`,
    }, async (err, image) => {
      if (err) return res.status(500).send(response.error('Image could not be uploaded'));
      await Gif.deleteFile(path);
      const data = {
        author: req.user.userId,
        title: req.body.title,
        imageUrl: image.url,
        imagePublicId: image.public_id,
        originalFilename: image.original_filename,
        height: image.height,
        width: image.width,
        createdAt: image.created_at,
        tags: JSON.stringify(image.tags),
      };
      const gif = await Gif.create(data);
      if (gif.rowCount === 1) {
        const gifData = gif.rows[0];
        gifData.message = 'GIF image successfully posted';
        return res.status(201).send(response.success(gifData));
      }
    });
    return;
  } catch (e) {
    console.log(e.message);
    return res.status(500).send(e);
  }
};

const single = async (req, res) => {
  try {
    const gif = await Gif.findBy('id', req.params.id);
    if (gif.rowCount < 1) return res.status(404).send(response.error('No GIF found'));
    return res.send(response.success(gif.rows[0]));
  } catch (e) {
    return res.status(500).send('Whoops! An error occurred, please try again');
  }
};

const deleteGif = async (req, res) => {
  try {
    const { id } = req.params;
    const gif = await Gif.findBy('id', id);
    if (gif.rowCount < 1) return res.status(404).send(response.error('No GIF found'));
    const gifData = gif.rows[0];
    // Only Original Poster or admin can delete this gif
    if (req.user.userId === gifData.author) {
      const deletedGif = await Gif.delete('id', req.params.id);
      if (deletedGif.rowCount < 1) return res.status(400).send(response.error('Gif could not be deleted'));
      // Delete gif comments
      await Comment.delete('postId', id);
      const deletedGifData = deleteGif.rows[0];
      deletedGifData.message = 'GIF post successfully deleted';
      return res.send(response.success(deletedGifData));
    }
    return res.status(401).send(response.error('Unauthorized'));
  } catch (e) {
    return res.status(500).send('Whoops! An error occurred, please try again');
  }
};

const commentOnGif = async (req, res) => {
  try {
    const gifId = req.params.id;
    // Does gif exist?
    const gif = await Gif.findBy('id', gifId);
    if (gif.rowCount < 1) return res.status(404).send(response.error('GIF does not exist')); 
    const { error } = Comment.validate(req.body);
    if (error) return res.status(400).send(response.error(error.details[0].message));
    const data = {
      commenter: req.user.userId,
      comment: req.body.comment,
      postType: 'gif',
      postId: gifId,
    };
    const commented = await Comment.create(data);
    return res.send(response.success(commented.rows[0]));
  } catch (e) {
    return res.status(500).send('Whoops! An error occurred, please try again');
  }
};

module.exports = {
  create,
  single,
  deleteGif,
  commentOnGif,
};
