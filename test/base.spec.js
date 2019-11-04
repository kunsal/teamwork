const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');

chai.use(chaiHttp);
const {expect} = chai;

module.exports = {
  chai,
  server,
  expect
}