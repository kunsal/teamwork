const sinon = require('sinon');
const { chai, expect, app } = require('./base.spec');
const gifController = require('../src/controllers/apis/gif.controller');
const GifModel = require('../src/models/gif.model');
const jwt = require('jsonwebtoken');

const Gif = new GifModel();

const jwtSecret = 'alonGsecretOfMine';    
let jwtToken, valStub;

const user = {
  userId: 1,
  email: 'hello@email.com',
  isAdmin: true
};

describe('gif', () => {
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
      sinon.stub(Gif, 'create').returns({ rowCount: 1 });
    });

    afterEach(() => {
      Gif.create.restore();
    });

    it('create article route should exist as a function', (done) => {
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

    it('should not create gif if user is not logged in', () => {
      chai.request(app)
        .post(`${url}/gifs`)
        .send({
          title: 'Test Gif 1',
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
          image: "ongeivity.gif",
          tags: "Nigeria, home, land"
        })
        .end((err, res) => {
          expect(res.status).to.not.equal(401);
        });
    });
  });

  describe('GET single gif', () => {
    it('single method should exist as a function', () => {
      expect(gifController.single).to.be.a('function');
    });

    it('should be accessible at /gifs/:id', () => {
      chai.request(app)
        .get(`${url}/gifs/1`)
        .end((err, res) => {
          expect(res.status).to.not.equal(404);
        });
    });
  });

  describe('DELETE gif', () => {
    it('single method should exist as a function', () => {
      expect(gifController.deleteGif).to.be.a('function');
    });

    it('should be accessible at /gifs/:id', () => {
      chai.request(app)
        .delete(`${url}/gifs/1`)
        .end((err, res) => {
          expect(res.status).to.not.equal(404);
        });
    });
  });
});




