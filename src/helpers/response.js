module.exports.success = (responseData) => ({
  status: 'success',
  data: responseData,
});

module.exports.error = (message) => ({
  status: 'error',
  error: message,
});
