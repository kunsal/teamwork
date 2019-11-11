const { chai, expect, app } = require('./base.spec');
const baseModel = require('../src/models/base.model');

describe('Base Model', () => {
  it('should be a function and have members', () => {
    expect(baseModel).to.be.a('function');
    expect(new baseModel).to.have.property('findBy');
    expect(new baseModel).to.have.property('create');
    expect(new baseModel).to.have.property('parameterize');
  });
});