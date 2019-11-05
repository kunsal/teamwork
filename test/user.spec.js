const { chai, expect, app } = require('./base.spec');

describe('User', () => {
  describe('POST create user', () => {
    it('should create user and return with 201 status', (done) => {
      const user = {};
      chai.request(app)
        .post('/api/v1/auth/create-user')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('status');
          done();
        });
    });
  });
});
