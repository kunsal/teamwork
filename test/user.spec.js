require('dotenv').config();
const sinon = require('sinon');
const { chai, expect, app } = require('./base.spec');
const User = require('../src/models/user.model');
const authController = require('../src/controllers/apis/auth.controller');

const userModel = new User();
const userData = {
  id: 1,
  email: 'hello@email.com',
  password: 'admins',
  isAdmin: true,
};

let jwtToken;

describe('User', () => {
  beforeEach(() => {
    jwtToken = 'anewstring';
  });
  describe('POST create user', () => {
    const endpoint = '/api/v1/auth/create-user';
    it('should not create user if all required data are not present', (done) => {
      chai.request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({})
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should create user', (done) => {
      const user = {
        password: 'admin',
        first_name: 'Kaytiity',
        last_name: 'Ajayi',
        email: 'ajayi@yahoo.com',
        gender: 'male',
        employee_id: 'A002',
        job_role: 'Accountant',
        department: 'Accounts',
        is_admin: false,
      };

      chai.request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(user)
        .end((err, res) => {
          if (err) done(err);
          if (res.body.status === 'error') {
            expect(res.status).to.not.equal(201);
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('error');
            done();
          } else {
            expect(res.status).to.have.been(201);
            expect(res.body).to.have.a.property('status');
            expect(res.body).to.have.ownProperty('data');
            done();
          }
        });
    });
  });
});

// describe('Login', () => {
//   const endpoint = '/api/v1/auth/signin';

// it('should return with 400 if credential are not valid', (done) => {
//   chai.request(app)
//     .post(endpoint)
//     .send({ email: 'nobody@email.com', password: 'nonsense' })
//     .end((err, res) => {
//       if (err) done(err);
//       expect(res.status).to.eql(400);
//       done();
//     });
// });
// beforeEach(() => {
//   sinon.stub(authController, 'login').callsFake((req, res) => {
//     console.log(res.body);
//     return res.status(405);
//     // if (req.body.email !== 'kaymap@email.com') {
//     //   return res.status(405).send('Invalid')
//     // } else {
//     //   return res.status(200).send('Logged in')
//     // }
//   })
// });

// afterEach(() => {
//   authController.login.restore();
// });

// it('should return with 200 if credentials are valid', (done) => {
//   chai.request(app)
//     .post(endpoint).send(
//       {
//         email: 'kunsal@kaytivity.com',
//         password: 'admins',
//       },
//     ).end((err, res) => {
//       if (err) done(err);
//       expect(res.status).to.equal(200);
//       expect(res.body).to.have.property('status');
//       expect(res.body).to.have.property('data');
//       expect(res.body.data).to.have.property('token');
//       expect(res.body.data).to.have.property('userId');
//       done();
//     });
// });
// });
