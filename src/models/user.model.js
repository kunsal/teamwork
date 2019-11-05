const BaseModel = require('./base.model');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const logger = require('../helpers/logger');

class User extends BaseModel{
  constructor() {
    super('users');
  }

  async exists(field, value) {
    const user = await this.findBy(field, value, true);
    // User
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
      logger.error(e);
      throw new Error(e);
    }
  }

  /**
   * Validate request data
   * @param {object} user 
   */
  validate(user) {
    return Joi.validate(user, {
      first_name: Joi.string().required().min(3).max(50),
      last_name: Joi.string().required().min(3).max(50),
      email: Joi.string().email().required().min(7).max(50),
      password: Joi.string().required().min(5).max(100),
      gender: Joi.string().required().regex(/male|female/),
      employee_id: Joi.string().required(),
      job_role: Joi.string().required().min(2).max(30),
      department: Joi.string().required().min(2).max(50),
      is_admin: Joi.boolean(),
    });
  }
}

module.exports = User;  