/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Change, increase, decrease, by assertions
 */

import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .change(subject[, prop[, msg]])
 *
 * When one argument is provided, `.change` asserts that the given function
 * `subject` returns a different value when it's invoked before the target
 * function compared to when it's invoked afterward. However, it's often best
 * to assert that `subject` is equal to its expected value.
 *
 *     var dots = ''
 *     , addDot = function () { dots += '.'; }
 *     , getDots = function () { return dots; };
 *
 *     // Recommended
 *     expect(getDots()).to.equal('');
 *     addDot();
 *     expect(getDots()).to.equal('.');
 *
 *     // Not recommended
 *     expect(addDot).to.change(getDots);
 *
 * When two arguments are provided, `.change` asserts that the value of the
 * given object `subject`'s `prop` property is different before invoking the
 * target function compared to afterward.
 *
 *     var myObj = {dots: ''}
 *     , addDot = function () { myObj.dots += '.'; };
 *
 *     // Recommended
 *     expect(myObj).to.have.property('dots', '');
 *     addDot();
 *     expect(myObj).to.have.property('dots', '.');
 *
 *     // Not recommended
 *     expect(addDot).to.change(myObj, 'dots');
 *
 * Strict (`===`) equality is used to compare before and after values.
 *
 * Add `.not` earlier in the chain to negate `.change`.
 *
 *     var dots = ''
 *     , noop = function () {}
 *     , getDots = function () { return dots; };
 *
 *     expect(noop).to.not.change(getDots);
 *
 *     var myObj = {dots: ''}
 *     , noop = function () {};
 *
 *     expect(noop).to.not.change(myObj, 'dots');
 *
 * `.change` accepts an optional `msg` argument which is a custom error
 * message to show when the assertion fails. The message can also be given as
 * the second argument to `expect`. When not providing two arguments, always
 * use the second form.
 *
 *     var myObj = {dots: ''}
 *     , addDot = function () { myObj.dots += '.'; };
 *
 *     expect(addDot).to.not.change(myObj, 'dots', 'nooo why fail??');
 *
 *     var dots = ''
 *     , addDot = function () { dots += '.'; }
 *     , getDots = function () { return dots; };
 *
 *     expect(addDot, 'nooo why fail??').to.not.change(getDots);
 *
 * `.change` also causes all `.by` assertions that follow in the chain to
 * assert how much a numeric subject was increased or decreased by. However,
 * it's dangerous to use `.change.by`. The problem is that it creates
 * uncertain expectations by asserting that the subject either increases by
 * the given delta, or that it decreases by the given delta. It's often best
 * to identify the exact output that's expected, and then write an assertion
 * that only accepts that exact output.
 *
 *     var myObj = {val: 1}
 *     , addTwo = function () { myObj.val += 2; }
 *     , subtractTwo = function () { myObj.val -= 2; };
 *
 *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
 *     expect(addTwo).to.change(myObj, 'val').by(2); // Not recommended
 *
 *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
 *     expect(subtractTwo).to.change(myObj, 'val').by(2); // Not recommended
 *
 * The alias `.changes` can be used interchangeably with `.change`.
 *
 * @name change
 * @alias changes
 * @param {string} subject
 * @param {string} prop name _optional_
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
function assertChanges(subject, prop, msg) {
  if (msg) flag(this, 'message', msg);
  let fn = flag(this, 'object'),
    flagMsg = flag(this, 'message'),
    ssfi = flag(this, 'ssfi');
  new Assertion(fn, flagMsg, ssfi, true).is.a('function');

  let initial;
  if (!prop) {
    new Assertion(subject, flagMsg, ssfi, true).is.a('function');
    initial = subject();
  } else {
    new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
    initial = subject[prop];
  }

  fn();

  let final = prop === undefined || prop === null ? subject() : subject[prop];
  let msgObj = prop === undefined || prop === null ? initial : '.' + prop;

  flag(this, 'deltaMsgObj', msgObj);
  flag(this, 'initialDeltaValue', initial);
  flag(this, 'finalDeltaValue', final);
  flag(this, 'deltaBehavior', 'change');
  flag(this, 'realDelta', final !== initial);

  this.assert(
    initial !== final,
    'expected ' + msgObj + ' to change',
    'expected ' + msgObj + ' to not change'
  );
}

Assertion.addMethod('change', assertChanges);
Assertion.addMethod('changes', assertChanges);

/**
 * ### .increase(subject[, prop[, msg]])
 *
 * When one argument is provided, `.increase` asserts that the given function
 * `subject` returns a greater number when it's invoked after invoking the
 * target function compared to when it's invoked beforehand. `.increase` also
 * causes all `.by` assertions that follow in the chain to assert how much
 * greater of a number is returned. It's often best to assert that the return
 * value increased by the expected amount, rather than asserting it increased
 * by any amount.
 *
 *     var val = 1
 *     , addTwo = function () { val += 2; }
 *     , getVal = function () { return val; };
 *
 *     expect(addTwo).to.increase(getVal).by(2); // Recommended
 *     expect(addTwo).to.increase(getVal); // Not recommended
 *
 * When two arguments are provided, `.increase` asserts that the value of the
 * given object `subject`'s `prop` property is greater after invoking the
 * target function compared to beforehand.
 *
 *     var myObj = {val: 1}
 *     , addTwo = function () { myObj.val += 2; };
 *
 *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
 *     expect(addTwo).to.increase(myObj, 'val'); // Not recommended
 *
 * Add `.not` earlier in the chain to negate `.increase`. However, it's
 * dangerous to do so. The problem is that it creates uncertain expectations
 * by asserting that the subject either decreases, or that it stays the same.
 * It's often best to identify the exact output that's expected, and then
 * write an assertion that only accepts that exact output.
 *
 * When the subject is expected to decrease, it's often best to assert that it
 * decreased by the expected amount.
 *
 *     var myObj = {val: 1}
 *     , subtractTwo = function () { myObj.val -= 2; };
 *
 *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
 *     expect(subtractTwo).to.not.increase(myObj, 'val'); // Not recommended
 *
 * When the subject is expected to stay the same, it's often best to assert
 * exactly that.
 *
 *     var myObj = {val: 1}
 *     , noop = function () {};
 *
 *     expect(noop).to.not.change(myObj, 'val'); // Recommended
 *     expect(noop).to.not.increase(myObj, 'val'); // Not recommended
 *
 * `.increase` accepts an optional `msg` argument which is a custom error
 * message to show when the assertion fails. The message can also be given as
 * the second argument to `expect`. When not providing two arguments, always
 * use the second form.
 *
 *     var myObj = {val: 1}
 *     , noop = function () {};
 *
 *     expect(noop).to.increase(myObj, 'val', 'nooo why fail??');
 *
 *     var val = 1
 *     , noop = function () {}
 *     , getVal = function () { return val; };
 *
 *     expect(noop, 'nooo why fail??').to.increase(getVal);
 *
 * The alias `.increases` can be used interchangeably with `.increase`.
 *
 * @name increase
 * @alias increases
 * @param {string | Function} subject
 * @param {string} prop name _optional_
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
function assertIncreases(subject, prop, msg) {
  if (msg) flag(this, 'message', msg);
  let fn = flag(this, 'object'),
    flagMsg = flag(this, 'message'),
    ssfi = flag(this, 'ssfi');
  new Assertion(fn, flagMsg, ssfi, true).is.a('function');

  let initial;
  if (!prop) {
    new Assertion(subject, flagMsg, ssfi, true).is.a('function');
    initial = subject();
  } else {
    new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
    initial = subject[prop];
  }

  new Assertion(initial, flagMsg, ssfi, true).is.a('number');

  fn();

  let final = prop === undefined || prop === null ? subject() : subject[prop];
  let msgObj = prop === undefined || prop === null ? initial : '.' + prop;

  flag(this, 'deltaMsgObj', msgObj);
  flag(this, 'initialDeltaValue', initial);
  flag(this, 'finalDeltaValue', final);
  flag(this, 'deltaBehavior', 'increase');
  flag(this, 'realDelta', final - initial);

  this.assert(
    final - initial > 0,
    'expected ' + msgObj + ' to increase',
    'expected ' + msgObj + ' to not increase'
  );
}

Assertion.addMethod('increase', assertIncreases);
Assertion.addMethod('increases', assertIncreases);

/**
 * ### .decrease(subject[, prop[, msg]])
 *
 * When one argument is provided, `.decrease` asserts that the given function
 * `subject` returns a lesser number when it's invoked after invoking the
 * target function compared to when it's invoked beforehand. `.decrease` also
 * causes all `.by` assertions that follow in the chain to assert how much
 * lesser of a number is returned. It's often best to assert that the return
 * value decreased by the expected amount, rather than asserting it decreased
 * by any amount.
 *
 *     var val = 1
 *       , subtractTwo = function () { val -= 2; }
 *       , getVal = function () { return val; };
 *
 *     expect(subtractTwo).to.decrease(getVal).by(2); // Recommended
 *     expect(subtractTwo).to.decrease(getVal); // Not recommended
 *
 * When two arguments are provided, `.decrease` asserts that the value of the
 * given object `subject`'s `prop` property is lesser after invoking the
 * target function compared to beforehand.
 *
 *     var myObj = {val: 1}
 *       , subtractTwo = function () { myObj.val -= 2; };
 *
 *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
 *     expect(subtractTwo).to.decrease(myObj, 'val'); // Not recommended
 *
 * Add `.not` earlier in the chain to negate `.decrease`. However, it's
 * dangerous to do so. The problem is that it creates uncertain expectations
 * by asserting that the subject either increases, or that it stays the same.
 * It's often best to identify the exact output that's expected, and then
 * write an assertion that only accepts that exact output.
 *
 * When the subject is expected to increase, it's often best to assert that it
 * increased by the expected amount.
 *
 *     var myObj = {val: 1}
 *       , addTwo = function () { myObj.val += 2; };
 *
 *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
 *     expect(addTwo).to.not.decrease(myObj, 'val'); // Not recommended
 *
 * When the subject is expected to stay the same, it's often best to assert
 * exactly that.
 *
 *     var myObj = {val: 1}
 *       , noop = function () {};
 *
 *     expect(noop).to.not.change(myObj, 'val'); // Recommended
 *     expect(noop).to.not.decrease(myObj, 'val'); // Not recommended
 *
 * `.decrease` accepts an optional `msg` argument which is a custom error
 * message to show when the assertion fails. The message can also be given as
 * the second argument to `expect`. When not providing two arguments, always
 * use the second form.
 *
 *     var myObj = {val: 1}
 *       , noop = function () {};
 *
 *     expect(noop).to.decrease(myObj, 'val', 'nooo why fail??');
 *
 *     var val = 1
 *       , noop = function () {}
 *       , getVal = function () { return val; };
 *
 *     expect(noop, 'nooo why fail??').to.decrease(getVal);
 *
 * The alias `.decreases` can be used interchangeably with `.decrease`.
 *
 * @name decrease
 * @alias decreases
 * @param {string | Function} subject
 * @param {string} prop name _optional_
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
function assertDecreases(subject, prop, msg) {
  if (msg) flag(this, 'message', msg);
  let fn = flag(this, 'object'),
    flagMsg = flag(this, 'message'),
    ssfi = flag(this, 'ssfi');
  new Assertion(fn, flagMsg, ssfi, true).is.a('function');

  let initial;
  if (!prop) {
    new Assertion(subject, flagMsg, ssfi, true).is.a('function');
    initial = subject();
  } else {
    new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
    initial = subject[prop];
  }

  new Assertion(initial, flagMsg, ssfi, true).is.a('number');

  fn();

  let final = prop === undefined || prop === null ? subject() : subject[prop];
  let msgObj = prop === undefined || prop === null ? initial : '.' + prop;

  flag(this, 'deltaMsgObj', msgObj);
  flag(this, 'initialDeltaValue', initial);
  flag(this, 'finalDeltaValue', final);
  flag(this, 'deltaBehavior', 'decrease');
  flag(this, 'realDelta', initial - final);

  this.assert(
    final - initial < 0,
    'expected ' + msgObj + ' to decrease',
    'expected ' + msgObj + ' to not decrease'
  );
}

Assertion.addMethod('decrease', assertDecreases);
Assertion.addMethod('decreases', assertDecreases);

/**
 * ### .by(delta[, msg])
 *
 * When following an `.increase` assertion in the chain, `.by` asserts that
 * the subject of the `.increase` assertion increased by the given `delta`.
 *
 *     var myObj = {val: 1}
 *       , addTwo = function () { myObj.val += 2; };
 *
 *     expect(addTwo).to.increase(myObj, 'val').by(2);
 *
 * When following a `.decrease` assertion in the chain, `.by` asserts that the
 * subject of the `.decrease` assertion decreased by the given `delta`.
 *
 *     var myObj = {val: 1}
 *       , subtractTwo = function () { myObj.val -= 2; };
 *
 *     expect(subtractTwo).to.decrease(myObj, 'val').by(2);
 *
 * When following a `.change` assertion in the chain, `.by` asserts that the
 * subject of the `.change` assertion either increased or decreased by the
 * given `delta`. However, it's dangerous to use `.change.by`. The problem is
 * that it creates uncertain expectations. It's often best to identify the
 * exact output that's expected, and then write an assertion that only accepts
 * that exact output.
 *
 *     var myObj = {val: 1}
 *       , addTwo = function () { myObj.val += 2; }
 *       , subtractTwo = function () { myObj.val -= 2; };
 *
 *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
 *     expect(addTwo).to.change(myObj, 'val').by(2); // Not recommended
 *
 *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
 *     expect(subtractTwo).to.change(myObj, 'val').by(2); // Not recommended
 *
 * Add `.not` earlier in the chain to negate `.by`. However, it's often best
 * to assert that the subject changed by its expected delta, rather than
 * asserting that it didn't change by one of countless unexpected deltas.
 *
 *     var myObj = {val: 1}
 *       , addTwo = function () { myObj.val += 2; };
 *
 *     // Recommended
 *     expect(addTwo).to.increase(myObj, 'val').by(2);
 *
 *     // Not recommended
 *     expect(addTwo).to.increase(myObj, 'val').but.not.by(3);
 *
 * `.by` accepts an optional `msg` argument which is a custom error message to
 * show when the assertion fails. The message can also be given as the second
 * argument to `expect`.
 *
 *     var myObj = {val: 1}
 *       , addTwo = function () { myObj.val += 2; };
 *
 *     expect(addTwo).to.increase(myObj, 'val').by(3, 'nooo why fail??');
 *     expect(addTwo, 'nooo why fail??').to.increase(myObj, 'val').by(3);
 *
 * @name by
 * @param {number} delta
 * @param {string} msg _optional_
 * @namespace BDD
 * @public
 */
function assertDelta(delta, msg) {
  if (msg) flag(this, 'message', msg);

  let msgObj = flag(this, 'deltaMsgObj');
  let initial = flag(this, 'initialDeltaValue');
  let final = flag(this, 'finalDeltaValue');
  let behavior = flag(this, 'deltaBehavior');
  let realDelta = flag(this, 'realDelta');

  let expression;
  if (behavior === 'change') {
    expression = Math.abs(final - initial) === Math.abs(delta);
  } else {
    expression = realDelta === Math.abs(delta);
  }

  this.assert(
    expression,
    'expected ' + msgObj + ' to ' + behavior + ' by ' + delta,
    'expected ' + msgObj + ' to not ' + behavior + ' by ' + delta
  );
}

Assertion.addMethod('by', assertDelta);