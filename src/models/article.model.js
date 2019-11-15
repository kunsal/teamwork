const BaseModel = require('./base.model');
const Joi = require('joi');

class Article extends BaseModel{
  constructor() {
    super('articles');
  }

  async findByTags(tags) {
    const parameters = this.parameterize(tags);

    const text = `select t.tag, a.* from articles a
                  inner join articlesTags at on a.id = at.articleId
                  inner join tags t on at.tagId = t.id
                  where t.tag in (${parameters});`;
    return this.query(text, tags);
  }
  
  /**
   * Validate request data
   * @param {object} user 
   */
  validate(article) {
    return Joi.validate(article, {
      title: Joi.string().required().min(3).max(50),
      article: Joi.string().required().min(3),
      tags: Joi.array()
    });
  }

  validateFlag(article) {
    return Joi.validate(article, {
      inappropriate: Joi.boolean().required()
    });
  }

}

module.exports = Article;  