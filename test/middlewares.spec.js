const { expect } = require('./base.spec');
const authMiddleware = require('../src/middlewares/auth');
const isAdminMiddleware = require('../src/middlewares/is-admin');

describe('Expect auth middleware to be a function', () => {
  it('should be a function', (done) => {
    expect(authMiddleware).to.be.a('function');
    done();
  });
});

describe('Expect isAdmin middleware to be a function', () => {
  it('should be a function', (done) => {
    expect(isAdminMiddleware).to.be.a('function');
    done();
  });
});
