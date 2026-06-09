/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Close-to assertions: closeTo / approximately
 */

import {Assertion} from '../../assertion.js';
import {AssertionError} from 'assertion-error';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .closeTo(expected, delta[, msg])
 *
 * Asserts that the target is a number that's within a given +/- `delta` range
 * of the given number `expected`. However, it's often best to assert that the
 * target is equal to its expected value.
 *
 *     // Recommended
 *     expect(1.5).to.equal(1.5);
 *
 *     // Not recommended
 *     expect(1.5).to.be.closeTo(1, 0.5);
 *     expect(1.5).to.be.closeTo(2, 0.5);
 *     expect(1.5).to.be.closeTo(1, 1);
 *
 * Add `.not` earlier in the chain to negate `.closeTo`.
 *
 *     expect(1.5).to.equal(1.5); // Recommended
 *     expect(1.5).to.not.be.closeTo(3, 1); // Not recommended
 *
 * `.closeTo` accepts an optional `msg` argument which is a custom error
 * message to show when the assertion fails. The message can also be given as
 * the second argument to `expect`.
 *
 *     expect(1.5).to.be.closeTo(3, 1, 'nooo why fail??');
 *     expect(1.5, 'nooo why fail??').to.be.closeTo(3, 1);
 *
 * The alias `.approximately` can be used interchangeably with `.closeTo`.
 *
 * @name closeTo
 * @alias approximately
 * @param {number} expected
 * @param {number} delta
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
function closeTo(expected, delta, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    flagMsg = flag(this, 'message'),
    ssfi = flag(this, 'ssfi');

  new Assertion(obj, flagMsg, ssfi, true).is.numeric;
  let message = 'A `delta` value is required for `closeTo`';
  if (delta == undefined) {
    throw new AssertionError(
      flagMsg ? `${flagMsg}: ${message}` : message,
      undefined,
      ssfi
    );
  }
  new Assertion(delta, flagMsg, ssfi, true).is.numeric;
  message = 'A `expected` value is required for `closeTo`';
  if (expected == undefined) {
    throw new AssertionError(
      flagMsg ? `${flagMsg}: ${message}` : message,
      undefined,
      ssfi
    );
  }
  new Assertion(expected, flagMsg, ssfi, true).is.numeric;

  const abs = (x) => (x < 0 ? -x : x);

  const strip = (number) => parseFloat(parseFloat(number).toPrecision(12));

  this.assert(
    strip(abs(obj - expected)) <= delta,
    'expected #{this} to be close to ' + expected + ' +/- ' + delta,
    'expected #{this} not to be close to ' + expected + ' +/- ' + delta
  );
}

Assertion.addMethod('closeTo', closeTo);
Assertion.addMethod('approximately', closeTo);