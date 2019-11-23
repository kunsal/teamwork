const { chai, expect, app } = require('./base.spec');
const sinon = require('sinon');
const User = require('../src/models/user.model');
const jwt = require('jsonwebtoken');

const adminData = {
  email: 'admin@kaytivity.com',
  id: 1,
  isAdmin: true
};

let userEmail = 'user@kaytivity.com';

const completeUserData = {
  firstName: 'Kaytiity',
  lastName: 'Ajayi',
  password: 'admin',
  email: userEmail,
  gender: 'male',
  employeeId: 'A002',
  jobRole: 'Accountant',
  department: 'Accounts'
};

process.env['JWT_PRIVATE_KEY'] = 'alonGsecretOfMine';    
let jwtToken;

describe('User', function() {
  describe('POST create user', function() {
    beforeEach(function() {
      jwtToken = jwt.sign(adminData, process.env.JWT_PRIVATE_KEY);
    });

    const endpoint = '/api/v1/auth/create-user';

    it('should return status 403 if creator is not admin', (done) => {
      adminData.isAdmin = false;
      jwtToken = jwt.sign(adminData, process.env.JWT_PRIVATE_KEY);
      chai.request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send()
        .end((err, res) => {
          
          if (err) done(err);
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body).to.have.property('error', 'Forbidden');
          adminData.isAdmin = true;
          done();
        });
    });

    it('should not create user if all required data are not present', (done) => {
      delete completeUserData.email;
      chai.request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(completeUserData)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body).to.have.property('error', '"email" is required');
          completeUserData.email = userEmail;
          done();
        });
    });

    describe('Duplicate entry', () => {
      let fieldExistStub;

      beforeEach(() => {
        fieldExistStub = sinon.stub(User.prototype, 'exists').callsFake((field, value) => {
          let state = false;
          switch (value) {
            case 'admin@kaytivity.com':
              state = true;
              break;
            case 'A001':
              state = true;
              break;
            default: 
          }
          return Promise.resolve(state);
          
        });
      });

      afterEach(() => {
        User.prototype.exists.restore();
      });

      it('should return error if email is already registered', (done) => {
        completeUserData.email = 'admin@kaytivity.com';
        chai.request(app)
          .post(endpoint)
          .set('Authorization', `Bearer ${jwtToken}`)
          .send(completeUserData)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status');
            expect(res.body.status).to.equal('error');
            expect(res.body).to.have.property('error', 'email already registered');
            completeUserData.email = userEmail;
            done();
          });
      });

      it('should return error if employee ID is already registered', (done) => {
        this.timeout(10000);
        completeUserData.employeeId = 'A001';
        chai.request(app)  
          .post(endpoint)
          .set('Authorization', `Bearer ${jwtToken}`)
          .send(completeUserData)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status');
            expect(res.body.status).to.equal('error');
            expect(res.body).to.have.property('error', 'employeeId already registered');
            completeUserData.employeeId = 'A002';
            done();
          });
      });
    });

    describe('Create user', () => {

      beforeEach(() => {
        sinon.stub(User.prototype, 'validate').returns(false);
        sinon.stub(User.prototype, 'exists').returns(false);
        sinon.stub(User.prototype, 'create').callsFake((data) => {
          return Promise.resolve({
            rowCount: 1,
            rows: [
              {
                ...data,
                id: 2,
                firstname: 'Kaytiity',
                lastname: 'Ajayi',
                employeeid: 'A002',
                jobrole: 'Accountant',
              }
            ]
          });
        });
      });

      afterEach(() => {
        sinon.restore();
      });

      it('should create user if all fields are valid', (done) => {
        sinon.stub(User.prototype, 'hash').returns('hashedpassword');
        chai.request(app)  
        .post(endpoint)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(completeUserData)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('success');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.not.be.a('string');
          done();
        });
      });
    });
    describe('Internal server', () => {
      beforeEach(() => {
        sinon.stub(User.prototype, 'validate').returns({error: {details:{}}});
      });

      afterEach(() => {
        sinon.restore();
      });

      it('should return 500 server error if any internal error is encountered', done => {
        chai.request(app)  
          .post(endpoint)
          .set('Authorization', `Bearer ${jwtToken}`)
          .send(completeUserData)
          .end((err, res) => {
            expect(res.status).to.equal(500);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('error', 'Whoops! An error occurred, please try again');
            done();
          });
      });
    })
    
  });
});