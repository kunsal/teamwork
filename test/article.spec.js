const sinon = require('sinon');
const { chai, expect, app } = require('./base.spec');
const articleController = require('../src/controllers/apis/article.controller');
const jwt = require('jsonwebtoken');
const ArticleModel = require('../src/models/article.model');

const Article = new ArticleModel();

process.env['JWT_PRIVATE_KEY'] = 'alonGsecretOfMine';    
let jwtToken;    

const user = {
  userId: 1,
  email: 'hello@email.com',
  isAdmin: true
};

const articleData = {
  title: 'Test article 1',
  article: 'This is a pretty long article and the simplicity does not counter its longeivity',
  tags: ['Nigeria'],
}

describe('article', () => {
  const url = '/api/v1';
  beforeEach(() => {
    jwtToken = jwt.sign(user, process.env.JWT_PRIVATE_KEY);    
  });

  afterEach(() => {
    //sinon.restore();
  });

  describe('POST /articles', () => {
    it('create article route should exist as a function', (done) => {
      expect(articleController.create).to.be.a('function');
      done();
    });


    it('should be accessible at /articles', (done) => {
      chai.request(app)
        .post(`${url}/articles`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.not.equal(404);
          done();
        });
    });

    it('should not create article if user is not logged in', (done) => {
      chai.request(app)
        .post(`${url}/articles`)
        .send(articleData)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error', 'Access denied');
          done();
        });
    });

    it('should return error if required parameter is missing', (done) => {
      chai.request(app)
        .post(`${url}/articles`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          title: 'Test article 1',
          tags: ['Nigeria', 'home', 'land'],
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status', 'error');
          expect(res.body).to.have.property('error', '"article" is required');
          done();
        });
    });

    it('should create article if user is logged in', async function () {
      this.timeout(10000);
      chai.request(app)
        .post(`${url}/articles`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          title: "Test article 1",
          article: "This is a pretty long article and the simplicity does not counter its longeivity",
          tags: ["Nigeria"]
        })
        .end(async (err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('status', 'success');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('message', 'Article successfully posted');
          expect(res.body.data).to.not.be.a('string');
          await Article.query('delete from articles where id != 1');
          //done();
        });
    });
  });

  describe('GET single article by id', (done) => {
    it('should return 404 if article does not exist', function (done) {
      this.timeout(10000);
      chai.request(app)
        .get(`${url}/articles/1000`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('status', 'error');
          expect(res.body).to.have.property('error', 'No article found');
          done();
        })
    });

    it('should return article if it exists', function(done) {
      this.timeout(10000);
      chai.request(app)
        .get(`${url}/articles/1`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status', 'success');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('comments');
          done();
        })
    });
  });

  describe('DELETE article', function () {
    it('should return 404 if article does not exist', function(done) {
      chai.request(app)
      .delete(`${url}/articles/1000`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('error', 'No article found');
        done();
        });
    });

    it('should not delete if user is not the author and not admin', function (done) {
      jwtToken = jwt.sign({
        userId: 2,
        email: 'user@email.com',
        isAdmin: false
      }, process.env.JWT_PRIVATE_KEY);

      chai.request(app)
        .delete(`${url}/articles/1`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .end((err, res) => {
          //console.log(res);
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error', 'Forbidden');
          done();
        });
    });

    let articleId;

    before(async function() {
      const article = await Article.create({
        title: 'Article to delete',
        article: 'This is an article to delete',
        author: 1, 
        createdAt: new Date()
      });
      articleId = article.rows[0].id;
    })

    it('should delete article if it exists', function (done) {
      this.timeout(10000);
        chai.request(app)
        .del(`${url}/articles/${articleId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .end((err, res) => {
          // console.log(err, res.body);
          // expect(res.status).to.equal(200);
          // expect(res.body).to.have.property('status');
          //  expect(res.body).to.have.property('data');
          // expect(res.body.data).to.have.property('message', 'Article post successfully deleted');
          done();
          });
    });
  });
});
