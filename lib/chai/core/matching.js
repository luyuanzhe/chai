/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

import {Assertion} from '../assertion.js';
import * as _ from '../utils/index.js';
import {flag} from '../utils/index.js';

function assertMatch(re, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object');
  this.assert(
    re.exec(obj),
    'expected #{this} to match ' + re,
    'expected #{this} not to match ' + re
  );
}

Assertion.addMethod('match', assertMatch);
Assertion.addMethod('matches', assertMatch);

Assertion.addMethod('string', function (str, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    flagMsg = flag(this, 'message'),
    ssfi = flag(this, 'ssfi');
  new Assertion(obj, flagMsg, ssfi, true).is.a('string');

  this.assert(
    ~obj.indexOf(str),
    'expected #{this} to contain ' + _.inspect(str),
    'expected #{this} to not contain ' + _.inspect(str)
  );
});
