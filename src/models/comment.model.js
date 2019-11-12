const BaseModel = require('./base.model');
const Joi = require('joi');

class Comment extends BaseModel{
  constructor() {
    super('comments');
  }

  validate(comment) {
    return Joi.validate(comment, {
      comment: Joi.string().required(),
    });
  }
}

module.exports = Comment;  