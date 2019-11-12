const BaseModel = require('./base.model');
const Joi = require('joi');

class Article extends BaseModel{
  constructor() {
    super('articles');
  }
  
  /**
   * Validate request data
   * @param {object} user 
   */
  validate(article) {
    return Joi.validate(article, {
      title: Joi.string().required().min(3).max(50),
      article: Joi.string().required().min(3),
      tags: Joi.string()
    });
  }

}

module.exports = Article;  