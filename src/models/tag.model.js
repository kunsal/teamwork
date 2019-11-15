const BaseModel = require('./base.model');
const Joi = require('joi');

class Tag extends BaseModel {
  constructor() {
    super('tags');
  }

  validate(tag) {
    return Joi.validate(tag, {
      tags: Joi.array()
    });
  }
};

module.exports = Tag;