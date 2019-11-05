const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

chai.use(chaiHttp);
const { expect } = chai;

module.exports = {
  chai,
  app,
  expect,
};
