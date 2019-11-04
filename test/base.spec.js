const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const winston = require('winston');
winston.exceptions.unhandle();

chai.use(chaiHttp);
const { expect } = chai;

module.exports = {
  chai,
  app,
  expect,
};
