const sinon = require('sinon');
const { chai, expect, app } = require('./base.spec');
const Gif = require('../src/models/gif.model');
const Tag = require('../src/models/tag.model');
const GifTag = require('../src/models/gif-tag.model');
const Comment = require('../src/models/comment.model');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

process.env['JWT_PRIVATE_KEY'] = 'alonGsecretOfMine';    
let jwtToken;    

const user = {
  userId: 1,
  email: 'hello@email.com',
  isAdmin: true
};

const image = {
  "public_id": "teamwork/2019-11-23T15:46:16.968Z",
  "version": 1574523980,
  "signature": "c61a617e6ea403bc2af3cda4bb65be8d3cfdbb18",
  "width": 480,
  "height": 360,
  "format": "gif",
  "resource_type": "image",
  "created_at": "2019-11-23T15:46:20Z",
  "tags": [
      "Nigeria",
      "rugby",
      "nfl",
      "america"
  ],
  "pages": 121,
  "bytes": 811535,
  "type": "upload",
  "etag": "0941706af4b2c042a37d10d3fbce31f6",
  "placeholder": false,
  "url": "http://res.cloudinary.com/dazfis31n/image/upload/v1574523980/teamwork/2019-11-23T15:46:16.968Z.gif",
  "secure_url": "https://res.cloudinary.com/dazfis31n/image/upload/v1574523980/teamwork/2019-11-23T15:46:16.968Z.gif",
  "original_filename": "world1574523976935"
}


describe('Gif', () => {
  const url = '/api/v1/gifs';
  let findByStub;

  beforeEach(() => {
    jwtToken = jwt.sign(user, process.env.JWT_PRIVATE_KEY);  
    findByStub = sinon.stub(Gif.prototype, 'findBy');  
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /gifs', () => {
    afterEach(() => sinon.restore());
    it('should not create gif if user is not logged in', (done) => {
      chai.request(app)
        .post(`${url}`)
        .send({
          title: 'Test Gif 1',
          tags: 'Nigeria, home, land',
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error', 'Access denied');
          done();
        });
    });

    it('should return error if gif image is not sent', (done) => {
      chai.request(app)
        .post(`${url}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .field('title', 'Gif image')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status', 'error');
          expect(res.body).to.have.property('error', 'image is required');
          done();
        });
    });
    describe('Save Gif', () => {
      let cloudinaryStub, TagFindStub, TagCreateStub, GifTagStub;
      beforeEach(() => {
        const uploader = cloudinary.uploader;
        cloudinaryStub = sinon.stub(uploader, 'upload');
        tagFindStub = sinon.stub(Tag.prototype, 'findBy').resolves({rowCount: 1, rows: [{id: 1}]});
        tagCreateStub = sinon.stub(Tag.prototype, 'create')
        sinon.stub(GifTag.prototype, 'create').resolves({rowCount: 1, rows: [{id: 1}]});
        sinon.stub(Gif.prototype, 'create').resolves({rowCount: 1, rows: [{id: 1}]});
      });

      afterEach(async () => {
        sinon.restore();

        const directory = 'images';
        fs.readdir(directory, (err, files) => {
          if (err) throw err;

          for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
              
            });
          }
        });
      });

      it('should throw error if upload to cloudinary fail', (done) => {
        cloudinaryStub.callsFake((path, options, callback) => {
          callback(true);
        });
        tagCreateStub.resolves({rowCount: 1, rows: [{id: 1}]});
        chai.request(app)
          .post(`${url}`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('content-type', 'multipart/form-data')
          .attach('image', './test/world.gif')
          .field('title', 'Test Gif')
          .field('tags', 'Nigeria, Africa')
          .end((err, res) => {
            expect(res.status).to.equal(500);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('error', 'Image could not be uploaded');
            done();
          });
      });

      it('should upload GIF to cloudinary and save locally', (done) => {
        cloudinaryStub.callsFake((path, options, callback) => {
          callback(false, image);
        });
        tagCreateStub.resolves({rowCount: 1, rows: [{id: 1}]})
        
        chai.request(app)
          .post(`${url}`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('content-type', 'multipart/form-data')
          .attach('image', './test/world.gif')
          .field('title', 'Test Gif')
          .field('tags', 'Nigeria, Africa')
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('message', 'GIF image successfully posted');
            done();
          });
      });
  
    });
    
  });

  describe('GET single gif', () => {

    afterEach(() => {
      sinon.restore();
    });
    
    it('should return 404 if gif is does not exist', (done) => {
      findByStub.resolves({rowCount: 0});
      chai.request(app)
        .get(`${url}/1`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('status', 'error');
          expect(res.body).to.have.property('error', 'No GIF found');
          done();
        });
    });

    it('should return GIF if it exists', (done) => {
      findByStub.resolves({rowCount: 1, rows: [{id: 1, imageUrl: 'http://',comments: []}]});
      sinon.stub(Comment.prototype, 'findByType').resolves({
        rows:[
          {id: 1, comment: 'This is a test comment'},
          {id: 2, comment: 'This is a another test comment'},
        ]
      })
      chai.request(app)
        .get(`${url}/1`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status', 'success');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('comments');
          done();
        })
    });
  });

  describe('DELETE gif', () => {
    it('should return 404 if GIF does not exist', (done) => {
      findByStub.resolves({rowCount: 0})
      chai.request(app)
      .delete(`${url}/10`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('error', 'No GIF found');
        done();
        });
    });

    it('should not delete GIF if user is not the author and not admin', function (done) {
      jwtToken = jwt.sign({
        userId: 2,
        email: 'user@email.com',
        isAdmin: false
      }, process.env.JWT_PRIVATE_KEY);
      findByStub.resolves({rowCount: 1, rows: [{id: 1}]})
      chai.request(app)
        .delete(`${url}/1`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error', 'Forbidden');
          done();
        });
    });

    it('should delete GIF if it exists', (done) => {
      findByStub.resolves({rowCount: 1, rows: [{id: 1, author: 1, inappropriate: false}]});
      sinon.stub(Gif.prototype, 'delete').callsFake((field, value) => {
        return Promise.resolve({rowCount: 1, rows: [
          { id: 1 }
        ]});
      });
      sinon.stub(Comment.prototype, 'delete').returns({rowCount: 1})
      chai.request(app)
      .del(`${url}/1`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('message', 'GIF post successfully deleted');
        done();
      });
    });

    it('should delete GIF if inappropriate and user is admin', (done) => {
      findByStub.resolves({rowCount: 1, rows: [{id: 1, author: 2, inappropriate: true}]});
      sinon.stub(Gif.prototype, 'delete').callsFake((field, value) => {
        return Promise.resolve({rowCount: 1, rows: [
          { id: 1 }
        ]});
      });
      sinon.stub(Comment.prototype, 'delete').returns({rowCount: 1})
      chai.request(app)
      .del(`${url}/1`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('message', 'GIF post successfully deleted');
        done();
      });
    });
  });

  describe('POST find GIF by tag', () => {
    let tagValidate;

    beforeEach(() => {
     // tagValidate = sinon.stub(Tag.prototype, 'validate');
    });

    afterEach(() => {
      sinon.restore();
    });
    it('should return validation error if tag array is not sent', (done) => {
      chai.request(app)
        .post(`${url}/by-tags`)
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
      sinon.stub(Gif.prototype, 'findByTags').resolves({rows: [{id: 1, title: 'My GIF', imageurl: 'https://cloud.com'}]})
      chai.request(app)
        .post(`${url}/by-tags`)
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

  describe('Comment on GIF', () => {
    beforeEach(() => {
      findByStub.resolves({rowCount: 1, rows: [{id: 1}]});
    });

    it('should return 404 if GiF is not found', (done) => {
      findByStub.resolves({rowCount: 0});
      chai.request(app)
        .post(`${url}/1/comment`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('status', 'error');
          expect(res.body).to.have.property('error', 'No GIF found');
          done();
        });
    });

    it('should return 400 if comment is not sent', (done) => {
      chai.request(app)
        .post(`${url}/1/comment`)
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
        .post(`${url}/1/comment`)
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

  describe('Flag GIF as inappropriate', () => {
    beforeEach(() => {
      findByStub.resolves({rowCount: 1, rows: [{id: 1}]});
    });

    it('should return 404 if GIF is not found', (done) => {
      findByStub.resolves({rowCount: 0});
      chai.request(app)
        .patch(`${url}/1/flag`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('status', 'error');
          expect(res.body).to.have.property('error', 'No GIF found');
          done();
        });
    });

    it('should return 400 if required field is not sent', (done) => {
      chai.request(app)
        .patch(`${url}/1/flag`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status', 'error');
          expect(res.body).to.have.property('error', '"inappropriate" is required');
          done();
      });
    })
    
    it('should update GIF as inappropriate if validation passes', (done) => {
      sinon.stub(Gif.prototype, 'update').callsFake((data, value) => {
        return Promise.resolve({
          rowCount: 1,
          rows: [{
            id: 1, 
            imageurl: 'https://cloud.com/gif',
            inappropriate: data.inappropriate
          }]
        });
      });
      
      chai.request(app)
        .patch(`${url}/1/flag`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({inappropriate: true})
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status', 'success');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('message', 'Gif flag updated successfully');
          done();
      });
    });

  });

});




