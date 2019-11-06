const { chai, expect, app } = require('./base.spec');

describe('Home page', () => {
  it('should return with status 200', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
});
