const response = require('../../helpers/response');
const User = require('../../models/user.model');
const user =  new User;

module.exports.create = async (req, res) => {
  try {
    const users = await user.findBy('email', 'kunsal2003@gmail.com', true);
    if (users.rows.length < 1) return res.status(404).send(response.error('No user found'));
    res.send(response.success(users.rows));
  } catch (e) {
    console.log(e);
  }
  
}