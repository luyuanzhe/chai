/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * One-of assertion: oneOf
 */

import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .oneOf(list[, msg])
 *
 * Asserts that the target is a member of the given array `list`. However,
 * it's often best to assert that the target is equal to its expected value.
 *
 *     expect(1).to.equal(1); // Recommended
 *     expect(1).to.be.oneOf([1, 2, 3]); // Not recommended
 *
 * Comparisons are performed using strict (`===`) equality.
 *
 * Add `.not` earlier in the chain to negate `.oneOf`.
 *
 *     expect(1).to.equal(1); // Recommended
 *     expect(1).to.not.be.oneOf([2, 3, 4]); // Not recommended
 *
 * It can also be chained with `.contain` or `.include`, which will work with
 * both arrays and strings:
 *
 *     expect('Today is sunny').to.contain.oneOf(['sunny', 'cloudy'])
 *     expect('Today is rainy').to.not.contain.oneOf(['sunny', 'cloudy'])
 *     expect([1,2,3]).to.contain.oneOf([3,4,5])
 *     expect([1,2,3]).to.not.contain.oneOf([4,5,6])
 *
 * `.oneOf` accepts an optional `msg` argument which is a custom error message
 * to show when the assertion fails. The message can also be given as the
 * second argument to `expect`.
 *
 *     expect(1).to.be.oneOf([2, 3, 4], 'nooo why fail??');
 *     expect(1, 'nooo why fail??').to.be.oneOf([2, 3, 4]);
 *
 * @name oneOf
 * @param {Array<*>} list
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
function oneOf(list, msg) {
  if (msg) flag(this, 'message', msg);
  let expected = flag(this, 'object'),
    flagMsg = flag(this, 'message'),
    ssfi = flag(this, 'ssfi'),
    contains = flag(this, 'contains'),
    isDeep = flag(this, 'deep'),
    eql = flag(this, 'eql');
  new Assertion(list, flagMsg, ssfi, true).to.be.an('array');

  if (contains) {
    this.assert(
      list.some(function (possibility) {
        return (
          expected.indexOf(possibility) > -1 ||
          (isDeep &&
            Array.isArray(expected) &&
            expected.some(function (item) {
              return eql(item, possibility);
            }))
        );
      }),
      'expected #{this} to ' +
        (isDeep ? 'deeply ' : '') +
        'contain one of #{exp}',
      'expected #{this} to not ' +
        (isDeep ? 'deeply ' : '') +
        'contain one of #{exp}',
      list,
      expected
    );
  } else {
    if (isDeep) {
      this.assert(
        list.some(function (possibility) {
          return eql(expected, possibility);
        }),
        'expected #{this} to deeply equal one of #{exp}',
        'expected #{this} to deeply equal one of #{exp}',
        list,
        expected
      );
    } else {
      this.assert(
        list.indexOf(expected) > -1,
        'expected #{this} to be one of #{exp}',
        'expected #{this} to not be one of #{exp}',
        list,
        expected
      );
    }
  }
}

Assertion.addMethod('oneOf', oneOf);