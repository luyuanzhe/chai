import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';
import {config} from '../../config.js';

const {flag} = _;

Assertion.addProperty('extensible', function () {
  let obj = flag(this, 'object');
  let isExtensible = obj === Object(obj) && Object.isExtensible(obj);

  this.assert(
    isExtensible,
    'expected #{this} to be extensible',
    'expected #{this} to not be extensible'
  );
});

Assertion.addProperty('sealed', function () {
  let obj = flag(this, 'object');
  let isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;

  this.assert(
    isSealed,
    'expected #{this} to be sealed',
    'expected #{this} to not be sealed'
  );
});

Assertion.addProperty('frozen', function () {
  let obj = flag(this, 'object');
  let isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;

  this.assert(
    isFrozen,
    'expected #{this} to be frozen',
    'expected #{this} to not be frozen'
  );
});

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
  const actual = flag(this, 'object');
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
