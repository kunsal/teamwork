const { expect } = require('./base.spec');
const BaseModel = require('../src/models/base.model');

describe('Base Model', () => {
  it('should be a function and have members', () => {
    expect(BaseModel).to.be.a('function');
    expect(new BaseModel()).to.have.property('findBy');
    expect(new BaseModel()).to.have.property('create');
    expect(new BaseModel()).to.have.property('parameterize');
  });
});
