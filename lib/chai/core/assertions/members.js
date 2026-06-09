/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Members assertions: members, iterable
 */

import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * @param {unknown} _subset
 * @param {unknown} _superset
 * @param {unknown} cmp
 * @param {unknown} contains
 * @param {unknown} ordered
 * @returns {boolean}
 */
function isSubsetOf(_subset, _superset, cmp, contains, ordered) {
  let superset = Array.from(_superset);
  let subset = Array.from(_subset);
  if (!contains) {
    if (subset.length !== superset.length) return false;
    superset = superset.slice();
  }

  return subset.every(function (elem, idx) {
    if (ordered) return cmp ? cmp(elem, superset[idx]) : elem === superset[idx];

    if (!cmp) {
      let matchIdx = superset.indexOf(elem);
      if (matchIdx === -1) return false;

      if (!contains) superset.splice(matchIdx, 1);
      return true;
    }

    return superset.some(function (elem2, matchIdx) {
      if (!cmp(elem, elem2)) return false;

      if (!contains) superset.splice(matchIdx, 1);
      return true;
    });
  });
}

/**
 * ### .members(set[, msg])
 *
 * Asserts that the target array has the same members as the given array
 * `set`.
 *
 *     expect([1, 2, 3]).to.have.members([2, 1, 3]);
 *     expect([1, 2, 2]).to.have.members([2, 1, 2]);
 *
 * By default, members are compared using strict (`===`) equality. Add `.deep`
 * earlier in the chain to use deep equality instead. See the `deep-eql`
 * project page for info on the deep equality algorithm:
 * https://github.com/chaijs/deep-eql.
 *
 *     // Target array deeply (but not strictly) has member `{a: 1}`
 *     expect([{a: 1}]).to.have.deep.members([{a: 1}]);
 *     expect([{a: 1}]).to.not.have.members([{a: 1}]);
 *
 * By default, order doesn't matter. Add `.ordered` earlier in the chain to
 * require that members appear in the same order.
 *
 *     expect([1, 2, 3]).to.have.ordered.members([1, 2, 3]);
 *     expect([1, 2, 3]).to.have.members([2, 1, 3])
 *       .but.not.ordered.members([2, 1, 3]);
 *
 * By default, both arrays must be the same size. Add `.include` earlier in
 * the chain to require that the target's members be a superset of the
 * expected members. Note that duplicates are ignored in the subset when
 * `.include` is added.
 *
 *     // Target array is a superset of [1, 2] but not identical
 *     expect([1, 2, 3]).to.include.members([1, 2]);
 *     expect([1, 2, 3]).to.not.have.members([1, 2]);
 *
 *     // Duplicates in the subset are ignored
 *     expect([1, 2, 3]).to.include.members([1, 2, 2, 2]);
 *
 * `.deep`, `.ordered`, and `.include` can all be combined. However, if
 * `.include` and `.ordered` are combined, the ordering begins at the start of
 * both arrays.
 *
 *     expect([{a: 1}, {b: 2}, {c: 3}])
 *       .to.include.deep.ordered.members([{a: 1}, {b: 2}])
 *       .but.not.include.deep.ordered.members([{b: 2}, {c: 3}]);
 *
 * Add `.not` earlier in the chain to negate `.members`. However, it's
 * dangerous to do so. The problem is that it creates uncertain expectations
 * by asserting that the target array doesn't have all of the same members as
 * the given array `set` but may or may not have some of them. It's often best
 * to identify the exact output that's expected, and then write an assertion
 * that only accepts that exact output.
 *
 *     expect([1, 2]).to.not.include(3).and.not.include(4); // Recommended
 *     expect([1, 2]).to.not.have.members([3, 4]); // Not recommended
 *
 * `.members` accepts an optional `msg` argument which is a custom error
 * message to show when the assertion fails. The message can also be given as
 * the second argument to `expect`.
 *
 *     expect([1, 2]).to.have.members([1, 2, 3], 'nooo why fail??');
 *     expect([1, 2], 'nooo why fail??').to.have.members([1, 2, 3]);
 *
 * @name members
 * @param {Array} set
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
Assertion.addMethod('members', function (subset, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    flagMsg = flag(this, 'message'),
    ssfi = flag(this, 'ssfi');

  new Assertion(obj, flagMsg, ssfi, true).to.be.iterable;
  new Assertion(subset, flagMsg, ssfi, true).to.be.iterable;

  let contains = flag(this, 'contains');
  let ordered = flag(this, 'ordered');

  let subject, failMsg, failNegateMsg;

  if (contains) {
    subject = ordered ? 'an ordered superset' : 'a superset';
    failMsg = 'expected #{this} to be ' + subject + ' of #{exp}';
    failNegateMsg = 'expected #{this} to not be ' + subject + ' of #{exp}';
  } else {
    subject = ordered ? 'ordered members' : 'members';
    failMsg = 'expected #{this} to have the same ' + subject + ' as #{exp}';
    failNegateMsg =
      'expected #{this} to not have the same ' + subject + ' as #{exp}';
  }

  let cmp = flag(this, 'deep') ? flag(this, 'eql') : undefined;

  this.assert(
    isSubsetOf(subset, obj, cmp, contains, ordered),
    failMsg,
    failNegateMsg,
    subset,
    obj,
    true
  );
});

/**
 * ### .iterable
 *
 * Asserts that the target is an iterable, which means that it has a iterator.
 *
 *     expect([1, 2]).to.be.iterable;
 *     expect("foobar").to.be.iterable;
 *
 * Add `.not` earlier in the chain to negate `.iterable`.
 *
 *     expect(1).to.not.be.iterable;
 *     expect(true).to.not.be.iterable;
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect(1, 'nooo why fail??').to.be.iterable;
 *
 * @name iterable
 * @namespace BDD
 * @public
 */
Assertion.addProperty('iterable', function (msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object');

  this.assert(
    obj != undefined && obj[Symbol.iterator],
    'expected #{this} to be an iterable',
    'expected #{this} to not be an iterable',
    obj
  );
});