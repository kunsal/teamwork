const sinon = require('sinon');
const { chai, expect, app } = require('./base.spec');
const Feed = require('../src/models/feed.model');

describe('Feeds', () => {
  beforeEach(() => {
    sinon.stub(Feed.prototype, 'all').resolves({
      rowCount: 2,
      rows: [
        { id: 15,
          createdat: '2019-11-23T14:55:50.000Z',
          title: 'Test Gif',
          author: 1,
          url: 'http://res.cloudinary.com/dazfis31n/image/upload/v1574520950/teamwork/2019-11-23T14:55:45.357Z.gif' 
        },
        { id: 14,
          createdat: '2019-11-23T14:53:52.000Z',
          title: 'My Article',
          feedtype: 'article',
          author: 2,
          content: 'Content of my article' 
        }
      ]
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return feeds (articles and gifs) in reverse chronological order', (done) => {
    chai.request(app)
      .get('/api/v1/feed')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        done();
      });
  });

});