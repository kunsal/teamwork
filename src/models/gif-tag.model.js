const BaseModel = require('./base.model');

class GifTag extends BaseModel {
  constructor() {
    super('gifsTags');
  }
};

module.exports = GifTag;