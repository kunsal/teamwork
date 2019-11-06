const response = require('../../helpers/response');
const User = require('../../models/user.model');

const user = new User();

module.exports.create = async (req, res) => {
  try {
    const data = req.body;
    // Run validation
    const { error } = user.validate(data);
    if (error) {
      return res.status(400).send(response.error(error.details[0].message));
    }
    // Check if email already exists
    if (await user.exists('email', data.email)) {
      return res.status(400).send(response.error('Email already registered'));
    }
    // Check if employee id already exists
    if (await user.exists('employeeId', data.employeeId)) {
      return res.status(400).send(response.error('Employee ID already registered'));
    }
    // Get hashed password
    const hashed = await user.hash(data.password);
    data.password = hashed;
    // All is fine, then create user
    const newUser = await user.create(data);
    // Prepare users jwt token
    if (newUser.rowCount === 1) {
      res.status(201).send(response.success('User created successful'));
    }
    // const token = user.generateAuthToken(newUser)
  } catch (e) {
    res.status(500).send(response.error('An error occurred. Please try again'));
    throw new Error(e);
  }
};
