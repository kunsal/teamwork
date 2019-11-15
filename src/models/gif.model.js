const BaseModel = require('./base.model');
const Joi = require('joi');
const fs = require('fs');

class Gif extends BaseModel{
  constructor() {
    super('gifs');
  }

  async findByTags(tags) {
    const parameters = this.parameterize(tags);

    const text = `select t.tag, a.* from gifs g
                  inner join gifsTags at on g.id = gt.gifId
                  inner join tags t on gt.tagId = t.id
                  where t.tag in (${parameters});`;
    return this.query(text, tags);
  }

  async validateFile(image) {
    if (!image) return 'image is required';
    const { mimetype, path, size } = image;
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

  validateFlag(article) {
    return Joi.validate(article, {
      inappropriate: Joi.boolean().required()
    });
  }

}

module.exports = Gif;  