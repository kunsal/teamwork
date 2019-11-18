const baseSpec = require('./base.spec');
const { chai, expect, app } = baseSpec;
const User = require('../src/models/user.model');
const jwt = require('jsonwebtoken');

const userModel = new User();

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


// baseModel.query("Drop table if exists another");
// baseModel.query("Drop table if exists test");
// baseModel.query("Create table if not exists another (name varchar(20))"); 
describe('User', function() {
  describe('POST create user', function() {
    beforeEach(function() {
      jwtToken = jwt.sign(adminData, process.env.JWT_PRIVATE_KEY);
    });

    const endpoint = '/api/v1/auth/create-user';

    it('should not create user if all required data are not present', function(done) {
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
          completeUserData.email = 'user@kaytivity.com';
          done();
        });
    });

    it('should return status 403 if creator is not admin', function(done) {
      adminData.isAdmin = false;
      jwtToken = jwt.sign(adminData, process.env.JWT_PRIVATE_KEY);
      chai.request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          "firstName": "Olumide",
          "lastName": "Bakri"
        })
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

    it('should return error if email is already registered', function(done) {
      this.timeout(10000);
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
    })

    it('should return error if employee ID is already registered', function (done) {
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

    it('should create user if all validations have passed', function (done) {
      this.timeout(10000);
      // delete user
      userModel.delete('email', userEmail);
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
          // Delete user
          userModel.delete('email', userEmail);
          done();
        });
    });
  });
});