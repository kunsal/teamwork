const GifModel = require('../../models/gif.model');
const response = require('../../helpers/response');
const cloudinary = require('../../config/cloudinary-config');

const Gif = new GifModel;

const create = async (req, res) => {
  try {
    const file = req.file;
    const fileError = await Gif.validateFile(file);
    if (fileError) return res.status(400).send(response.error(fileError));
    // const { error } = Gif.validate(req.body);
    // if (error) return res.status(400).send(response.error(error.details[0].message));
    const { path } = file;
    const uniqueFilename = new Date().toISOString();
    cloudinary.uploader.upload(path, {
      public_id: `teamwork/${uniqueFilename}`, tags: `teamwork`
    }, async (err, image) => {
      if (err) return res.status(500).send(response.error('Image could not be uploaded'));
      await Gif.deleteFile(path);
      data = {
        author: req.user.userId,
        title: req.body.title,
        imageUrl: image.url,
        imagePublicId: image.public_id,
        originalFilename: image.original_filename,
        height: image.height,
        width: image.width,
        createdAt: image.created_at,
        tags: JSON.stringify(image.tags)
      };
      const gif = await Gif.create(data);
      if (gif.rowCount === 1) {
        res.status(201).send(response.success({
          message: 'GIF image successfully posted',
          createdOn: data.createdAt,
          title: data.title,
          imageUrl: data.imageUrl,
          author: data.author
        }));
      }
    });
   // res.send('Gif validation passed');
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
}

const single = async(req, res) => {
  try {
    const gif = await Gif.findBy('id', req.params.id);
    if (gif.rowCount < 1) return res.status(404).send(response.error('No GIF found'))
    res.send(response.success(gif.rows[0]));
  } catch (e) {
    return res.status(500).send('Whoops! An error occurred, please try again');
  }
  
}

const deleteGif = async(req, res) => {
  try {
    const gif = await Gif.findBy('id', req.params.id);
    if (gif.rowCount < 1) return res.status(404).send(response.error('No GIF found'));
    // Only OP or admin can delete this gif
    if (req.userId === gif.author || req.isAdmin) {
      const deleted = await Gif.delete('id', req.params.id);
      if (!deleted) return res.status(400).send(response.error('Gif could not be deleted'));
      gif.message = 'GIF post successfully deleted';
      res.send(response.success(gif.rows[0]));
    } else {
      res.status(401).send(response.error('Unauthorized operation'));
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send('Whoops! An error occurred, please try again');
  }
}

module.exports = {
  create,
  single,
  deleteGif
}
