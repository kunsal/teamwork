const response = require('../../helpers/response');

module.exports.create = (req, res) => {
  return res.send(response.success('This is good'));
}