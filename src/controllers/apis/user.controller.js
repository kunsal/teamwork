const response = require('../../helpers/response');
const User = require('../../models/user.model');
const { serverError, errorResponse, renameKeys } = require('../../helpers/helper');

const user = new User();

module.exports.create = async (req, res) => {
  try {
    const data = req.body;
    // Run validation
    const { error } = user.validate(data);
    if (error) {
      res.status(400).send(response.error(error.details[0].message));
      return;
    }
    // Check if user email is already exists
    const emailExists = await user.exists('email', data.email);
    if (emailExists) return errorResponse(res, 'email already registered');
    // Check if user employeeId is already exists
    const employeeIdExists = await user.exists('employeeId', data.employeeId);
    if (employeeIdExists) return errorResponse(res, 'employeeId already registered');
    // Get hashed password
    const hashed = await user.hash(data.password);
    data.password = hashed;
    // All is fine, then create user
    const newUser = await user.create(data);
    // Prepare users jwt token
    if (newUser.rowCount === 1) {
      const userData = newUser.rows[0];
      renameKeys([
        {userId: 'id'},
        {firstName: 'firstname'},
        {lastName: 'lastname'},
        {jobRole: 'jobrole'},
        {employeeId: 'employeeid'},
        {isAdmin: 'isadmin'},
      ], userData);
      userData.token = user.generateAuthToken(userData);
      delete userData.password;
      res.status(201).send(response.success(userData));
    }
    // const token = user.generateAuthToken(newUser)
  } catch (e) {
    serverError(res, e);
  }
};
