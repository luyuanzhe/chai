/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

import {Assertion} from '../assertion.js';
import * as _ from '../utils/index.js';
import {flag} from '../utils/index.js';

function assertLengthChain() {
  flag(this, 'doLength', true);
}

function assertLength(n, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    objType = _.type(obj).toLowerCase(),
    flagMsg = flag(this, 'message'),
    ssfi = flag(this, 'ssfi'),
    descriptor = 'length',
    itemsCount;

  switch (objType) {
    case 'map':
    case 'set':
      descriptor = 'size';
      itemsCount = obj.size;
      break;
    default:
      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
      itemsCount = obj.length;
  }

  this.assert(
    itemsCount == n,
    'expected #{this} to have a ' + descriptor + ' of #{exp} but got #{act}',
    'expected #{this} to not have a ' + descriptor + ' of #{act}',
    n,
    itemsCount
  );
}

Assertion.addChainableMethod('length', assertLength, assertLengthChain);
Assertion.addChainableMethod('lengthOf', assertLength, assertLengthChain);
