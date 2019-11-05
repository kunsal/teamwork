const { chai, expect, app } = require('./base.spec');

describe('User', () => {
  describe('POST create user', () => {
    it('should create user', (done) => {
      const user = {
        status: 'Hi'
      };
      chai.request(app)
        .post('/api/v1/auth/create-user')
        .send(user)
        .end((err, res) => {
          console.log(res.body);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.a.property('status');
          done();
        });
    });
  });
});
