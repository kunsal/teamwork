const BaseModel = require('./base.model');
class User extends BaseModel{
  constructor() {
    super('users');
  }
}

module.exports = User;  