/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Match / string assertions
 */

import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .match(re[, msg])
 *
 * Asserts that the target matches the given regular expression `re`.
 *
 *     expect('foobar').to.match(/^foo/);
 *
 * Add `.not` earlier in the chain to negate `.match`.
 *
 *     expect('foobar').to.not.match(/taco/);
 *
 * `.match` accepts an optional `msg` argument which is a custom error message
 * to show when the assertion fails. The message can also be given as the
 * second argument to `expect`.
 *
 *     expect('foobar').to.match(/taco/, 'nooo why fail??');
 *     expect('foobar', 'nooo why fail??').to.match(/taco/);
 *
 * The alias `.matches` can be used interchangeably with `.match`.
 *
 * @name match
 * @alias matches
 * @param {RegExp} re
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
function assertMatch(re, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object');
  this.assert(
    re.exec(obj),
    'expected #{this} to match ' + re,
    'expected #{this} not to match ' + re
  );
}

Assertion.addMethod('match', assertMatch);
Assertion.addMethod('matches', assertMatch);