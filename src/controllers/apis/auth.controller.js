const response = require('../../helpers/response');
const User = require('../../models/user.model');

const userModel = new User();

module.exports.login = async (req, res) => {
  const { error } = userModel.validateLogin(req.body);
  if (error) return res.status(400).send(response.error(error.details[0].message));
  try {
    let user = await userModel.findBy('email', req.body.email, true);
    console.log(user);
    if (!user) return res.status(400).send(response.error('Invalid email/password'));
    const validPassword = await userModel.verify(req.body.password, user.password);
    if (!validPassword) return res.status(400).send(response.error('Invalid email/password'));
    const token = userModel.generateAuthToken();
    return res.send(response.success(token));
  } catch (e) {
    console.log(e);
    res.status(500).send(response.error('Whoops! Something went wrong. Try again'));
  }
  
}