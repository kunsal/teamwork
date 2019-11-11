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
    console.log(path);
    cloudinary.uploader.upload(path, {
      public_id: `teamwork/${uniqueFilename}`, tags: `teamwork`
    }, (err, image) => {
      if (err) return res.status(500).send(err);
      //await Gif.deleteFile(path);
      return res.send(image);
    });
   // res.send('Gif validation passed');
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
  
}

module.exports = {
  create
}
