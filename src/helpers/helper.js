const response = require('./response');

exports.serverError = (res, e) => {
  res.status(500).send(response.error('Whoops! An error occurred, please try again'));
  throw new Error(e);
}