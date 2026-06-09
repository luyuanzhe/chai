import * as chai from './lib/chai.js';

console.log('Testing basic assertions...');

try {
  chai.expect(1).to.equal(1);
  chai.expect('foo').to.be.a('string');
  chai.expect([1, 2, 3]).to.include(2);
  chai.expect({a: 1}).to.have.property('a');
  chai.expect(true).to.be.true;
  chai.expect(null).to.be.null;
  chai.expect(undefined).to.be.undefined;
  chai.expect(1).to.be.above(0);
  chai.expect(1).to.be.below(2);
  chai.expect(1).to.be.within(0, 2);
  chai.expect({a: 1}).to.be.an('object');
  chai.expect([1, 2, 3]).to.have.lengthOf(3);
  chai.expect('foobar').to.match(/^foo/);
  chai.expect('foobar').to.have.string('bar');
  chai.expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
  chai.expect({a: 1}).to.have.deep.property('a', 1);
  chai.expect([{a: 1}]).to.have.deep.members([{a: 1}]);
  chai.expect(1).to.be.oneOf([1, 2, 3]);
  chai.expect({name: {first: "John"}}).to.containSubset({name: {first: "John"}});
  
  console.log('All basic tests passed!');
} catch (e) {
  console.error('Test failed:', e.message);
  console.error(e.stack);
  process.exit(1);
}
