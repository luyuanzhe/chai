/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Empty assertion
 */

import {Assertion} from '../../assertion.js';
import {AssertionError} from 'assertion-error';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .empty
 *
 * When the target is a string or array, `.empty` asserts that the target's
 * `length` property is strictly (`===`) equal to `0`.
 *
 *     expect([]).to.be.empty;
 *     expect('').to.be.empty;
 *
 * When the target is a map or set, `.empty` asserts that the target's `size`
 * property is strictly equal to `0`.
 *
 *     expect(new Set()).to.be.empty;
 *     expect(new Map()).to.be.empty;
 *
 * When the target is a non-function object, `.empty` asserts that the target
 * doesn't have any own enumerable properties. Properties with Symbol-based
 * keys are excluded from the count.
 *
 *     expect({}).to.be.empty;
 *
 * Because `.empty` does different things based on the target's type, it's
 * important to check the target's type before using `.empty`. See the `.a`
 * doc for info on testing a target's type.
 *
 *     expect([]).to.be.an('array').that.is.empty;
 *
 * Add `.not` earlier in the chain to negate `.empty`. However, it's often
 * best to assert that the target contains its expected number of values,
 * rather than asserting that it's not empty.
 *
 *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
 *     expect([1, 2, 3]).to.not.be.empty; // Not recommended
 *
 *     expect(new Set([1, 2, 3])).to.have.property('size', 3); // Recommended
 *     expect(new Set([1, 2, 3])).to.not.be.empty; // Not recommended
 *
 *     expect(Object.keys({a: 1})).to.have.lengthOf(1); // Recommended
 *     expect({a: 1}).to.not.be.empty; // Not recommended
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect([1, 2, 3], 'nooo why fail??').to.be.empty;
 *
 * @name empty
 * @namespace BDD
 * @public
 */
Assertion.addProperty('empty', function () {
  let val = flag(this, 'object'),
    ssfi = flag(this, 'ssfi'),
    flagMsg = flag(this, 'message'),
    itemsCount;

  flagMsg = flagMsg ? flagMsg + ': ' : '';

  switch (_.type(val).toLowerCase()) {
    case 'array':
    case 'string':
      itemsCount = val.length;
      break;
    case 'map':
    case 'set':
      itemsCount = val.size;
      break;
    case 'weakmap':
    case 'weakset':
      throw new AssertionError(
        flagMsg + '.empty was passed a weak collection',
        undefined,
        ssfi
      );
    case 'function': {
      const msg = flagMsg + '.empty was passed a function ' + _.getName(val);
      throw new AssertionError(msg.trim(), undefined, ssfi);
    }
    default:
      if (val !== Object(val)) {
        throw new AssertionError(
          flagMsg + '.empty was passed non-string primitive ' + _.inspect(val),
          undefined,
          ssfi
        );
      }
      itemsCount = Object.keys(val).length;
  }

  this.assert(
    0 === itemsCount,
    'expected #{this} to be empty',
    'expected #{this} not to be empty'
  );
});