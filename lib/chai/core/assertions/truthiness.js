/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Truthiness assertions: ok, true, numeric, callable, false
 */

import {Assertion} from '../../assertion.js';
import {AssertionError} from 'assertion-error';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .ok
 *
 * Asserts that the target is a truthy value (considered `true` in boolean context).
 * However, it's often best to assert that the target is strictly (`===`) or
 * deeply equal to its expected value.
 *
 *     expect(1).to.equal(1); // Recommended
 *     expect(1).to.be.ok; // Not recommended
 *
 *     expect(true).to.be.true; // Recommended
 *     expect(true).to.be.ok; // Not recommended
 *
 * Add `.not` earlier in the chain to negate `.ok`.
 *
 *     expect(0).to.equal(0); // Recommended
 *     expect(0).to.not.be.ok; // Not recommended
 *
 *     expect(false).to.be.false; // Recommended
 *     expect(false).to.not.be.ok; // Not recommended
 *
 *     expect(null).to.be.null; // Recommended
 *     expect(null).to.not.be.ok; // Not recommended
 *
 *     expect(undefined).to.be.undefined; // Recommended
 *     expect(undefined).to.not.be.ok; // Not recommended
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect(false, 'nooo why fail??').to.be.ok;
 *
 * @name ok
 * @namespace BDD
 * @public
 */
Assertion.addProperty('ok', function () {
  this.assert(
    flag(this, 'object'),
    'expected #{this} to be truthy',
    'expected #{this} to be falsy'
  );
});

/**
 * ### .true
 *
 * Asserts that the target is strictly (`===`) equal to `true`.
 *
 *     expect(true).to.be.true;
 *
 * Add `.not` earlier in the chain to negate `.true`. However, it's often best
 * to assert that the target is equal to its expected value, rather than not
 * equal to `true`.
 *
 *     expect(false).to.be.false; // Recommended
 *     expect(false).to.not.be.true; // Not recommended
 *
 *     expect(1).to.equal(1); // Recommended
 *     expect(1).to.not.be.true; // Not recommended
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect(false, 'nooo why fail??').to.be.true;
 *
 * @name true
 * @namespace BDD
 * @public
 */
Assertion.addProperty('true', function () {
  this.assert(
    true === flag(this, 'object'),
    'expected #{this} to be true',
    'expected #{this} to be false',
    flag(this, 'negate') ? false : true
  );
});

/**
 * ### .numeric
 *
 * Asserts that the target is a number or a bigint.
 *
 *     expect(1).to.be.numeric;
 *     expect(1n).to.be.numeric;
 *
 * Add `.not` earlier in the chain to negate `.numeric`.
 *
 *     expect('foo').to.not.be.numeric;
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect('foo', 'nooo why fail??').to.be.numeric;
 *
 * @name numeric
 * @namespace BDD
 * @public
 */
Assertion.addProperty('numeric', function () {
  const object = flag(this, 'object');

  this.assert(
    ['Number', 'BigInt'].includes(_.type(object)),
    'expected #{this} to be numeric',
    'expected #{this} to not be numeric',
    flag(this, 'negate') ? false : true
  );
});

/**
 * ### .callable
 *
 * Asserts that the target a callable function.
 *
 *     expect(console.log).to.be.callable;
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect('not a function', 'nooo why fail??').to.be.callable;
 *
 * @name callable
 * @namespace BDD
 * @public
 */
Assertion.addProperty('callable', function () {
  const val = flag(this, 'object');
  const ssfi = flag(this, 'ssfi');
  const message = flag(this, 'message');
  const msg = message ? `${message}: ` : '';
  const negate = flag(this, 'negate');

  const assertionMessage = negate
    ? `${msg}expected ${_.inspect(val)} not to be a callable function`
    : `${msg}expected ${_.inspect(val)} to be a callable function`;

  const isCallable = [
    'Function',
    'AsyncFunction',
    'GeneratorFunction',
    'AsyncGeneratorFunction'
  ].includes(_.type(val));

  if ((isCallable && negate) || (!isCallable && !negate)) {
    throw new AssertionError(assertionMessage, undefined, ssfi);
  }
});

/**
 * ### .false
 *
 * Asserts that the target is strictly (`===`) equal to `false`.
 *
 *     expect(false).to.be.false;
 *
 * Add `.not` earlier in the chain to negate `.false`. However, it's often
 * best to assert that the target is equal to its expected value, rather than
 * not equal to `false`.
 *
 *     expect(true).to.be.true; // Recommended
 *     expect(true).to.not.be.false; // Not recommended
 *
 *     expect(1).to.equal(1); // Recommended
 *     expect(1).to.not.be.false; // Not recommended
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect(true, 'nooo why fail??').to.be.false;
 *
 * @name false
 * @namespace BDD
 * @public
 */
Assertion.addProperty('false', function () {
  this.assert(
    false === flag(this, 'object'),
    'expected #{this} to be false',
    'expected #{this} to be true',
    flag(this, 'negate') ? true : false
  );
});