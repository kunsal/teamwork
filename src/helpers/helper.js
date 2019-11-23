const response = require('./response');

exports.serverError = (res, e) => {
  res.status(500).send(response.error('Whoops! An error occurred, please try again'));
  throw new Error(e);
};

exports.errorResponse = (res, message, code = 400) => {
  res.status(code).send(response.error(message));
};

module.exports.renameKeys = (data, obj) => {
  for (let i = 0; i < data.length; i++) {
    let key = Object.keys(data[i])[0];
    let value = Object.values(data[i])[0]
    obj[key] = obj[value];
    delete obj[value];
  }
  return obj;
}

module.exports.add = (num1, num2, log) => {
  const result = num1 + num2;
  log(result);
  return result;

}
