const { chai, expect, app } = require('./base.spec');
const articleController = require('../src/controllers/apis/article.controller');

describe('article', () => {
  const url = '/api/v1';
  describe('POST /', () => {
    it('create should exist as a function', (done) => {
      expect(articleController.create).to.be.a('function');
      done();
    });

    it('should be accessible at /articles', () => {
      chai.request(app)
        .post(`${url}/articles`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.not.equal(404);
        });
    });
  });

  /* describe('GET single article', () => {
    it('single method should exist as a function', () => {
      expect(articleController.single).to.be.a('function');
    });
    
    it('should be accessible at /articles/:id', () => {
      chai.request(app)
        .get(`${url}/articles/1`)
        .end((err, res) => {
          expect(res.status).to.not.equal(404);
        });
    }) 
  });

  describe('DELETE article', () => {
    it('single method should exist as a function', () => {
      expect(articleController.deletearticle).to.be.a('function');
    });
    
    it('should be accessible at /articles/:id', () => {
      chai.request(app)
        .delete(`${url}/articles/1`)
        .end((err, res) => {
          expect(res.status).to.not.equal(404);
        });
    }) 
  }); */
});
