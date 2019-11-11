const { chai, expect, app } = require('./base.spec');

describe('Expect app to exist', () => {
  it('should be a function', (done) => {
    expect(app).to.be.a('function');
    done();
  });
});