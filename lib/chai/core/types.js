/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

import {Assertion} from '../assertion.js';
import * as _ from '../utils/index.js';
import {flag} from '../utils/index.js';

const functionTypes = {
  function: [
    'function',
    'asyncfunction',
    'generatorfunction',
    'asyncgeneratorfunction'
  ],
  asyncfunction: ['asyncfunction', 'asyncgeneratorfunction'],
  generatorfunction: ['generatorfunction', 'asyncgeneratorfunction'],
  asyncgeneratorfunction: ['asyncgeneratorfunction']
};

function an(type, msg) {
  if (msg) flag(this, 'message', msg);
  type = type.toLowerCase();
  let obj = flag(this, 'object'),
    article = ~['a', 'e', 'i', 'o', 'u'].indexOf(type.charAt(0)) ? 'an ' : 'a ';

  const detectedType = _.type(obj).toLowerCase();

  if (functionTypes['function'].includes(type)) {
    this.assert(
      functionTypes[type].includes(detectedType),
      'expected #{this} to be ' + article + type,
      'expected #{this} not to be ' + article + type
    );
  } else {
    this.assert(
      type === detectedType,
      'expected #{this} to be ' + article + type,
      'expected #{this} not to be ' + article + type
    );
  }
}

Assertion.addChainableMethod('an', an);
Assertion.addChainableMethod('a', an);

function checkArguments() {
  let obj = flag(this, 'object'),
    type = _.type(obj);
  this.assert(
    'Arguments' === type,
    'expected #{this} to be arguments but got ' + type,
    'expected #{this} to not be arguments'
  );
}

Assertion.addProperty('arguments', checkArguments);
Assertion.addProperty('Arguments', checkArguments);
