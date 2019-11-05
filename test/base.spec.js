const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const logger = require('../src/helpers/logger');

// Allow mocha AssertionError to be reported as opposed winston's default
logger.exceptions.unhandle();

chai.use(chaiHttp);
const { expect } = chai;

module.exports = {
  chai,
  app,
  expect,
};
