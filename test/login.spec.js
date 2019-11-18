const baseSpec = require('./base.spec');
const sinon = require('sinon');
const { chai, expect, app } = baseSpec;
const User = require('../src/models/user.model');
const jwt = require('jsonwebtoken');

const userModel = new User();

const userCredential = {
  email: 'admin@kaytivity.com',
  id: 1,
  isAdmin: true
};

const endpoint = '/api/v1/auth/signin';

describe('Sign In', function() {
  it('should return error if required parameter is missing', function(done) {
    chai.request(app)
        .post(endpoint)
        .send({
          email: 'admin@kaytivity.com',
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body).to.have.property('error', '"password" is required');
          done();
        });
  });

  it('should return error if email is not registered', function(done) {
    chai.request(app)
        .post(endpoint)
        .send({
          email: 'admin@abc.com',
          password: 'dkkdie'
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body).to.have.property('error', 'Invalid email/password');
          done();
        });
  });

  it('should return error if password is incorrect', function(done) {
    chai.request(app)
        .post(endpoint)
        .send({
          email: 'admin@kaytivity.com',
          password: 'dkdirie'
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body).to.have.property('error', 'Invalid email/password');
          done();
        });
  });

  it('should login user if credentials are valid and return token', function(done) {
    chai.request(app)
        .post(endpoint)
        .send({
          email: 'admin@kaytivity.com',
          password: 'admins'
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('success');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('userId');
          expect(res.body.data).to.have.property('token');
          done();
        });
  });

});
