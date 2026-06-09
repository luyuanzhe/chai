/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Satisfy assertions: satisfy / satisfies
 */

import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .satisfy(matcher[, msg])
 *
 * Invokes the given `matcher` function with the target being passed as the
 * first argument, and asserts that the value returned is truthy.
 *
 *     expect(1).to.satisfy(function(num) {
 *         return num > 0;
 *     });
 *
 * Add `.not` earlier in the chain to negate `.satisfy`.
 *
 *     expect(1).to.not.satisfy(function(num) {
 *         return num > 2;
 *     });
 *
 * `.satisfy` accepts an optional `msg` argument which is a custom error
 * message to show when the assertion fails. The message can also be given as
 * the second argument to `expect`.
 *
 *     expect(1).to.satisfy(function(num) {
 *         return num > 2;
 *     }, 'nooo why fail??');
 *
 *     expect(1, 'nooo why fail??').to.satisfy(function(num) {
 *         return num > 2;
 *     });
 *
 * The alias `.satisfies` can be used interchangeably with `.satisfy`.
 *
 * @name satisfy
 * @alias satisfies
 * @param {Function} matcher
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
function satisfy(matcher, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object');
  let result = matcher(obj);
  this.assert(
    result,
    'expected #{this} to satisfy ' + _.objDisplay(matcher),
    'expected #{this} to not satisfy' + _.objDisplay(matcher),
    flag(this, 'negate') ? false : true,
    result
  );
}

Assertion.addMethod('satisfy', satisfy);
Assertion.addMethod('satisfies', satisfy);