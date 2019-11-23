const baseSpec = require('./base.spec');
const sinon = require('sinon');
const { chai, expect, app } = baseSpec;
const User = require('../src/models/user.model');
const jwt = require('jsonwebtoken');

const userCredential = {
  email: 'admin@kaytivity.com',
  id: 1,
  isAdmin: true
};

const endpoint = '/api/v1/auth/signin';

describe('Sign In', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return error if password is missing', (done) => {
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

  it('should return error if email is missing', (done) => {
    chai.request(app)
        .post(endpoint)
        .send({
          password: 'password',
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body).to.have.property('error', '"email" is required');
          done();
        });
  });

  it('should return error if email is not registered', function(done) {
    const findByStub = sinon.stub(User.prototype, 'findBy').callsFake((field, vaue) => {
      return Promise.resolve({
        rowCount: 0
      });
    });
    chai.request(app)
        .post(endpoint)
        .send({
          email: 'admin@abc.com',
          password: 'dkkdie'
        })
        .end((err, res) => {
          expect(findByStub.calledOnce).to.be.true;
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body).to.have.property('error', 'Invalid email/password');
          done();
        });
  });

  describe('Email & password provided', () => {
    beforeEach(() => {
      const findBystub = sinon.stub(User.prototype, 'findBy').resolves({
        rowCount: 1, 
        rows: [{
          id: 5,
          isadmin: true,
          firstname: 'Olakunle',
          lastname: 'Salami',
          password: '$2y10ueiieie'
        }]
      });
    });

    it('should return error if password is incorrect', function(done) {
      sinon.stub(User.prototype, 'verify').callsFake((password, hashedPassword) => {
        return Promise.resolve(false);
      });
      chai.request(app)
        .post(endpoint)
        .send({
          email: 'admin@kaytivity.com',
          password: 'dkdirie'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body).to.have.property('error', 'Invalid email/password');
          done();
        });
    });

    it('should login user if credentials are valid and return token', function(done) {
      sinon.stub(User.prototype, 'verify').callsFake((password, hashedPassword) => {
        return Promise.resolve(true);
      });
      chai.request(app)
          .post(endpoint)
          .send({
            email: 'admin@kaytivity.com',
            password: 'admins'
          })
          .end((err, res) => {
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

  // describe('Internal server', () => {
  //   beforeEach(() => {
  //     sinon.stub(User.prototype, 'validate').returns({error: {detail:[]}});
  //   });

  //   afterEach(() => {
  //     sinon.restore();
  //   });

  //   it('should return 500 server error if an internal error is encountered', done => {
  //     chai.request(app)  
  //       .post(endpoint)
  //       .send({
  //         email: 'admin@email.com',
  //         password: 'ieiei'
  //       })
  //       .end((err, res) => {
  //         expect(res.status).to.equal(500);
  //         expect(res.body).to.have.property('status', 'error');
  //         expect(res.body).to.have.property('error', 'Whoops! An error occurred, please try again');
  //         done();
  //       });
  //   });
  // })
});
