/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

import {Assertion} from '../assertion.js';
import {AssertionError} from 'assertion-error';
import * as _ from '../utils/index.js';
import {flag} from '../utils/index.js';

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
