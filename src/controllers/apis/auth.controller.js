const response = require('../../helpers/response');
const User = require('../../models/user.model');
const { serverError, errorResponse } = require('../../helpers/helper');

const userModel = new User();

module.exports.login = async (req, res) => {
  try {
    const { error } = userModel.validateLogin(req.body);
    if (error) return errorResponse(res, error.details[0].message);
    const user = await userModel.findBy('email', req.body.email, true);
    const loginError = 'Invalid email/password';
    if (user.rowCount < 1) return errorResponse(res, loginError);
    const currentUser = user.rows[0];
    const {
      id, password, isadmin, firstname, lastname, email
    } = currentUser;
    const validPassword = await userModel.verify(req.body.password, password);
    if (!validPassword) return errorResponse(res, loginError);
    const token = userModel.generateAuthToken(currentUser);
    const data = {
      token, userId: id, email, isAdmin: isadmin, firstName: firstname , lastName: lastname
    };
    res.send(response.success(data));
  } catch (e) {
    serverError(res, e);
  }
};
