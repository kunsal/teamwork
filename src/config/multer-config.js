const multer = require('multer');

const MIME_TYPES = {
  'image/gif': 'gif',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images/'); // error, destination folder
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_').split('.')[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${name + Date.now()}.${extension}`); // full filename
  },
});

module.exports = multer({ storage }).single('image');
