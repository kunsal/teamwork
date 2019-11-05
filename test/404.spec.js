const { chai, expect, app } = require('./base.spec');

describe('Unknown URI', () => {
  describe('GET method', () => {
    it('should return with 404 status', (done) => {
      chai.request(app).get('/eieoi').end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('POST method', () => {
    it('should return with 404 status', (done) => {
      chai.request(app).get('/eieoi').end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
});
