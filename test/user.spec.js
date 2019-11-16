require('dotenv').config();
const sinon = require('sinon');
const { chai, expect, app } = require('./base.spec');
const User = require('../src/models/user.model');
const jwt = require('jsonwebtoken');
const Base = require('../src/models/base.model');

const userModel = new User()
const baseModel = new Base();

const user = {
  userId: 1,
  email: 'hello@email.com',
  isAdmin: true
};

const completeUserData = {
  firstName: 'Kaytiity',
  lastName: 'Ajayi',
  password: 'admin',
  email: 'ajayi@yahoo.com',
  gender: 'male',
  employeeId: 'A002',
  jobRole: 'Accountant',
  department: 'Accounts'
};

const jwtSecret = 'alonGsecretOfMine';    
let jwtToken, valStub;

describe('User', () => {
  describe('POST create user', () => {
    beforeEach(() => {
      jwtToken = jwt.sign(user, jwtSecret);
      sinon.stub(jwt, 'verify').callsFake((jwtToken, jwtSecret) => {
        return user;
      });      
    });

    afterEach(() => {
      sinon.restore();
    });

    const endpoint = '/api/v1/auth/create-user';

    it('should not create user if all required data are not present', (done) => {
      chai.request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          "firstName": "Olumide",
          "lastName": "Bakri"
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

    it('should return with "Malformed token" if token is not set properly', (done) => {
      chai.request(app)
        .post(endpoint)
        .set('Authorization', `Beare ${jwtToken}`)
        .send({
          "firstName": "Olumide",
          "lastName": "Bakri"
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body).to.have.property('error', 'Malformed token');
          done();
        });
    });

    it('should return with 401 if token is not set', (done) => {
      chai.request(app)
        .post(endpoint)
        .set('Authorization', ``)
        .send({
          "firstName": "Olumide",
          "lastName": "Bakri"
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body.error).to.contain('denied');
          done();
        });
    });

    // it('should create user', (done) => {
    //   const stub = sinon.stub(userModel, 'create').callsFake((data) => {
    //     return new Promise((resolve, reject) => {
    //       if (data !== null) {
    //         resolve({
    //           rowCount: 1,
    //           rows: []
    //         })
    //       } else {
    //         reject('Data is null')
    //       }
    //     })
        
    //   })
    //   chai.request(app)
    //     .post(endpoint)
    //     .set('Authorization', `Bearer ${jwtToken}`)
    //     .send(completeUserData)
    //     .end((err, res) => {
    //       expect(stub.calledOnce).to.be.true;
          
    //       expect(res.status).to.equal(201);
    //       expect(res.body).to.have.a.property('status');
    //       expect(res.body).to.have.a.property('data');
    //     });
    // });
  });
});

describe('Login', () => {
  const endpoint = '/api/v1/auth/signin';
  it('should return with 400 if password is missing', (done) => {
    chai.request(app)
      .post(endpoint)
      .send({ email: 'nobody@email.com' })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('should return with 400 if email is missing', (done) => {
    chai.request(app)
      .post(endpoint)
      .send({ password: 'hi' })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('should return with 200 if credentials are valid', (done) => {
    chai.request(app)
      .post(endpoint).send(
        {
          email: 'kunsal@kaytivity.com',
          password: 'admins',
        },
      ).end((err, res) => {
        if (err) done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).to.have.property('userId');
        done();
    });
  });
});
