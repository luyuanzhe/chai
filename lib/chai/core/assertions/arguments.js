/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Arguments assertion
 */

import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .arguments
 *
 * Asserts that the target is an `arguments` object.
 *
 *     function test () {
 *         expect(arguments).to.be.arguments;
 *     }
 *
 *     test();
 *
 * Add `.not` earlier in the chain to negate `.arguments`. However, it's often
 * best to assert which type the target is expected to be, rather than
 * asserting that it’s not an `arguments` object.
 *
 *     expect('foo').to.be.a('string'); // Recommended
 *     expect('foo').to.not.be.arguments; // Not recommended
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect({}, 'nooo why fail??').to.be.arguments;
 *
 * The alias `.Arguments` can be used interchangeably with `.arguments`.
 *
 * @name arguments
 * @alias Arguments
 * @namespace BDD
 * @public
 */
function checkArguments() {
  let obj = flag(this, 'object'),
    type = _.type(obj);
  this.assert(
    'Arguments' === type,
    'expected #{this} to be arguments but got ' + type,
    'expected #{this} to not be arguments'
  );
}

Assertion.addProperty('arguments', checkArguments);
Assertion.addProperty('Arguments', checkArguments);