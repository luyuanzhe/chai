/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Keys assertion
 */

import {Assertion} from '../../assertion.js';
import {AssertionError} from 'assertion-error';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .keys(key1[, key2[, ...]])
 *
 * Asserts that the target object, array, map, or set has the given keys. Only
 * the target's own inherited properties are included in the search.
 *
 * When the target is an object or array, keys can be provided as one or more
 * string arguments, a single array argument, or a single object argument. In
 * the latter case, only the keys in the given object matter; the values are
 * ignored.
 *
 *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
 *     expect(['x', 'y']).to.have.all.keys(0, 1);
 *
 *     expect({a: 1, b: 2}).to.have.all.keys(['a', 'b']);
 *     expect(['x', 'y']).to.have.all.keys([0, 1]);
 *
 *     expect({a: 1, b: 2}).to.have.all.keys({a: 4, b: 5}); // ignore 4 and 5
 *     expect(['x', 'y']).to.have.all.keys({0: 4, 1: 5}); // ignore 4 and 5
 *
 * When the target is a map or set, each key must be provided as a separate
 * argument.
 *
 *     expect(new Map([['a', 1], ['b', 2]])).to.have.all.keys('a', 'b');
 *     expect(new Set(['a', 'b'])).to.have.all.keys('a', 'b');
 *
 * Because `.keys` does different things based on the target's type, it's
 * important to check the target's type before using `.keys`. See the `.a` doc
 * for info on testing a target's type.
 *
 *     expect({a: 1, b: 2}).to.be.an('object').that.has.all.keys('a', 'b');
 *
 * By default, strict (`===`) equality is used to compare keys of maps and
 * sets. Add `.deep` earlier in the chain to use deep equality instead. See
 * the `deep-eql` project page for info on the deep equality algorithm:
 * https://github.com/chaijs/deep-eql.
 *
 *     // Target set deeply (but not strictly) has key `{a: 1}`
 *     expect(new Set([{a: 1}])).to.have.all.deep.keys([{a: 1}]);
 *     expect(new Set([{a: 1}])).to.not.have.all.keys([{a: 1}]);
 *
 * By default, the target must have all of the given keys and no more. Add
 * `.any` earlier in the chain to only require that the target have at least
 * one of the given keys. Also, add `.not` earlier in the chain to negate
 * `.keys`. It's often best to add `.any` when negating `.keys`, and to use
 * `.all` when asserting `.keys` without negation.
 *
 * When negating `.keys`, `.any` is preferred because `.not.any.keys` asserts
 * exactly what's expected of the output, whereas `.not.all.keys` creates
 * uncertain expectations.
 *
 *     // Recommended; asserts that target doesn't have any of the given keys
 *     expect({a: 1, b: 2}).to.not.have.any.keys('c', 'd');
 *
 *     // Not recommended; asserts that target doesn't have all of the given
 *     // keys but may or may not have some of them
 *     expect({a: 1, b: 2}).to.not.have.all.keys('c', 'd');
 *
 * When asserting `.keys` without negation, `.all` is preferred because
 * `.all.keys` asserts exactly what's expected of the output, whereas
 * `.any.keys` creates uncertain expectations.
 *
 *     // Recommended; asserts that target has all the given keys
 *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
 *
 *     // Not recommended; asserts that target has at least one of the given
 *     // keys but may or may not have more of them
 *     expect({a: 1, b: 2}).to.have.any.keys('a', 'b');
 *
 * Note that `.all` is used by default when neither `.all` nor `.any` appear
 * earlier in the chain. However, it's often best to add `.all` anyway because
 * it improves readability.
 *
 *     // Both assertions are identical
 *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b'); // Recommended
 *     expect({a: 1, b: 2}).to.have.keys('a', 'b'); // Not recommended
 *
 * Add `.include` earlier in the chain to require that the target's keys be a
 * superset of the expected keys, rather than identical sets.
 *
 *     // Target object's keys are a superset of ['a', 'b'] but not identical
 *     expect({a: 1, b: 2, c: 3}).to.include.all.keys('a', 'b');
 *     expect({a: 1, b: 2, c: 3}).to.not.have.all.keys('a', 'b');
 *
 * However, if `.any` and `.include` are combined, only the `.any` takes
 * effect. The `.include` is ignored in this case.
 *
 *     // Both assertions are identical
 *     expect({a: 1}).to.have.any.keys('a', 'b');
 *     expect({a: 1}).to.include.any.keys('a', 'b');
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect({a: 1}, 'nooo why fail??').to.have.key('b');
 *
 * The alias `.key` can be used interchangeably with `.keys`.
 *
 * @name keys
 * @alias key
 * @param {...string | Array | object} keys
 * @namespace BDD
 * @public
 */
function assertKeys(keys) {
  let obj = flag(this, 'object'),
    objType = _.type(obj),
    keysType = _.type(keys),
    ssfi = flag(this, 'ssfi'),
    isDeep = flag(this, 'deep'),
    str,
    deepStr = '',
    actual,
    ok = true,
    flagMsg = flag(this, 'message');

  flagMsg = flagMsg ? flagMsg + ': ' : '';
  let mixedArgsMsg =
    flagMsg +
    'when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments';

  if (objType === 'Map' || objType === 'Set') {
    deepStr = isDeep ? 'deeply ' : '';
    actual = [];

    obj.forEach(function (val, key) {
      actual.push(key);
    });

    if (keysType !== 'Array') {
      keys = Array.prototype.slice.call(arguments);
    }
  } else {
    actual = _.getOwnEnumerableProperties(obj);

    switch (keysType) {
      case 'Array':
        if (arguments.length > 1) {
          throw new AssertionError(mixedArgsMsg, undefined, ssfi);
        }
        break;
      case 'Object':
        if (arguments.length > 1) {
          throw new AssertionError(mixedArgsMsg, undefined, ssfi);
        }
        keys = Object.keys(keys);
        break;
      default:
        keys = Array.prototype.slice.call(arguments);
    }

    keys = keys.map(function (val) {
      return typeof val === 'symbol' ? val : String(val);
    });
  }

  if (!keys.length) {
    throw new AssertionError(flagMsg + 'keys required', undefined, ssfi);
  }

  let len = keys.length,
    any = flag(this, 'any'),
    all = flag(this, 'all'),
    expected = keys,
    isEql = isDeep ? flag(this, 'eql') : (val1, val2) => val1 === val2;

  if (!any && !all) {
    all = true;
  }

  const uniqueExpected = [...new Set(expected)];

  if (any) {
    ok = uniqueExpected.some(function (expectedKey) {
      return actual.some(function (actualKey) {
        return isEql(expectedKey, actualKey);
      });
    });
  }

  if (all) {
    ok = uniqueExpected.every(function (expectedKey) {
      return actual.some(function (actualKey) {
        return isEql(expectedKey, actualKey);
      });
    });

    if (!flag(this, 'contains')) {
      ok = ok && uniqueExpected.length == actual.length;
    }
  }

  if (len > 1) {
    keys = keys.map(function (key) {
      return _.inspect(key);
    });
    let last = keys.pop();
    if (all) {
      str = keys.join(', ') + ', and ' + last;
    }
    if (any) {
      str = keys.join(', ') + ', or ' + last;
    }
  } else {
    str = _.inspect(keys[0]);
  }

  str = (len > 1 ? 'keys ' : 'key ') + str;

  str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;

  this.assert(
    ok,
    'expected #{this} to ' + deepStr + str,
    'expected #{this} to not ' + deepStr + str,
    expected.slice(0).sort(_.compareByInspect),
    actual.sort(_.compareByInspect),
    true
  );
}

Assertion.addMethod('keys', assertKeys);
Assertion.addMethod('key', assertKeys);