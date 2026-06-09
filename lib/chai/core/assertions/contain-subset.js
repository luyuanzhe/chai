/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * containSubset assertion
 */

import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';
import {config} from '../../config.js';

/**
 * A subset-aware compare function
 *
 * @param {unknown} expected
 * @param {unknown} actual
 * @returns {boolean}
 */
function compareSubset(expected, actual) {
  if (expected === actual) {
    return true;
  }
  if (typeof actual !== typeof expected) {
    return false;
  }
  if (typeof expected !== 'object' || expected === null) {
    return expected === actual;
  }
  if (!actual) {
    return false;
  }

  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) {
      return false;
    }
    return expected.every(function (exp) {
      return actual.some(function (act) {
        return compareSubset(exp, act);
      });
    });
  }

  if (expected instanceof Date) {
    if (actual instanceof Date) {
      return expected.getTime() === actual.getTime();
    } else {
      return false;
    }
  }

  return Object.keys(expected).every(function (key) {
    let expectedValue = expected[key];
    let actualValue = actual[key];
    if (
      typeof expectedValue === 'object' &&
      expectedValue !== null &&
      actualValue !== null
    ) {
      return compareSubset(expectedValue, actualValue);
    }
    if (typeof expectedValue === 'function') {
      return expectedValue(actualValue);
    }
    return actualValue === expectedValue;
  });
}

/**
 * ### .containSubset(subset[, msg])
 *
 * Asserts that the target object/array deeply contains all of the provided
 * `subset`'s properties/elements at the same nested structure. This is useful
 * for partial matching of complex objects without needing to specify all fields.
 *
 * When the target is an object, `.containSubset` asserts that all of `subset`'s
 * properties exist in the target with the same values, at the same nested depth.
 * The target may have additional properties that are not in `subset`.
 *
 *     expect({name: {first: "John", last: "Smith"}, age: 30})
 *       .to.containSubset({name: {first: "John"}});
 *
 *     expect({a: 1, b: 2, c: 3}).to.containSubset({a: 1, b: 2});
 *
 * When the target is an array, `.containSubset` asserts that for each element
 * in the `subset` array, there exists at least one matching element in the
 * target array. Order does not matter.
 *
 *     expect([{id: 1, name: "Alice"}, {id: 2, name: "Bob"}])
 *       .to.containSubset([{name: "Alice"}]);
 *
 *     expect([1, 2, 3, 4]).to.containSubset([2, 4]);
 *
 * Nested arrays and objects are compared recursively.
 *
 *     expect({
 *       users: [
 *         {name: "Alice", roles: ["admin", "user"]},
 *         {name: "Bob", roles: ["user"]}
 *       ]
 *     }).to.containSubset({
 *       users: [{name: "Alice"}]
 *     });
 *
 * Functions in the `subset` are treated as validators. The corresponding value
 * in the target is passed to the function, and the assertion passes if the
 * function returns a truthy value.
 *
 *     expect({age: 25}).to.containSubset({age: (val) => val > 18});
 *     expect({name: "Alice"}).to.containSubset({name: (val) => val.startsWith("A")});
 *
 * Date objects are compared by their timestamp values.
 *
 *     expect({createdAt: new Date('2024-01-15')})
 *       .to.containSubset({createdAt: new Date('2024-01-15')});
 *
 * Add `.not` earlier in the chain to negate `.containSubset`. However, it's
 * often best to identify the exact output that's expected, and then write an
 * assertion that only accepts that exact output.
 *
 *     expect({a: 1, b: 2}).to.not.containSubset({a: 3});
 *     expect([1, 2, 3]).to.not.containSubset([4, 5]);
 *
 * `.containSubset` accepts an optional `msg` argument which is a custom error
 * message to show when the assertion fails. The message can also be given as
 * the second argument to `expect`.
 *
 *     expect({a: 1}).to.containSubset({b: 2}, 'nooo why fail??');
 *     expect({a: 1}, 'nooo why fail??').to.containSubset({b: 2});
 *
 * @name containSubset
 * @param {unknown} subset
 * @param {string=} msg _optional_
 * @namespace BDD
 * @public
 */
Assertion.addMethod('containSubset', function (expected) {
  const actual = _.flag(this, 'object');
  const showDiff = config.showDiff;

  this.assert(
    compareSubset(expected, actual),
    'expected #{act} to contain subset #{exp}',
    'expected #{act} to not contain subset #{exp}',
    expected,
    actual,
    showDiff
  );
});