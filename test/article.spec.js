const sinon = require('sinon');
const { chai, expect, app } = require('./base.spec');
const jwt = require('jsonwebtoken');
const Article = require('../src/models/article.model');
const Tag = require('../src/models/tag.model');
const ArticleTag = require('../src/models/article-tag.model');
const Comment = require('../src/models/comment.model');

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
  let findByStub;

  beforeEach(() => {
    jwtToken = jwt.sign(user, process.env.JWT_PRIVATE_KEY);  
    findByStub = sinon.stub(Article.prototype, 'findBy');  
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /articles', () => {
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

    describe('Create article', () => {
      beforeEach(() => {
        sinon.stub(Article.prototype, 'create').callsFake((data) => {
          return Promise.resolve({
            rowCount: 1,
            rows: [{
                id: 2,
                article: data.article,
                title: data.title,
                createdat: data.createdAt
              }]
          });
        });
        sinon.stub(Tag.prototype, 'findBy').resolves({rowCount: 1, rows: [{id: 1}]});
        sinon.stub(ArticleTag.prototype, 'create').resolves({rowCount:1});
      });

      it('should create article, create tag and attach tag to article if tag does not exist', (done) => {
        chai.request(app)
          .post(`${url}/articles`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .send({
            title: "Test article 1",
            article: "This is a pretty long article and the simplicity does not counter its longeivity",
            tags: ["Nigeria"]
          })
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('message', 'Article successfully posted');
            expect(res.body.data).to.not.be.a('string');
            done();
          });
      });

      it('should create article, and attach tag to article if tag already exist', (done) => {
        Tag.prototype.findBy.restore();
        sinon.stub(Tag.prototype, 'findBy').resolves({rowCount: 0});
        sinon.stub(Tag.prototype, 'create').resolves({rowCount: 1, rows:[{id: 2}]});
        chai.request(app)
          .post(`${url}/articles`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .send({
            title: "Test article 1",
            article: "This is a pretty long article and the simplicity does not counter its longeivity",
            tags: ["Nigeria"]
          })
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('message', 'Article successfully posted');
            expect(res.body.data).to.not.be.a('string');
            done();
          });
      });
    });

    describe('GET Article by id', (done) => {
      it('should return 404 if article does not exist', (done) => {
        findByStub.resolves({rowCount: 0});
        chai.request(app)
          .get(`${url}/articles/1000`)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('error', 'No article found');
            done();
          })
      });

      it('should return article if it exists', (done) => {
        findByStub.resolves({rowCount: 1, rows: [{comments: []}]});
        sinon.stub(Comment.prototype, 'findByType').resolves({
          rows:[
            {id: 1, comment: 'This is a test comment'},
            {id: 2, comment: 'This is a another test comment'},
          ]
        })
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

    describe('DELETE article', () => {
      it('should return 404 if article does not exist', (done) => {
        findByStub.resolves({rowCount: 0})
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
        findByStub.resolves({rowCount: 1, rows: [{id: 1}]})
        chai.request(app)
          .delete(`${url}/articles/1`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .end((err, res) => {
            expect(res.status).to.equal(403);
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('error', 'Forbidden');
            done();
          });
      });

      it('should delete article if it exists', (done) => {
        findByStub.resolves({rowCount: 1, rows: [{id: 1, author: 1, inappropriate: false, ...articleData}]});
        sinon.stub(Article.prototype, 'delete').callsFake((field, value) => {
          return Promise.resolve({rowCount: 1, rows: [
            { id: 1, ...articleData }
          ]});
        });
        sinon.stub(Comment.prototype, 'delete').returns({rowCount: 1})
        chai.request(app)
        .del(`${url}/articles/1`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status', 'success');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('message', 'Article post successfully deleted');
          done();
        });
      });

      it('should delete article is inappropriate and user is admin', (done) => {
        findByStub.resolves({rowCount: 1, rows: [{id: 1, author: 2, inappropriate: true, ...articleData}]});
        sinon.stub(Article.prototype, 'delete').callsFake((field, value) => {
          return Promise.resolve({rowCount: 1, rows: [
            { id: 1, ...articleData }
          ]});
        });
        sinon.stub(Comment.prototype, 'delete').returns({rowCount: 1})
        chai.request(app)
        .del(`${url}/articles/1`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status', 'success');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('message', 'Article post successfully deleted');
          done();
        });
      });
    });
  });

  describe('POST find article by tag', () => {
    let tagValidate;

    beforeEach(() => {
     // tagValidate = sinon.stub(Tag.prototype, 'validate');
    });

    afterEach(() => {
      sinon.restore();
    });
    it('should return validation error if tag array is not sent', (done) => {
      chai.request(app)
        .post(`${url}/articles/by-tags`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({tags: ''})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status', 'error');
          expect(res.body).to.have.property('error', '"tags" must be an array');
          done();
        });
    });

    it('should return articles tag array is sent', (done) => {
      sinon.stub(Article.prototype, 'findByTags').resolves({rows: [{id: 1, title: 'My Article'}]})
      chai.request(app)
        .post(`${url}/articles/by-tags`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({tags: ['nigeria']})
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status', 'success');
          expect(res.body).to.have.property('data');
          done();
        });
    });
  });

  describe('Comment on article', () => {
    beforeEach(() => {
      findByStub.resolves({rowCount: 1, rows: [{id: 1}]});
    });

    it('should return 404 if article is not found', (done) => {
      findByStub.restore();
      findByStub.resolves({rowCount: 0});
      chai.request(app)
        .post(`${url}/articles/1/comment`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('status', 'error');
          expect(res.body).to.have.property('error', 'No article found');
          done();
        });
    });

    it('should return 400 if comment is not sent', (done) => {
      chai.request(app)
        .post(`${url}/articles/1/comment`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({comment: ''})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status', 'error');
          expect(res.body).to.have.property('error', '"comment" is not allowed to be empty');
          done();
      });
    })
    
    it('should create comment if validation passes', (done) => {
      sinon.stub(Comment.prototype, 'create').resolves({
        rowCount: 1,
        rows: [{
          id: 1, 
          comment: 'Comment is modified here'
        }]
      });
      chai.request(app)
        .post(`${url}/articles/1/comment`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({comment: 'Comment is here'})
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status', 'success');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('message', 'Comment added successfully');
          done();
      });
    })

  });

  describe('Edit article', () => {
    beforeEach(() => {
      findByStub.resolves({rowCount: 1, rows: [{id: 1}]});
    });

    it('should return 404 if article is not found', (done) => {
      findByStub.restore();
      findByStub.resolves({rowCount: 0});
      chai.request(app)
        .patch(`${url}/articles/1`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('status', 'error');
          expect(res.body).to.have.property('error', 'No article found');
          done();
        });
    });

    it('should return 400 if required field is not sent', (done) => {
      chai.request(app)
        .patch(`${url}/articles/1`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({article: 'A new version'})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status', 'error');
          expect(res.body).to.have.property('error', '"title" is required');
          done();
      });
    })
    
    it('should update article if validation passes', (done) => {
      sinon.stub(Article.prototype, 'update').callsFake((data, value) => {
        return Promise.resolve({
          rowCount: 1,
          rows: [{
            id: 1, 
            title: 'updated title',
            article: 'Comment is modified here'
          }]
        });
      });
      
      chai.request(app)
        .patch(`${url}/articles/1`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({title: 'A new title', article: 'Comment is here', tags: ['new']})
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status', 'success');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('message', 'Article updated successfully');
          done();
      });
    })
  });

  describe('Flag article as inappropriate', () => {
    beforeEach(() => {
      findByStub.resolves({rowCount: 1, rows: [{id: 1}]});
    });

    it('should return 404 if article is not found', (done) => {
      findByStub.restore();
      findByStub.resolves({rowCount: 0});
      chai.request(app)
        .patch(`${url}/articles/1/flag`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('status', 'error');
          expect(res.body).to.have.property('error', 'No article found');
          done();
        });
    });

    it('should return 400 if required field is not sent', (done) => {
      chai.request(app)
        .patch(`${url}/articles/1/flag`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({})
        .end((err, res) => {
          console.log(res.body)
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status', 'error');
          expect(res.body).to.have.property('error', '"inappropriate" is required');
          done();
      });
    })
    
    it('should update article if validation passes', (done) => {
      sinon.stub(Article.prototype, 'update').callsFake((data, value) => {
        return Promise.resolve({
          rowCount: 1,
          rows: [{
            id: 1, 
            title: 'updated title',
            article: 'Comment is modified here',
            inappropriate: data.inappropriate
          }]
        });
      });
      
      chai.request(app)
        .patch(`${url}/articles/1/flag`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({inappropriate: true})
        .end((err, res) => {
          console.log(res.body);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status', 'success');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('message', 'Article flag updated successfully');
          done();
      });
    })

  });
});
