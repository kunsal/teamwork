const sinon = require('sinon');
const { chai, expect, app } = require('./base.spec');
const articleController = require('../src/controllers/apis/article.controller');
const ArticleModel = require('../src/models/article.model');
const jwt = require('jsonwebtoken');

const Article = new ArticleModel();

const jwtSecret = 'alonGsecretOfMine';    
let jwtToken, valStub;

const user = {
  userId: 1,
  email: 'hello@email.com',
  isAdmin: true
};

describe('article', () => {
  const url = '/api/v1';
  beforeEach(() => {
    jwtToken = jwt.sign(user, jwtSecret);
    sinon.stub(jwt, 'verify').callsFake((jwtToken, jwtSecret) => {
      return user;
    });      
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /', () => {
    beforeEach(() => {
      jwtToken = 'aNewParticularlongString';
      sinon.stub(Article, 'create').returns({ rowCount: 1 });
    });

    afterEach(() => {
      Article.create.restore();
    });

    it('create article route should exist as a function', (done) => {
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

    it('should not create article if user is not logged in', () => {
      chai.request(app)
        .post(`${url}/articles`)
        .send({
          title: 'Test article 1',
          article: 'This is a pretty long article and the simplicity does not counter its longeivity',
          tags: 'Nigeria, home, land',
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
        });
    });

    it('should create article if user is logged in', () => {
      chai.request(app)
        .post(`${url}/articles`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          title: "Test article 1",
          article: "This is a pretty long article and the simplicity does not counter its longeivity",
          tags: "Nigeria, home, land"
        })
        .end((err, res) => {
          expect(res.status).to.not.equal(401);
        });
    });
  });

  describe('GET single article', () => {
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
      expect(articleController.deleteArticle).to.be.a('function');
    });

    // it('should be accessible at /articles/:id', () => {
    //   chai.request(app)
    //     .set('Authorization', `Bearer ${jwtToken}`)
    //     .delete(`${url}/articles/1`)
    //     .end((err, res) => {
    //       expect(res.status).to.not.equal(404);
    //     });
    // })
  });
});
