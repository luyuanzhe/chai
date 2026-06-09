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

function satisfy(matcher, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object');
  let result = matcher(obj);
  this.assert(
    result,
    'expected #{this} to satisfy ' + _.objDisplay(matcher),
    'expected #{this} to not satisfy' + _.objDisplay(matcher),
    flag(this, 'negate') ? false : true,
    result
  );
}

Assertion.addMethod('satisfy', satisfy);
Assertion.addMethod('satisfies', satisfy);

function closeTo(expected, delta, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    flagMsg = flag(this, 'message'),
    ssfi = flag(this, 'ssfi');

  new Assertion(obj, flagMsg, ssfi, true).is.numeric;
  let message = 'A `delta` value is required for `closeTo`';
  if (delta == undefined) {
    throw new AssertionError(
      flagMsg ? `${flagMsg}: ${message}` : message,
      undefined,
      ssfi
    );
  }
  new Assertion(delta, flagMsg, ssfi, true).is.numeric;
  message = 'A `expected` value is required for `closeTo`';
  if (expected == undefined) {
    throw new AssertionError(
      flagMsg ? `${flagMsg}: ${message}` : message,
      undefined,
      ssfi
    );
  }
  new Assertion(expected, flagMsg, ssfi, true).is.numeric;

  const abs = (x) => (x < 0 ? -x : x);

  const strip = (number) => parseFloat(parseFloat(number).toPrecision(12));

  this.assert(
    strip(abs(obj - expected)) <= delta,
    'expected #{this} to be close to ' + expected + ' +/- ' + delta,
    'expected #{this} not to be close to ' + expected + ' +/- ' + delta
  );
}

Assertion.addMethod('closeTo', closeTo);
Assertion.addMethod('approximately', closeTo);
