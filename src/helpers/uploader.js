const cloudinary = require('../config/cloudinary-config');

module.exports.upload = (file) => new Promise((resolve) => {
  cloudinary.uploader.upload(file, (result) => {
    resolve({ url: result.url, id: result.public_id });
  },
  { resource_type: 'auto' });
});
