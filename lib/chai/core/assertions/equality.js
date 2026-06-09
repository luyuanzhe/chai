/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Equality assertions: equal, eql
 */

import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .equal(val[, msg])
 *
 * Asserts that the target is strictly (`===`) equal to the given `val`.
 *
 *     expect(1).to.equal(1);
 *     expect('foo').to.equal('foo');
 *
 * Add `.deep` earlier in the chain to use deep equality instead. See the
 * `deep-eql` project page for info on the deep equality algorithm:
 * https://github.com/chaijs/deep-eql.
 *
 *     // Target object deeply (but not strictly) equals `{a: 1}`
 *     expect({a: 1}).to.deep.equal({a: 1});
 *     expect({a: 1}).to.not.equal({a: 1});
 *
 *     // Target array deeply (but not strictly) equals `[1, 2]`
 *     expect([1, 2]).to.deep.equal([1, 2]);
 *     expect([1, 2]).to.not.equal([1, 2]);
 *
 * Add `.not` earlier in the chain to negate `.equal`. However, it's often
 * best to assert that the target is equal to its expected value, rather than
 * not equal to one of countless unexpected values.
 *
 *     expect(1).to.equal(1); // Recommended
 *     expect(1).to.not.equal(2); // Not recommended
 *
 * `.equal` accepts an optional `msg` argument which is a custom error message
 * to show when the assertion fails. The message can also be given as the
 * second argument to `expect`.
 *
 *     expect(1).to.equal(2, 'nooo why fail??');
 *     expect(1, 'nooo why fail??').to.equal(2);
 *
 * The aliases `.equals` and `eq` can be used interchangeably with `.equal`.
 *
 * @name equal
 * @alias equals
 * @alias eq
 * @param {unknown} val
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
function assertEqual(val, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object');
  if (flag(this, 'deep')) {
    let prevLockSsfi = flag(this, 'lockSsfi');
    flag(this, 'lockSsfi', true);
    this.eql(val);
    flag(this, 'lockSsfi', prevLockSsfi);
  } else {
    this.assert(
      val === obj,
      'expected #{this} to equal #{exp}',
      'expected #{this} to not equal #{exp}',
      val,
      this._obj,
      true
    );
  }
}

Assertion.addMethod('equal', assertEqual);
Assertion.addMethod('equals', assertEqual);
Assertion.addMethod('eq', assertEqual);

/**
 * ### .eql(obj[, msg])
 *
 * Asserts that the target is deeply equal to the given `obj`. See the
 * `deep-eql` project page for info on the deep equality algorithm:
 * https://github.com/chaijs/deep-eql.
 *
 *     // Target object is deeply (but not strictly) equal to {a: 1}
 *     expect({a: 1}).to.eql({a: 1}).but.not.equal({a: 1});
 *
 *     // Target array is deeply (but not strictly) equal to [1, 2]
 *     expect([1, 2]).to.eql([1, 2]).but.not.equal([1, 2]);
 *
 * Add `.not` earlier in the chain to negate `.eql`. However, it's often best
 * to assert that the target is deeply equal to its expected value, rather
 * than not deeply equal to one of countless unexpected values.
 *
 *     expect({a: 1}).to.eql({a: 1}); // Recommended
 *     expect({a: 1}).to.not.eql({b: 2}); // Not recommended
 *
 * `.eql` accepts an optional `msg` argument which is a custom error message
 * to show when the assertion fails. The message can also be given as the
 * second argument to `expect`.
 *
 *     expect({a: 1}).to.eql({b: 2}, 'nooo why fail??');
 *     expect({a: 1}, 'nooo why fail??').to.eql({b: 2});
 *
 * The alias `.eqls` can be used interchangeably with `.eql`.
 *
 * The `.deep.equal` assertion is almost identical to `.eql` but with one
 * difference: `.deep.equal` causes deep equality comparisons to also be used
 * for any other assertions that follow in the chain.
 *
 * @name eql
 * @alias eqls
 * @param {unknown} obj
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
function assertEql(obj, msg) {
  if (msg) flag(this, 'message', msg);
  let eql = flag(this, 'eql');
  this.assert(
    eql(obj, flag(this, 'object')),
    'expected #{this} to deeply equal #{exp}',
    'expected #{this} to not deeply equal #{exp}',
    obj,
    this._obj,
    true
  );
}

Assertion.addMethod('eql', assertEql);
Assertion.addMethod('eqls', assertEql);