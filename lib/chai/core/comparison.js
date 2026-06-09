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

function assertAbove(n, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    doLength = flag(this, 'doLength'),
    flagMsg = flag(this, 'message'),
    msgPrefix = flagMsg ? flagMsg + ': ' : '',
    ssfi = flag(this, 'ssfi'),
    objType = _.type(obj).toLowerCase(),
    nType = _.type(n).toLowerCase();

  if (doLength && objType !== 'map' && objType !== 'set') {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
  }

  if (!doLength && objType === 'date' && nType !== 'date') {
    throw new AssertionError(
      msgPrefix + 'the argument to above must be a date',
      undefined,
      ssfi
    );
  } else if (!_.isNumeric(n) && (doLength || _.isNumeric(obj))) {
    throw new AssertionError(
      msgPrefix + 'the argument to above must be a number',
      undefined,
      ssfi
    );
  } else if (!doLength && objType !== 'date' && !_.isNumeric(obj)) {
    let printObj = objType === 'string' ? "'" + obj + "'" : obj;
    throw new AssertionError(
      msgPrefix + 'expected ' + printObj + ' to be a number or a date',
      undefined,
      ssfi
    );
  }

  if (doLength) {
    let descriptor = 'length',
      itemsCount;
    if (objType === 'map' || objType === 'set') {
      descriptor = 'size';
      itemsCount = obj.size;
    } else {
      itemsCount = obj.length;
    }
    this.assert(
      itemsCount > n,
      'expected #{this} to have a ' +
        descriptor +
        ' above #{exp} but got #{act}',
      'expected #{this} to not have a ' + descriptor + ' above #{exp}',
      n,
      itemsCount
    );
  } else {
    this.assert(
      obj > n,
      'expected #{this} to be above #{exp}',
      'expected #{this} to be at most #{exp}',
      n
    );
  }
}

Assertion.addMethod('above', assertAbove);
Assertion.addMethod('gt', assertAbove);
Assertion.addMethod('greaterThan', assertAbove);

function assertLeast(n, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    doLength = flag(this, 'doLength'),
    flagMsg = flag(this, 'message'),
    msgPrefix = flagMsg ? flagMsg + ': ' : '',
    ssfi = flag(this, 'ssfi'),
    objType = _.type(obj).toLowerCase(),
    nType = _.type(n).toLowerCase(),
    errorMessage,
    shouldThrow = true;

  if (doLength && objType !== 'map' && objType !== 'set') {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
  }

  if (!doLength && objType === 'date' && nType !== 'date') {
    errorMessage = msgPrefix + 'the argument to least must be a date';
  } else if (!_.isNumeric(n) && (doLength || _.isNumeric(obj))) {
    errorMessage = msgPrefix + 'the argument to least must be a number';
  } else if (!doLength && objType !== 'date' && !_.isNumeric(obj)) {
    let printObj = objType === 'string' ? "'" + obj + "'" : obj;
    errorMessage =
      msgPrefix + 'expected ' + printObj + ' to be a number or a date';
  } else {
    shouldThrow = false;
  }

  if (shouldThrow) {
    throw new AssertionError(errorMessage, undefined, ssfi);
  }

  if (doLength) {
    let descriptor = 'length',
      itemsCount;
    if (objType === 'map' || objType === 'set') {
      descriptor = 'size';
      itemsCount = obj.size;
    } else {
      itemsCount = obj.length;
    }
    this.assert(
      itemsCount >= n,
      'expected #{this} to have a ' +
        descriptor +
        ' at least #{exp} but got #{act}',
      'expected #{this} to have a ' + descriptor + ' below #{exp}',
      n,
      itemsCount
    );
  } else {
    this.assert(
      obj >= n,
      'expected #{this} to be at least #{exp}',
      'expected #{this} to be below #{exp}',
      n
    );
  }
}

Assertion.addMethod('least', assertLeast);
Assertion.addMethod('gte', assertLeast);
Assertion.addMethod('greaterThanOrEqual', assertLeast);

function assertBelow(n, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    doLength = flag(this, 'doLength'),
    flagMsg = flag(this, 'message'),
    msgPrefix = flagMsg ? flagMsg + ': ' : '',
    ssfi = flag(this, 'ssfi'),
    objType = _.type(obj).toLowerCase(),
    nType = _.type(n).toLowerCase(),
    errorMessage,
    shouldThrow = true;

  if (doLength && objType !== 'map' && objType !== 'set') {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
  }

  if (!doLength && objType === 'date' && nType !== 'date') {
    errorMessage = msgPrefix + 'the argument to below must be a date';
  } else if (!_.isNumeric(n) && (doLength || _.isNumeric(obj))) {
    errorMessage = msgPrefix + 'the argument to below must be a number';
  } else if (!doLength && objType !== 'date' && !_.isNumeric(obj)) {
    let printObj = objType === 'string' ? "'" + obj + "'" : obj;
    errorMessage =
      msgPrefix + 'expected ' + printObj + ' to be a number or a date';
  } else {
    shouldThrow = false;
  }

  if (shouldThrow) {
    throw new AssertionError(errorMessage, undefined, ssfi);
  }

  if (doLength) {
    let descriptor = 'length',
      itemsCount;
    if (objType === 'map' || objType === 'set') {
      descriptor = 'size';
      itemsCount = obj.size;
    } else {
      itemsCount = obj.length;
    }
    this.assert(
      itemsCount < n,
      'expected #{this} to have a ' +
        descriptor +
        ' below #{exp} but got #{act}',
      'expected #{this} to not have a ' + descriptor + ' below #{exp}',
      n,
      itemsCount
    );
  } else {
    this.assert(
      obj < n,
      'expected #{this} to be below #{exp}',
      'expected #{this} to be at least #{exp}',
      n
    );
  }
}

Assertion.addMethod('below', assertBelow);
Assertion.addMethod('lt', assertBelow);
Assertion.addMethod('lessThan', assertBelow);

function assertMost(n, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    doLength = flag(this, 'doLength'),
    flagMsg = flag(this, 'message'),
    msgPrefix = flagMsg ? flagMsg + ': ' : '',
    ssfi = flag(this, 'ssfi'),
    objType = _.type(obj).toLowerCase(),
    nType = _.type(n).toLowerCase(),
    errorMessage,
    shouldThrow = true;

  if (doLength && objType !== 'map' && objType !== 'set') {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
  }

  if (!doLength && objType === 'date' && nType !== 'date') {
    errorMessage = msgPrefix + 'the argument to most must be a date';
  } else if (!_.isNumeric(n) && (doLength || _.isNumeric(obj))) {
    errorMessage = msgPrefix + 'the argument to most must be a number';
  } else if (!doLength && objType !== 'date' && !_.isNumeric(obj)) {
    let printObj = objType === 'string' ? "'" + obj + "'" : obj;
    errorMessage =
      msgPrefix + 'expected ' + printObj + ' to be a number or a date';
  } else {
    shouldThrow = false;
  }

  if (shouldThrow) {
    throw new AssertionError(errorMessage, undefined, ssfi);
  }

  if (doLength) {
    let descriptor = 'length',
      itemsCount;
    if (objType === 'map' || objType === 'set') {
      descriptor = 'size';
      itemsCount = obj.size;
    } else {
      itemsCount = obj.length;
    }
    this.assert(
      itemsCount <= n,
      'expected #{this} to have a ' +
        descriptor +
        ' at most #{exp} but got #{act}',
      'expected #{this} to have a ' + descriptor + ' above #{exp}',
      n,
      itemsCount
    );
  } else {
    this.assert(
      obj <= n,
      'expected #{this} to be at most #{exp}',
      'expected #{this} to be above #{exp}',
      n
    );
  }
}

Assertion.addMethod('most', assertMost);
Assertion.addMethod('lte', assertMost);
Assertion.addMethod('lessThanOrEqual', assertMost);

Assertion.addMethod('within', function (start, finish, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    doLength = flag(this, 'doLength'),
    flagMsg = flag(this, 'message'),
    msgPrefix = flagMsg ? flagMsg + ': ' : '',
    ssfi = flag(this, 'ssfi'),
    objType = _.type(obj).toLowerCase(),
    startType = _.type(start).toLowerCase(),
    finishType = _.type(finish).toLowerCase(),
    errorMessage,
    shouldThrow = true,
    range =
      startType === 'date' && finishType === 'date'
        ? start.toISOString() + '..' + finish.toISOString()
        : start + '..' + finish;

  if (doLength && objType !== 'map' && objType !== 'set') {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
  }

  if (
    !doLength &&
    objType === 'date' &&
    (startType !== 'date' || finishType !== 'date')
  ) {
    errorMessage = msgPrefix + 'the arguments to within must be dates';
  } else if (
    (!_.isNumeric(start) || !_.isNumeric(finish)) &&
    (doLength || _.isNumeric(obj))
  ) {
    errorMessage = msgPrefix + 'the arguments to within must be numbers';
  } else if (!doLength && objType !== 'date' && !_.isNumeric(obj)) {
    let printObj = objType === 'string' ? "'" + obj + "'" : obj;
    errorMessage =
      msgPrefix + 'expected ' + printObj + ' to be a number or a date';
  } else {
    shouldThrow = false;
  }

  if (shouldThrow) {
    throw new AssertionError(errorMessage, undefined, ssfi);
  }

  if (doLength) {
    let descriptor = 'length',
      itemsCount;
    if (objType === 'map' || objType === 'set') {
      descriptor = 'size';
      itemsCount = obj.size;
    } else {
      itemsCount = obj.length;
    }
    this.assert(
      itemsCount >= start && itemsCount <= finish,
      'expected #{this} to have a ' + descriptor + ' within ' + range,
      'expected #{this} to not have a ' + descriptor + ' within ' + range
    );
  } else {
    this.assert(
      obj >= start && obj <= finish,
      'expected #{this} to be within ' + range,
      'expected #{this} to not be within ' + range
    );
  }
});
