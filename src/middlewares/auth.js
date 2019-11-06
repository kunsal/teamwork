require('dotenv').config();
const jwt = require('jsonwebtoken');
const { error } = require('../helpers/response');

module.exports = (req, res, next) => {
  const token = req.header('authorization');
  if (!token) return res.status(401).send(error('Access denied'));
  const [bearer, jwtToken] = token.split(' ');
  if (bearer !== 'Bearer') return res.status(400).send(error('Malformed token'));
  try {
    const decodedToken = jwt.verify(jwtToken, process.env.JWT_PRIVATE_KEY);
    req.user = decodedToken;
  } catch (e) {
    return res.status(400).send(error('Invalid token'));
  }
  return next();
};
