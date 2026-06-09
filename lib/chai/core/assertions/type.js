/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Type assertion: a / an
 */

import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

const functionTypes = {
  function: [
    'function',
    'asyncfunction',
    'generatorfunction',
    'asyncgeneratorfunction'
  ],
  asyncfunction: ['asyncfunction', 'asyncgeneratorfunction'],
  generatorfunction: ['generatorfunction', 'asyncgeneratorfunction'],
  asyncgeneratorfunction: ['asyncgeneratorfunction']
};

/**
 * ### .a(type[, msg])
 *
 * Asserts that the target's type is equal to the given string `type`. Types
 * are case insensitive. See the utility file `./type-detect.js` for info on the
 * type detection algorithm.
 *
 *     expect('foo').to.be.a('string');
 *     expect({a: 1}).to.be.an('object');
 *     expect(null).to.be.a('null');
 *     expect(undefined).to.be.an('undefined');
 *     expect(new Error).to.be.an('error');
 *     expect(Promise.resolve()).to.be.a('promise');
 *     expect(new Float32Array).to.be.a('float32array');
 *     expect(Symbol()).to.be.a('symbol');
 *
 * `.a` supports objects that have a custom type set via `Symbol.toStringTag`.
 *
 *     var myObj = {
 *         [Symbol.toStringTag]: 'myCustomType'
 *     };
 *
 *     expect(myObj).to.be.a('myCustomType').but.not.an('object');
 *
 * It's often best to use `.a` to check a target's type before making more
 * assertions on the same target. That way, you avoid unexpected behavior from
 * any assertion that does different things based on the target's type.
 *
 *     expect([1, 2, 3]).to.be.an('array').that.includes(2);
 *     expect([]).to.be.an('array').that.is.empty;
 *
 * Add `.not` earlier in the chain to negate `.a`. However, it's often best to
 * assert that the target is the expected type, rather than asserting that it
 * isn't one of many unexpected types.
 *
 *     expect('foo').to.be.a('string'); // Recommended
 *     expect('foo').to.not.be.an('array'); // Not recommended
 *
 * `.a` accepts an optional `msg` argument which is a custom error message to
 * show when the assertion fails. The message can also be given as the second
 * argument to `expect`.
 *
 *     expect(1).to.be.a('string', 'nooo why fail??');
 *     expect(1, 'nooo why fail??').to.be.a('string');
 *
 * `.a` can also be used as a language chain to improve the readability of
 * your assertions.
 *
 *     expect({b: 2}).to.have.a.property('b');
 *
 * The alias `.an` can be used interchangeably with `.a`.
 *
 * @name a
 * @alias an
 * @param {string} type
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
function an(type, msg) {
  if (msg) flag(this, 'message', msg);
  type = type.toLowerCase();
  let obj = flag(this, 'object'),
    article = ~['a', 'e', 'i', 'o', 'u'].indexOf(type.charAt(0)) ? 'an ' : 'a ';

  const detectedType = _.type(obj).toLowerCase();

  if (functionTypes['function'].includes(type)) {
    this.assert(
      functionTypes[type].includes(detectedType),
      'expected #{this} to be ' + article + type,
      'expected #{this} not to be ' + article + type
    );
  } else {
    this.assert(
      type === detectedType,
      'expected #{this} to be ' + article + type,
      'expected #{this} not to be ' + article + type
    );
  }
}

Assertion.addChainableMethod('an', an);
Assertion.addChainableMethod('a', an);