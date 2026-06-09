/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Length assertion
 */

import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

function assertLengthChain() {
  flag(this, 'doLength', true);
}

/**
 * ### .lengthOf(n[, msg])
 *
 * Asserts that the target's `length` or `size` is equal to the given number
 * `n`.
 *
 *     expect([1, 2, 3]).to.have.lengthOf(3);
 *     expect('foo').to.have.lengthOf(3);
 *     expect(new Set([1, 2, 3])).to.have.lengthOf(3);
 *     expect(new Map([['a', 1], ['b', 2], ['c', 3]])).to.have.lengthOf(3);
 *
 * Add `.not` earlier in the chain to negate `.lengthOf`. However, it's often
 * best to assert that the target's `length` property is equal to its expected
 * value, rather than not equal to one of many unexpected values.
 *
 *     expect('foo').to.have.lengthOf(3); // Recommended
 *     expect('foo').to.not.have.lengthOf(4); // Not recommended
 *
 * `.lengthOf` accepts an optional `msg` argument which is a custom error
 * message to show when the assertion fails. The message can also be given as
 * the second argument to `expect`.
 *
 *     expect([1, 2, 3]).to.have.lengthOf(2, 'nooo why fail??');
 *     expect([1, 2, 3], 'nooo why fail??').to.have.lengthOf(2);
 *
 * `.lengthOf` can also be used as a language chain, causing all `.above`,
 * `.below`, `.least`, `.most`, and `.within` assertions that follow in the
 * chain to use the target's `length` property as the target. However, it's
 * often best to assert that the target's `length` property is equal to its
 * expected length, rather than asserting that its `length` property falls
 * within some range of values.
 *
 *     // Recommended
 *     expect([1, 2, 3]).to.have.lengthOf(3);
 *
 *     // Not recommended
 *     expect([1, 2, 3]).to.have.lengthOf.above(2);
 *     expect([1, 2, 3]).to.have.lengthOf.below(4);
 *     expect([1, 2, 3]).to.have.lengthOf.at.least(3);
 *     expect([1, 2, 3]).to.have.lengthOf.at.most(3);
 *     expect([1, 2, 3]).to.have.lengthOf.within(2,4);
 *
 * Due to a compatibility issue, the alias `.length` can't be chained directly
 * off of an uninvoked method such as `.a`. Therefore, `.length` can't be used
 * interchangeably with `.lengthOf` in every situation. It's recommended to
 * always use `.lengthOf` instead of `.length`.
 *
 *     expect([1, 2, 3]).to.have.a.length(3); // incompatible; throws error
 *     expect([1, 2, 3]).to.have.a.lengthOf(3);  // passes as expected
 *
 * @name lengthOf
 * @alias length
 * @param {number} n
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
function assertLength(n, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    objType = _.type(obj).toLowerCase(),
    flagMsg = flag(this, 'message'),
    ssfi = flag(this, 'ssfi'),
    descriptor = 'length',
    itemsCount;

  switch (objType) {
    case 'map':
    case 'set':
      descriptor = 'size';
      itemsCount = obj.size;
      break;
    default:
      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
      itemsCount = obj.length;
  }

  this.assert(
    itemsCount == n,
    'expected #{this} to have a ' + descriptor + ' of #{exp} but got #{act}',
    'expected #{this} to not have a ' + descriptor + ' of #{act}',
    n,
    itemsCount
  );
}

Assertion.addChainableMethod('length', assertLength, assertLengthChain);
Assertion.addChainableMethod('lengthOf', assertLength, assertLengthChain);