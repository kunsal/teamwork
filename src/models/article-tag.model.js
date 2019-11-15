const BaseModel = require('./base.model');

class ArticleTag extends BaseModel {
  constructor() {
    super('articlesTags');
  }
};

module.exports = ArticleTag;