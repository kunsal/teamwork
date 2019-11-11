const BaseModel = require('./base.model');
const BaseJoi = require('joi');
const ImageExtension = require('joi-image-extension');
const fs = require('fs');

const Joi = BaseJoi.extend(ImageExtension);

class Gif extends BaseModel{
  constructor() {
    super('gifs');
  }

  /**
   * Check if value of a field already exists 
   * @param {string} field 
   * @param {string} value 
   * @returns {boolean}
   */
  async exists(field, value) {
    const gif = await this.findBy(field, value, true);
    // Check if user returns count
    if (gif.rowCount > 0) {
      return true;
    }
    return false;
  }

  async validateFile({ mimetype, path, size }) {
    if (mimetype !== 'image/gif') {
      await this.deleteFile(path)
      return 'Only gif files are allowed'
    } else if (size > 10000000){
      await this.deleteFile(path)
      return 'Maximum allowable size is 10MB'
    } else {
      return false;
    }
  }
  
  async deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
      if (err) {
        throw new Error(err);
      }
    })
  }

  /**
   * Validate request data
   * @param {object} user 
   */
  validate(gif) {
    return Joi.validate(gif, {
      image: Joi.string().required(),
      title: Joi.string().required().min(3).max(50),
      description: Joi.string().required().min(3).max(200),
    });
  }

}

module.exports = Gif;  