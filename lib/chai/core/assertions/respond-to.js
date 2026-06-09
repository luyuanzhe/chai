/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Respond-to assertions: respondTo / respondsTo / itself
 */

import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .respondTo(method[, msg])
 *
 * When the target is a non-function object, `.respondTo` asserts that the
 * target has a method with the given name `method`. The method can be own or
 * inherited, and it can be enumerable or non-enumerable.
 *
 *     function Cat () {}
 *     Cat.prototype.meow = function () {};
 *
 *     expect(new Cat()).to.respondTo('meow');
 *
 * When the target is a function, `.respondTo` asserts that the target's
 * `prototype` property has a method with the given name `method`. Again, the
 * method can be own or inherited, and it can be enumerable or non-enumerable.
 *
 *     function Cat () {}
 *     Cat.prototype.meow = function () {};
 *
 *     expect(Cat).to.respondTo('meow');
 *
 * Add `.itself` earlier in the chain to force `.respondTo` to treat the
 * target as a non-function object, even if it's a function. Thus, it asserts
 * that the target has a method with the given name `method`, rather than
 * asserting that the target's `prototype` property has a method with the
 * given name `method`.
 *
 *     function Cat () {}
 *     Cat.prototype.meow = function () {};
 *     Cat.hiss = function () {};
 *
 *     expect(Cat).itself.to.respondTo('hiss').but.not.respondTo('meow');
 *
 * When not adding `.itself`, it's important to check the target's type before
 * using `.respondTo`. See the `.a` doc for info on checking a target's type.
 *
 *     function Cat () {}
 *     Cat.prototype.meow = function () {};
 *
 *     expect(new Cat()).to.be.an('object').that.respondsTo('meow');
 *
 * Add `.not` earlier in the chain to negate `.respondTo`.
 *
 *     function Dog () {}
 *     Dog.prototype.bark = function () {};
 *
 *     expect(new Dog()).to.not.respondTo('meow');
 *
 * `.respondTo` accepts an optional `msg` argument which is a custom error
 * message to show when the assertion fails. The message can also be given as
 * the second argument to `expect`.
 *
 *     expect({}).to.respondTo('meow', 'nooo why fail??');
 *     expect({}, 'nooo why fail??').to.respondTo('meow');
 *
 * The alias `.respondsTo` can be used interchangeably with `.respondTo`.
 *
 * @name respondTo
 * @alias respondsTo
 * @param {string} method
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
function respondTo(method, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    itself = flag(this, 'itself'),
    context =
      'function' === typeof obj && !itself
        ? obj.prototype[method]
        : obj[method];

  this.assert(
    'function' === typeof context,
    'expected #{this} to respond to ' + _.inspect(method),
    'expected #{this} to not respond to ' + _.inspect(method)
  );
}

Assertion.addMethod('respondTo', respondTo);
Assertion.addMethod('respondsTo', respondTo);

/**
 * ### .itself
 *
 * Forces all `.respondTo` assertions that follow in the chain to behave as if
 * the target is a non-function object, even if it's a function. Thus, it
 * causes `.respondTo` to assert that the target has a method with the given
 * name, rather than asserting that the target's `prototype` property has a
 * method with the given name.
 *
 *     function Cat () {}
 *     Cat.prototype.meow = function () {};
 *     Cat.hiss = function () {};
 *
 *     expect(Cat).itself.to.respondTo('hiss').but.not.respondTo('meow');
 *
 * @name itself
 * @namespace BDD
 * @public
 */
Assertion.addProperty('itself', function () {
  flag(this, 'itself', true);
});