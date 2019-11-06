const { error } = require('../helpers/response');

module.exports = async (req, res, next) => {
  const { user } = req;
  if (!user.isAdmin) {
    return res.status(401).send(error('Unauthorized'));
  }
  return next();
};
