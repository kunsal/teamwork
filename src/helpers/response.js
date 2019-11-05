module.exports.success = responseData => {
  return {
    status: 'success',
    data: responseData
  }
}

module.exports.error = message => {
  return {
    status: 'error',
    error: message
  }
}