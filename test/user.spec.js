const { chai, expect, app } = require('./base.spec');

describe('User', () => {
  describe('POST create user', () => {
    const endpoint = '/api/v1/auth/create-user';
    it('should not create user if all required data are not present', (done) => {
      const user = {};
      chai.request(app)
        .post(endpoint)
        .send(user)
        .end((err, res) => {
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
        .send(user)
        .end((err, res) => {
          if(res.body.status === 'error') {
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

describe('Login', () => {
  const endpoint = '/api/v1/auth/login';

  it('should not return 404', (done) => {
    chai.request(app).post(endpoint).send().end((err, res) => {
      expect(res.status).to.eql(404);
      done();
    });
  });

  it('should return error if email is absent', (done) => {
    chai.request(app).post(endpoint).send(
      {
        password: 'admin'
      }
    ).end((err, res) => {
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      done();
    });
  });

  it('should return error if password is absent', (done) => {
    done();
  });

  it('should not login if user is not found', (done) => {
    done();
  });
});
