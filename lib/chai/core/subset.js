/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

import {Assertion} from '../assertion.js';
import * as _ from '../utils/index.js';
import {flag} from '../utils/index.js';
import {config} from '../config.js';

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
