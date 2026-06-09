import * as chai from '../index.js';

describe('should on non-extensible objects', function () {
  var should = chai.Should();

  it('does not throw when assigning should on a frozen object before using should assertions', function () {
    var frozenObject = Object.freeze({tea: 'matcha'});

    (function () {
      frozenObject.should = should;
      frozenObject.should.have.property('tea', 'matcha');
      frozenObject.should.be.frozen;
    }).should.not.throw();
  });

  it('still creates an own should property on extensible objects', function () {
    var object = {};

    object.should = should;

    Object.prototype.hasOwnProperty.call(object, 'should').should.be.true;
    object.should.equal(should);
  });
});
