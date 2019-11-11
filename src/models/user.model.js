const BaseModel = require('./base.model');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

class User extends BaseModel{
  constructor() {
    super('users');
  }

  /**
   * Check if value of a field already exists 
   * @param {string} field 
   * @param {string} value 
   * @returns {boolean}
   */
  async exists(field, value) {
    const user = await this.findBy(field, value, true);
    // Check if user returns count
    if (user.rowCount > 0) {
      return true;
    }
    return false;
  }

  /**
   * Generate hash from string
   * @param {string} str 
   * @returns {string} hashed
   */
  async hash(str) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(str, salt);
      return hashed;
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Compare passwords
   * @param {string} password 
   * @param {string} hashedPassword
   * @returns {boolean} 
   */
  async verify(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  generateAuthToken(user) {
    const token = jwt.sign(
      { 
        userId: user.id, isAdmin: user.isadmin, email: user.email 
      }, 
      process.env.JWT_PRIVATE_KEY, 
      {
        expiresIn: '1h'
      });
    return token;
  }

  /**
   * Validate request data
   * @param {object} user 
   */
  validate(user) {
    return Joi.validate(user, {
      firstName: Joi.string().required().min(3).max(50),
      lastName: Joi.string().required().min(3).max(50),
      email: Joi.string().email().required().min(7).max(50),
      password: Joi.string().required().min(5).max(100),
      gender: Joi.string().required().regex(/male|female/),
      employeeId: Joi.string().required(),
      jobRole: Joi.string().required().min(2).max(30),
      department: Joi.string().required().min(2).max(50),
      isAdmin: Joi.boolean(),
    });
  }

  validateLogin(user) {
    return Joi.validate(user, {
      email: Joi.string().required().email(),
      password: Joi.string().required()
    });
  }
}

module.exports = User;  