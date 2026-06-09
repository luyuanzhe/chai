/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Include / contain assertions
 */

import {Assertion} from '../../assertion.js';
import {AssertionError} from 'assertion-error';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
function SameValueZero(a, b) {
  return (_.isNaN(a) && _.isNaN(b)) || a === b;
}

/** */
function includeChainingBehavior() {
  flag(this, 'contains', true);
}

/**
 * ### .include(val[, msg])
 *
 * When the target is a string, `.include` asserts that the given string `val`
 * is a substring of the target.
 *
 *     expect('foobar').to.include('foo');
 *
 * When the target is an array, `.include` asserts that the given `val` is a
 * member of the target.
 *
 *     expect([1, 2, 3]).to.include(2);
 *
 * When the target is an object, `.include` asserts that the given object
 * `val`'s properties are a subset of the target's properties.
 *
 *     expect({a: 1, b: 2, c: 3}).to.include({a: 1, b: 2});
 *
 * When the target is a Set or WeakSet, `.include` asserts that the given `val` is a
 * member of the target. SameValueZero equality algorithm is used.
 *
 *     expect(new Set([1, 2])).to.include(2);
 *
 * When the target is a Map, `.include` asserts that the given `val` is one of
 * the values of the target. SameValueZero equality algorithm is used.
 *
 *     expect(new Map([['a', 1], ['b', 2]])).to.include(2);
 *
 * Because `.include` does different things based on the target's type, it's
 * important to check the target's type before using `.include`. See the `.a`
 * doc for info on testing a target's type.
 *
 *     expect([1, 2, 3]).to.be.an('array').that.includes(2);
 *
 * By default, strict (`===`) equality is used to compare array members and
 * object properties. Add `.deep` earlier in the chain to use deep equality
 * instead (WeakSet targets are not supported). See the `deep-eql` project
 * page for info on the deep equality algorithm: https://github.com/chaijs/deep-eql.
 *
 *     // Target array deeply (but not strictly) includes `{a: 1}`
 *     expect([{a: 1}]).to.deep.include({a: 1});
 *     expect([{a: 1}]).to.not.include({a: 1});
 *
 *     // Target object deeply (but not strictly) includes `x: {a: 1}`
 *     expect({x: {a: 1}}).to.deep.include({x: {a: 1}});
 *     expect({x: {a: 1}}).to.not.include({x: {a: 1}});
 *
 * By default, all of the target's properties are searched when working with
 * objects. This includes properties that are inherited and/or non-enumerable.
 * Add `.own` earlier in the chain to exclude the target's inherited
 * properties from the search.
 *
 *     Object.prototype.b = 2;
 *
 *     expect({a: 1}).to.own.include({a: 1});
 *     expect({a: 1}).to.include({b: 2}).but.not.own.include({b: 2});
 *
 * Note that a target object is always only searched for `val`'s own
 * enumerable properties.
 *
 * `.deep` and `.own` can be combined.
 *
 *     expect({a: {b: 2}}).to.deep.own.include({a: {b: 2}});
 *
 * Add `.nested` earlier in the chain to enable dot- and bracket-notation when
 * referencing nested properties.
 *
 *     expect({a: {b: ['x', 'y']}}).to.nested.include({'a.b[1]': 'y'});
 *
 * If `.` or `[]` are part of an actual property name, they can be escaped by
 * adding two backslashes before them.
 *
 *     expect({'.a': {'[b]': 2}}).to.nested.include({'\\.a.\\[b\\]': 2});
 *
 * `.deep` and `.nested` can be combined.
 *
 *     expect({a: {b: [{c: 3}]}}).to.deep.nested.include({'a.b[0]': {c: 3}});
 *
 * `.own` and `.nested` cannot be combined.
 *
 * Add `.not` earlier in the chain to negate `.include`.
 *
 *     expect('foobar').to.not.include('taco');
 *     expect([1, 2, 3]).to.not.include(4);
 *
 * However, it's dangerous to negate `.include` when the target is an object.
 * The problem is that it creates uncertain expectations by asserting that the
 * target object doesn't have all of `val`'s key/value pairs but may or may
 * not have some of them. It's often best to identify the exact output that's
 * expected, and then write an assertion that only accepts that exact output.
 *
 * When the target object isn't even expected to have `val`'s keys, it's
 * often best to assert exactly that.
 *
 *     expect({c: 3}).to.not.have.any.keys('a', 'b'); // Recommended
 *     expect({c: 3}).to.not.include({a: 1, b: 2}); // Not recommended
 *
 * When the target object is expected to have `val`'s keys, it's often best to
 * assert that each of the properties has its expected value, rather than
 * asserting that each property doesn't have one of many unexpected values.
 *
 *     expect({a: 3, b: 4}).to.include({a: 3, b: 4}); // Recommended
 *     expect({a: 3, b: 4}).to.not.include({a: 1, b: 2}); // Not recommended
 *
 * `.include` accepts an optional `msg` argument which is a custom error
 * message to show when the assertion fails. The message can also be given as
 * the second argument to `expect`.
 *
 *     expect([1, 2, 3]).to.include(4, 'nooo why fail??');
 *     expect([1, 2, 3], 'nooo why fail??').to.include(4);
 *
 * `.include` can also be used as a language chain, causing all `.members` and
 * `.keys` assertions that follow in the chain to require the target to be a
 * superset of the expected set, rather than an identical set. Note that
 * `.members` ignores duplicates in the subset when `.include` is added.
 *
 *     // Target object's keys are a superset of ['a', 'b'] but not identical
 *     expect({a: 1, b: 2, c: 3}).to.include.all.keys('a', 'b');
 *     expect({a: 1, b: 2, c: 3}).to.not.have.all.keys('a', 'b');
 *
 *     // Target array is a superset of [1, 2] but not identical
 *     expect([1, 2, 3]).to.include.members([1, 2]);
 *     expect([1, 2, 3]).to.not.have.members([1, 2]);
 *
 *     // Duplicates in the subset are ignored
 *     expect([1, 2, 3]).to.include.members([1, 2, 2, 2]);
 *
 * Note that adding `.any` earlier in the chain causes the `.keys` assertion
 * to ignore `.include`.
 *
 *     // Both assertions are identical
 *     expect({a: 1}).to.include.any.keys('a', 'b');
 *     expect({a: 1}).to.have.any.keys('a', 'b');
 *
 * The aliases `.includes`, `.contain`, and `.contains` can be used
 * interchangeably with `.include`.
 *
 * @name include
 * @alias contain
 * @alias includes
 * @alias contains
 * @param {unknown} val
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
function include(val, msg) {
  if (msg) flag(this, 'message', msg);

  let obj = flag(this, 'object'),
    objType = _.type(obj).toLowerCase(),
    flagMsg = flag(this, 'message'),
    negate = flag(this, 'negate'),
    ssfi = flag(this, 'ssfi'),
    isDeep = flag(this, 'deep'),
    descriptor = isDeep ? 'deep ' : '',
    isEql = isDeep ? flag(this, 'eql') : SameValueZero;

  flagMsg = flagMsg ? flagMsg + ': ' : '';

  let included = false;

  switch (objType) {
    case 'string':
      included = obj.indexOf(val) !== -1;
      break;

    case 'weakset':
      if (isDeep) {
        throw new AssertionError(
          flagMsg + 'unable to use .deep.include with WeakSet',
          undefined,
          ssfi
        );
      }

      included = obj.has(val);
      break;

    case 'map':
      obj.forEach(function (item) {
        included = included || isEql(item, val);
      });
      break;

    case 'set':
      if (isDeep) {
        obj.forEach(function (item) {
          included = included || isEql(item, val);
        });
      } else {
        included = obj.has(val);
      }
      break;

    case 'array':
      if (isDeep) {
        included = obj.some(function (item) {
          return isEql(item, val);
        });
      } else {
        included = obj.indexOf(val) !== -1;
      }
      break;

    default: {
      if (val !== Object(val)) {
        throw new AssertionError(
          flagMsg +
            'the given combination of arguments (' +
            objType +
            ' and ' +
            _.type(val).toLowerCase() +
            ')' +
            ' is invalid for this assertion. ' +
            'You can use an array, a map, an object, a set, a string, ' +
            'or a weakset instead of a ' +
            _.type(val).toLowerCase(),
          undefined,
          ssfi
        );
      }

      let props = Object.keys(val);
      let firstErr = null;
      let numErrs = 0;

      props.forEach(function (prop) {
        let propAssertion = new Assertion(obj);
        _.transferFlags(this, propAssertion, true);
        flag(propAssertion, 'lockSsfi', true);

        if (!negate || props.length === 1) {
          propAssertion.property(prop, val[prop]);
          return;
        }

        try {
          propAssertion.property(prop, val[prop]);
        } catch (err) {
          if (!_.checkError.compatibleConstructor(err, AssertionError)) {
            throw err;
          }
          if (firstErr === null) firstErr = err;
          numErrs++;
        }
      }, this);

      if (negate && props.length > 1 && numErrs === props.length) {
        throw firstErr;
      }
      return;
    }
  }

  this.assert(
    included,
    'expected #{this} to ' + descriptor + 'include ' + _.inspect(val),
    'expected #{this} to not ' + descriptor + 'include ' + _.inspect(val)
  );
}

Assertion.addChainableMethod('include', include, includeChainingBehavior);
Assertion.addChainableMethod('contain', include, includeChainingBehavior);
Assertion.addChainableMethod('contains', include, includeChainingBehavior);
Assertion.addChainableMethod('includes', include, includeChainingBehavior);