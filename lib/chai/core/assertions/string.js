/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * String assertion
 */

import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .string(str[, msg])
 *
 * Asserts that the target string contains the given substring `str`.
 *
 *     expect('foobar').to.have.string('bar');
 *
 * Add `.not` earlier in the chain to negate `.string`.
 *
 *     expect('foobar').to.not.have.string('taco');
 *
 * `.string` accepts an optional `msg` argument which is a custom error
 * message to show when the assertion fails. The message can also be given as
 * the second argument to `expect`.
 *
 *     expect('foobar').to.have.string('taco', 'nooo why fail??');
 *     expect('foobar', 'nooo why fail??').to.have.string('taco');
 *
 * @name string
 * @param {string} str
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
Assertion.addMethod('string', function (str, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    flagMsg = flag(this, 'message'),
    ssfi = flag(this, 'ssfi');
  new Assertion(obj, flagMsg, ssfi, true).is.a('string');

  this.assert(
    ~obj.indexOf(str),
    'expected #{this} to contain ' + _.inspect(str),
    'expected #{this} to not contain ' + _.inspect(str)
  );
});