/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

import {Assertion} from '../assertion.js';
import {flag} from '../utils/index.js';

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
