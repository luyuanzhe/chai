/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

import {Assertion} from '../assertion.js';
import * as _ from '../utils/index.js';
import {flag} from '../utils/index.js';

function respondTo(method, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    itself = flag(this, 'itself'),
    context =
      'function' === typeof obj && !itself
        ? obj.prototype[method]
        : obj[method];

  this.assert(
    'function' === typeof context,
    'expected #{this} to respond to ' + _.inspect(method),
    'expected #{this} to not respond to ' + _.inspect(method)
  );
}

Assertion.addMethod('respondTo', respondTo);
Assertion.addMethod('respondsTo', respondTo);

Assertion.addProperty('itself', function () {
  flag(this, 'itself', true);
});
