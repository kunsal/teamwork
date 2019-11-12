const BaseModel = require('./base.model');
const Joi = require('joi');

class Comment extends BaseModel{
  constructor() {
    super('comments');
  }

  /**
   * Get record(s by field
   * @param {string} field 
   * @param {string} value 
   * @param {boolean} single 
   */
  async findByType(field, value, type) {
    let text = `SELECT * FROM ${this.table} WHERE postType = '${type}' AND ${field} = $1`;
    let values = [ value ];
    return this.query(text, values);
  }

  validate(comment) {
    return Joi.validate(comment, {
      comment: Joi.string().required(),
    });
  }
}

module.exports = Comment;  