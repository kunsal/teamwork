const response = require('../../helpers/response');
const User = require('../../models/user.model');

const userModel = new User();

module.exports.login = async (req, res) => {
  const { error } = userModel.validateLogin(req.body);
  if (error) return res.status(400).send(response.error(error.details[0].message));
  try {
    const user = await userModel.findBy('email', req.body.email, true);
    if (user.rowCount < 1) return res.status(400).send(response.error('Invalid email/password'));
    const currentUser = user.rows[0];
    const {
      id, password, isAdmin, firstName, lastName,
    } = currentUser;
    const validPassword = await userModel.verify(req.body.password, password);
    if (!validPassword) return res.status(400).send(response.error('Invalid email/password'));
    const token = userModel.generateAuthToken(currentUser);
    const data = {
      token,
      userId: id,
      isAdmin,
      firstName,
      lastName,
    };
    return res.send(response.success(data));
  } catch (e) {
    res.status(500).send(response.error('Whoops! Something went wrong. Try again'));
    throw new Error(e);
  }
};
