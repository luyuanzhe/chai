import {Assertion} from '../../assertion.js';
import {AssertionError} from 'assertion-error';
import * as _ from '../../utils/index.js';

const {flag} = _;

function SameValueZero(a, b) {
  return (_.isNaN(a) && _.isNaN(b)) || a === b;
}

function includeChainingBehavior() {
  flag(this, 'contains', true);
}

function include(val, msg) {
  if (msg) flag(this, 'message', msg);

  let obj = flag(this, 'object'),
    objType = _.type(obj).toLowerCase(),
    flagMsg = flag(this, 'message'),
    negate = flag(this, 'negate'),
    ssfi = flag(this, 'ssfi'),
    isDeep = flag(this, 'deep'),
    descriptor = isDeep ? 'deep ' : '',
    isEql = isDeep ? flag(this, 'eql') : SameValueZero;

  flagMsg = flagMsg ? flagMsg + ': ' : '';

  let included = false;

  switch (objType) {
    case 'string':
      included = obj.indexOf(val) !== -1;
      break;

    case 'weakset':
      if (isDeep) {
        throw new AssertionError(
          flagMsg + 'unable to use .deep.include with WeakSet',
          undefined,
          ssfi
        );
      }

      included = obj.has(val);
      break;

    case 'map':
      obj.forEach(function (item) {
        included = included || isEql(item, val);
      });
      break;

    case 'set':
      if (isDeep) {
        obj.forEach(function (item) {
          included = included || isEql(item, val);
        });
      } else {
        included = obj.has(val);
      }
      break;

    case 'array':
      if (isDeep) {
        included = obj.some(function (item) {
          return isEql(item, val);
        });
      } else {
        included = obj.indexOf(val) !== -1;
      }
      break;

    default: {
      if (val !== Object(val)) {
        throw new AssertionError(
          flagMsg +
            'the given combination of arguments (' +
            objType +
            ' and ' +
            _.type(val).toLowerCase() +
            ')' +
            ' is invalid for this assertion. ' +
            'You can use an array, a map, an object, a set, a string, ' +
            'or a weakset instead of a ' +
            _.type(val).toLowerCase(),
          undefined,
          ssfi
        );
      }

      let props = Object.keys(val);
      let firstErr = null;
      let numErrs = 0;

      props.forEach(function (prop) {
        let propAssertion = new Assertion(obj);
        _.transferFlags(this, propAssertion, true);
        flag(propAssertion, 'lockSsfi', true);

        if (!negate || props.length === 1) {
          propAssertion.property(prop, val[prop]);
          return;
        }

        try {
          propAssertion.property(prop, val[prop]);
        } catch (err) {
          if (!_.checkError.compatibleConstructor(err, AssertionError)) {
            throw err;
          }
          if (firstErr === null) firstErr = err;
          numErrs++;
        }
      }, this);

      if (negate && props.length > 1 && numErrs === props.length) {
        throw firstErr;
      }
      return;
    }
  }

  this.assert(
    included,
    'expected #{this} to ' + descriptor + 'include ' + _.inspect(val),
    'expected #{this} to not ' + descriptor + 'include ' + _.inspect(val)
  );
}

Assertion.addChainableMethod('include', include, includeChainingBehavior);
Assertion.addChainableMethod('contain', include, includeChainingBehavior);
Assertion.addChainableMethod('contains', include, includeChainingBehavior);
Assertion.addChainableMethod('includes', include, includeChainingBehavior);
