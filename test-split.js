import {expect, assert, should} from './lib/chai.js';

console.log('Testing basic assertions...');

try {
  expect(1).to.equal(1);
  expect('foo').to.be.a('string');
  expect([1, 2, 3]).to.include(2);
  expect({a: 1}).to.have.property('a');
  expect(true).to.be.true;
  expect(null).to.be.null;
  expect(undefined).to.be.undefined;
  expect(1).to.be.above(0);
  expect(1).to.be.below(2);
  expect(1).to.be.within(0, 2);
  expect({a: 1}).to.be.an('object');
  expect([1, 2, 3]).to.have.lengthOf(3);
  expect('foobar').to.match(/^foo/);
  expect('foobar').to.have.string('bar');
  expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
  expect({a: 1}).to.have.deep.property('a', 1);
  expect([{a: 1}]).to.have.deep.members([{a: 1}]);
  expect(1).to.be.oneOf([1, 2, 3]);
  expect({name: {first: "John"}}).to.containSubset({name: {first: "John"}});
  
  console.log('All basic tests passed!');
} catch (e) {
  console.error('Test failed:', e.message);
  console.error(e.stack);
  process.exit(1);
}
