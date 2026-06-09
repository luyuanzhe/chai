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

function assertProperty(name, val, msg) {
  if (msg) flag(this, 'message', msg);

  let isNested = flag(this, 'nested'),
    isOwn = flag(this, 'own'),
    flagMsg = flag(this, 'message'),
    obj = flag(this, 'object'),
    ssfi = flag(this, 'ssfi'),
    nameType = typeof name;

  flagMsg = flagMsg ? flagMsg + ': ' : '';

  if (isNested) {
    if (nameType !== 'string') {
      throw new AssertionError(
        flagMsg +
          'the argument to property must be a string when using nested syntax',
        undefined,
        ssfi
      );
    }
  } else {
    if (
      nameType !== 'string' &&
      nameType !== 'number' &&
      nameType !== 'symbol'
    ) {
      throw new AssertionError(
        flagMsg +
          'the argument to property must be a string, number, or symbol',
        undefined,
        ssfi
      );
    }
  }

  if (isNested && isOwn) {
    throw new AssertionError(
      flagMsg + 'The "nested" and "own" flags cannot be combined.',
      undefined,
      ssfi
    );
  }

  if (obj === null || obj === undefined) {
    throw new AssertionError(
      flagMsg + 'Target cannot be null or undefined.',
      undefined,
      ssfi
    );
  }

  let isDeep = flag(this, 'deep'),
    negate = flag(this, 'negate'),
    pathInfo = isNested ? _.getPathInfo(obj, name) : null,
    value = isNested ? pathInfo.value : obj[name],
    isEql = isDeep ? flag(this, 'eql') : (val1, val2) => val1 === val2;

  let descriptor = '';
  if (isDeep) descriptor += 'deep ';
  if (isOwn) descriptor += 'own ';
  if (isNested) descriptor += 'nested ';
  descriptor += 'property ';

  let hasProperty;
  if (isOwn) hasProperty = Object.prototype.hasOwnProperty.call(obj, name);
  else if (isNested) hasProperty = pathInfo.exists;
  else hasProperty = _.hasProperty(obj, name);

  if (!negate || arguments.length === 1) {
    this.assert(
      hasProperty,
      'expected #{this} to have ' + descriptor + _.inspect(name),
      'expected #{this} to not have ' + descriptor + _.inspect(name)
    );
  }

  if (arguments.length > 1) {
    this.assert(
      hasProperty && isEql(val, value),
      'expected #{this} to have ' +
        descriptor +
        _.inspect(name) +
        ' of #{exp}, but got #{act}',
      'expected #{this} to not have ' +
        descriptor +
        _.inspect(name) +
        ' of #{act}',
      val,
      value
    );
  }

  flag(this, 'object', value);
}

Assertion.addMethod('property', assertProperty);

function assertOwnProperty(_name, _value, _msg) {
  flag(this, 'own', true);
  assertProperty.apply(this, arguments);
}

Assertion.addMethod('ownProperty', assertOwnProperty);
Assertion.addMethod('haveOwnProperty', assertOwnProperty);

function assertOwnPropertyDescriptor(name, descriptor, msg) {
  if (typeof descriptor === 'string') {
    msg = descriptor;
    descriptor = null;
  }
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object');
  let actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
  let eql = flag(this, 'eql');
  if (actualDescriptor && descriptor) {
    this.assert(
      eql(descriptor, actualDescriptor),
      'expected the own property descriptor for ' +
        _.inspect(name) +
        ' on #{this} to match ' +
        _.inspect(descriptor) +
        ', got ' +
        _.inspect(actualDescriptor),
      'expected the own property descriptor for ' +
        _.inspect(name) +
        ' on #{this} to not match ' +
        _.inspect(descriptor),
      descriptor,
      actualDescriptor,
      true
    );
  } else {
    this.assert(
      actualDescriptor,
      'expected #{this} to have an own property descriptor for ' +
        _.inspect(name),
      'expected #{this} to not have an own property descriptor for ' +
        _.inspect(name)
    );
  }
  flag(this, 'object', actualDescriptor);
}

Assertion.addMethod('ownPropertyDescriptor', assertOwnPropertyDescriptor);
Assertion.addMethod('haveOwnPropertyDescriptor', assertOwnPropertyDescriptor);
