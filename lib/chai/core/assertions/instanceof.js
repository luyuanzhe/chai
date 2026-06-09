/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Instanceof assertion
 */

import {Assertion} from '../../assertion.js';
import {AssertionError} from 'assertion-error';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .instanceof(constructor[, msg])
 *
 * Asserts that the target is an instance of the given `constructor`.
 *
 *     function Cat () { }
 *
 *     expect(new Cat()).to.be.an.instanceof(Cat);
 *     expect([1, 2]).to.be.an.instanceof(Array);
 *
 * Add `.not` earlier in the chain to negate `.instanceof`.
 *
 *     expect({a: 1}).to.not.be.an.instanceof(Array);
 *
 * `.instanceof` accepts an optional `msg` argument which is a custom error
 * message to show when the assertion fails. The message can also be given as
 * the second argument to `expect`.
 *
 *     expect(1).to.be.an.instanceof(Array, 'nooo why fail??');
 *     expect(1, 'nooo why fail??').to.be.an.instanceof(Array);
 *
 * Due to limitations in ES5, `.instanceof` may not always work as expected
 * when using a transpiler such as Babel or TypeScript. In particular, it may
 * produce unexpected results when subclassing built-in object such as
 * `Array`, `Error`, and `Map`. See your transpiler's docs for details:
 *
 * - ([Babel](https://babeljs.io/docs/usage/caveats/#classes))
 * - ([TypeScript](https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work))
 *
 * The alias `.instanceOf` can be used interchangeably with `.instanceof`.
 *
 * @name instanceof
 * @param {unknown} constructor
 * @param {string} msg _optional_
 * @alias instanceOf
 * @namespace BDD
 * @public
 */
function assertInstanceOf(constructor, msg) {
  if (msg) flag(this, 'message', msg);

  let target = flag(this, 'object');
  let ssfi = flag(this, 'ssfi');
  let flagMsg = flag(this, 'message');
  let isInstanceOf;

  try {
    isInstanceOf = target instanceof constructor;
  } catch (err) {
    if (err instanceof TypeError) {
      flagMsg = flagMsg ? flagMsg + ': ' : '';
      throw new AssertionError(
        flagMsg +
          'The instanceof assertion needs a constructor but ' +
          _.type(constructor) +
          ' was given.',
        undefined,
        ssfi
      );
    }
    throw err;
  }

  let name = _.getName(constructor);
  if (name == null) {
    name = 'an unnamed constructor';
  }

  this.assert(
    isInstanceOf,
    'expected #{this} to be an instance of ' + name,
    'expected #{this} to not be an instance of ' + name
  );
}

Assertion.addMethod('instanceof', assertInstanceOf);
Assertion.addMethod('instanceOf', assertInstanceOf);