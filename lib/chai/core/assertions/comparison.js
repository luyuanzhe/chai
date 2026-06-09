/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Comparison assertions: above, least, below, most, within
 */

import {Assertion} from '../../assertion.js';
import {AssertionError} from 'assertion-error';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .above(n[, msg])
 *
 * Asserts that the target is a number or a date greater than the given number or date `n` respectively.
 * However, it's often best to assert that the target is equal to its expected
 * value.
 *
 *     expect(2).to.equal(2); // Recommended
 *     expect(2).to.be.above(1); // Not recommended
 *
 * Add `.lengthOf` earlier in the chain to assert that the target's `length`
 * or `size` is greater than the given number `n`.
 *
 *     expect('foo').to.have.lengthOf(3); // Recommended
 *     expect('foo').to.have.lengthOf.above(2); // Not recommended
 *
 *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
 *     expect([1, 2, 3]).to.have.lengthOf.above(2); // Not recommended
 *
 * Add `.not` earlier in the chain to negate `.above`.
 *
 *     expect(2).to.equal(2); // Recommended
 *     expect(1).to.not.be.above(2); // Not recommended
 *
 * `.above` accepts an optional `msg` argument which is a custom error message
 * to show when the assertion fails. The message can also be given as the
 * second argument to `expect`.
 *
 *     expect(1).to.be.above(2, 'nooo why fail??');
 *     expect(1, 'nooo why fail??').to.be.above(2);
 *
 * The aliases `.gt` and `.greaterThan` can be used interchangeably with
 * `.above`.
 *
 * @name above
 * @alias gt
 * @alias greaterThan
 * @param {number} n
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
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

/**
 * ### .least(n[, msg])
 *
 * Asserts that the target is a number or a date greater than or equal to the given
 * number or date `n` respectively. However, it's often best to assert that the target is equal to
 * its expected value.
 *
 *     expect(2).to.equal(2); // Recommended
 *     expect(2).to.be.at.least(1); // Not recommended
 *     expect(2).to.be.at.least(2); // Not recommended
 *
 * Add `.lengthOf` earlier in the chain to assert that the target's `length`
 * or `size` is greater than or equal to the given number `n`.
 *
 *     expect('foo').to.have.lengthOf(3); // Recommended
 *     expect('foo').to.have.lengthOf.at.least(2); // Not recommended
 *
 *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
 *     expect([1, 2, 3]).to.have.lengthOf.at.least(2); // Not recommended
 *
 * Add `.not` earlier in the chain to negate `.least`.
 *
 *     expect(1).to.equal(1); // Recommended
 *     expect(1).to.not.be.at.least(2); // Not recommended
 *
 * `.least` accepts an optional `msg` argument which is a custom error message
 * to show when the assertion fails. The message can also be given as the
 * second argument to `expect`.
 *
 *     expect(1).to.be.at.least(2, 'nooo why fail??');
 *     expect(1, 'nooo why fail??').to.be.at.least(2);
 *
 * The aliases `.gte` and `.greaterThanOrEqual` can be used interchangeably with
 * `.least`.
 *
 * @name least
 * @alias gte
 * @alias greaterThanOrEqual
 * @param {unknown} n
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
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

/**
 * ### .below(n[, msg])
 *
 * Asserts that the target is a number or a date less than the given number or date `n` respectively.
 * However, it's often best to assert that the target is equal to its expected
 * value.
 *
 *     expect(1).to.equal(1); // Recommended
 *     expect(1).to.be.below(2); // Not recommended
 *
 * Add `.lengthOf` earlier in the chain to assert that the target's `length`
 * or `size` is less than the given number `n`.
 *
 *     expect('foo').to.have.lengthOf(3); // Recommended
 *     expect('foo').to.have.lengthOf.below(4); // Not recommended
 *
 *     expect([1, 2, 3]).to.have.length(3); // Recommended
 *     expect([1, 2, 3]).to.have.lengthOf.below(4); // Not recommended
 *
 * Add `.not` earlier in the chain to negate `.below`.
 *
 *     expect(2).to.equal(2); // Recommended
 *     expect(2).to.not.be.below(1); // Not recommended
 *
 * `.below` accepts an optional `msg` argument which is a custom error message
 * to show when the assertion fails. The message can also be given as the
 * second argument to `expect`.
 *
 *     expect(2).to.be.below(1, 'nooo why fail??');
 *     expect(2, 'nooo why fail??').to.be.below(1);
 *
 * The aliases `.lt` and `.lessThan` can be used interchangeably with
 * `.below`.
 *
 * @name below
 * @alias lt
 * @alias lessThan
 * @param {unknown} n
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
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

/**
 * ### .most(n[, msg])
 *
 * Asserts that the target is a number or a date less than or equal to the given number
 * or date `n` respectively. However, it's often best to assert that the target is equal to its
 * expected value.
 *
 *     expect(1).to.equal(1); // Recommended
 *     expect(1).to.be.at.most(2); // Not recommended
 *     expect(1).to.be.at.most(1); // Not recommended
 *
 * Add `.lengthOf` earlier in the chain to assert that the target's `length`
 * or `size` is less than or equal to the given number `n`.
 *
 *     expect('foo').to.have.lengthOf(3); // Recommended
 *     expect('foo').to.have.lengthOf.at.most(4); // Not recommended
 *
 *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
 *     expect([1, 2, 3]).to.have.lengthOf.at.most(4); // Not recommended
 *
 * Add `.not` earlier in the chain to negate `.most`.
 *
 *     expect(2).to.equal(2); // Recommended
 *     expect(2).to.not.be.at.most(1); // Not recommended
 *
 * `.most` accepts an optional `msg` argument which is a custom error message
 * to show when the assertion fails. The message can also be given as the
 * second argument to `expect`.
 *
 *     expect(2).to.be.at.most(1, 'nooo why fail??');
 *     expect(2, 'nooo why fail??').to.be.at.most(1);
 *
 * The aliases `.lte` and `.lessThanOrEqual` can be used interchangeably with
 * `.most`.
 *
 * @name most
 * @alias lte
 * @alias lessThanOrEqual
 * @param {unknown} n
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
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

/**
 * ### .within(start, finish[, msg])
 *
 * Asserts that the target is a number or a date greater than or equal to the given
 * number or date `start`, and less than or equal to the given number or date `finish` respectively.
 * However, it's often best to assert that the target is equal to its expected
 * value.
 *
 *     expect(2).to.equal(2); // Recommended
 *     expect(2).to.be.within(1, 3); // Not recommended
 *     expect(2).to.be.within(2, 3); // Not recommended
 *     expect(2).to.be.within(1, 2); // Not recommended
 *
 * Add `.lengthOf` earlier in the chain to assert that the target's `length`
 * or `size` is greater than or equal to the given number `start`, and less
 * than or equal to the given number `finish`.
 *
 *     expect('foo').to.have.lengthOf(3); // Recommended
 *     expect('foo').to.have.lengthOf.within(2, 4); // Not recommended
 *
 *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
 *     expect([1, 2, 3]).to.have.lengthOf.within(2, 4); // Not recommended
 *
 * Add `.not` earlier in the chain to negate `.within`.
 *
 *     expect(1).to.equal(1); // Recommended
 *     expect(1).to.not.be.within(2, 4); // Not recommended
 *
 * `.within` accepts an optional `msg` argument which is a custom error
 * message to show when the assertion fails. The message can also be given as
 * the second argument to `expect`.
 *
 *     expect(4).to.be.within(1, 3, 'nooo why fail??');
 *     expect(4, 'nooo why fail??').to.be.within(1, 3);
 *
 * @name within
 * @param {unknown} start lower bound inclusive
 * @param {unknown} finish upper bound inclusive
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
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