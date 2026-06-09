import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

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
