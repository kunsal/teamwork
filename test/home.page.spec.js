const { chai, expect, app } = require('./base.spec');
const homePage = require('../src/controllers/home-page');

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

  it('should return with welcome text', () => {
    expect(homePage.toString()).to.contain('Welcome to Teamwork');
  })
});
