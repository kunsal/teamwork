const response = require('../../helpers/response');
const User = require('../../models/user.model');
const { serverError } = require('../../helpers/helper');

const user = new User();

/**
 * Check the existence of fields
 * @param {array} fields
 * @param {array} values
 */
const userExists = async (fields, values) => {
  if (fields.length !== values.length) {
    throw new Error('Fields and values must be of the same length');
  }
  for (let i = 0; i < fields.length; i + 1) {
    if (await user.exists(fields[i], values[i])) {
      return `${fields[i]} already registered`;
    }
  }
  return false;
};

module.exports.create = async (req, res) => {
  try {
    const data = req.body;
    // Run validation
    const { error } = user.validate(data);
    if (error) {
      res.status(400).send(response.error(error.details[0].message));
      return;
    }
    // Check if user email or employeeId already exists
    const existError = await userExists(['email', 'employeeId'], [data.email, data.employeeId]);
    if (existError) return res.status(400).send(response.error(existError));

    // Get hashed password
    const hashed = await user.hash(data.password);
    data.password = hashed;
    // All is fine, then create user
    const newUser = await user.create(data);
    // Prepare users jwt token
    if (newUser.rowCount === 1) {
      const userData = newUser.rows[0];
      delete userData.password;
      res.status(201).send(response.success(userData));
    }
    // const token = user.generateAuthToken(newUser)
  } catch (e) {
    serverError(res, e);
  }
};
