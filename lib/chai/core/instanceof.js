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

function assertInstanceOf(constructor, msg) {
  if (msg) flag(this, 'message', msg);

  let target = flag(this, 'object');
  let ssfi = flag(this, 'ssfi');
  let flagMsg = flag(this, 'message');
  let isInstanceOf;

  try {
    isInstanceOf = target instanceof constructor;
  } catch (err) {
    if (err instanceof TypeError) {
      flagMsg = flagMsg ? flagMsg + ': ' : '';
      throw new AssertionError(
        flagMsg +
          'The instanceof assertion needs a constructor but ' +
          _.type(constructor) +
          ' was given.',
        undefined,
        ssfi
      );
    }
    throw err;
  }

  let name = _.getName(constructor);
  if (name == null) {
    name = 'an unnamed constructor';
  }

  this.assert(
    isInstanceOf,
    'expected #{this} to be an instance of ' + name,
    'expected #{this} to not be an instance of ' + name
  );
}

Assertion.addMethod('instanceof', assertInstanceOf);
Assertion.addMethod('instanceOf', assertInstanceOf);
