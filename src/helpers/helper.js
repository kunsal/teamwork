const response = require('./response');

exports.serverError = (res, e) => {
  res.status(500).send(response.error('Whoops! An error occurred, please try again'));
  throw new Error(e);
};

exports.errorResponse = (res, message, code = 400) => {
  res.status(code).send(response.error(message));
};
