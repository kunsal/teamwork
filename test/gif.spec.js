const { chai, expect, app } = require('./base.spec');
const gifController = require('../src/controllers/apis/gif.controller');

describe('Gif', () => {
  const url = '/api/v1';
  describe('POST /create', () => {
    it('create should exist as a function', (done) => {
      expect(gifController.create).to.be.a('function');
      done();
    });

    it('should be accessible at /gifs', () => {
      chai.request(app)
        .post(`${url}/gifs`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.not.equal(404);
        });
    });
  });
});
