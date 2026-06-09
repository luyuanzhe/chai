/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

import {Assertion} from '../assertion.js';
import {flag} from '../utils/index.js';

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

Assertion.addProperty('finite', function (_msg) {
  let obj = flag(this, 'object');

  this.assert(
    typeof obj === 'number' && isFinite(obj),
    'expected #{this} to be a finite number',
    'expected #{this} to not be a finite number'
  );
});
