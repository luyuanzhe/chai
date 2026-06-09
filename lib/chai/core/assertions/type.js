import {Assertion} from '../../assertion.js';
import {AssertionError} from 'assertion-error';
import * as _ from '../../utils/index.js';

const {flag} = _;

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

  if (functionTypes.function.includes(type)) {
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

Assertion.addProperty('ok', function () {
  this.assert(
    flag(this, 'object'),
    'expected #{this} to be truthy',
    'expected #{this} to be falsy'
  );
});

Assertion.addProperty('true', function () {
  this.assert(
    true === flag(this, 'object'),
    'expected #{this} to be true',
    'expected #{this} to be false',
    flag(this, 'negate') ? false : true
  );
});

Assertion.addProperty('numeric', function () {
  const object = flag(this, 'object');

  this.assert(
    ['Number', 'BigInt'].includes(_.type(object)),
    'expected #{this} to be numeric',
    'expected #{this} to not be numeric',
    flag(this, 'negate') ? false : true
  );
});

Assertion.addProperty('callable', function () {
  const val = flag(this, 'object');
  const ssfi = flag(this, 'ssfi');
  const message = flag(this, 'message');
  const msg = message ? `${message}: ` : '';
  const negate = flag(this, 'negate');

  const assertionMessage = negate
    ? `${msg}expected ${_.inspect(val)} not to be a callable function`
    : `${msg}expected ${_.inspect(val)} to be a callable function`;

  const isCallable = [
    'Function',
    'AsyncFunction',
    'GeneratorFunction',
    'AsyncGeneratorFunction'
  ].includes(_.type(val));

  if ((isCallable && negate) || (!isCallable && !negate)) {
    throw new AssertionError(assertionMessage, undefined, ssfi);
  }
});

Assertion.addProperty('false', function () {
  this.assert(
    false === flag(this, 'object'),
    'expected #{this} to be false',
    'expected #{this} to be true',
    flag(this, 'negate') ? true : false
  );
});

Assertion.addProperty('null', function () {
  this.assert(
    null === flag(this, 'object'),
    'expected #{this} to be null',
    'expected #{this} not to be null'
  );
});

Assertion.addProperty('undefined', function () {
  this.assert(
    undefined === flag(this, 'object'),
    'expected #{this} to be undefined',
    'expected #{this} not to be undefined'
  );
});

Assertion.addProperty('NaN', function () {
  this.assert(
    _.isNaN(flag(this, 'object')),
    'expected #{this} to be NaN',
    'expected #{this} not to be NaN'
  );
});

function assertExist() {
  let val = flag(this, 'object');
  this.assert(
    val !== null && val !== undefined,
    'expected #{this} to exist',
    'expected #{this} to not exist'
  );
}

Assertion.addProperty('exist', assertExist);
Assertion.addProperty('exists', assertExist);

Assertion.addProperty('empty', function () {
  let val = flag(this, 'object'),
    ssfi = flag(this, 'ssfi'),
    flagMsg = flag(this, 'message'),
    itemsCount;

  flagMsg = flagMsg ? flagMsg + ': ' : '';

  switch (_.type(val).toLowerCase()) {
    case 'array':
    case 'string':
      itemsCount = val.length;
      break;
    case 'map':
    case 'set':
      itemsCount = val.size;
      break;
    case 'weakmap':
    case 'weakset':
      throw new AssertionError(
        flagMsg + '.empty was passed a weak collection',
        undefined,
        ssfi
      );
    case 'function': {
      const msg = flagMsg + '.empty was passed a function ' + _.getName(val);
      throw new AssertionError(msg.trim(), undefined, ssfi);
    }
    default:
      if (val !== Object(val)) {
        throw new AssertionError(
          flagMsg + '.empty was passed non-string primitive ' + _.inspect(val),
          undefined,
          ssfi
        );
      }
      itemsCount = Object.keys(val).length;
  }

  this.assert(
    0 === itemsCount,
    'expected #{this} to be empty',
    'expected #{this} not to be empty'
  );
});

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

Assertion.addProperty('finite', function () {
  let obj = flag(this, 'object');

  this.assert(
    typeof obj === 'number' && isFinite(obj),
    'expected #{this} to be a finite number',
    'expected #{this} to not be a finite number'
  );
});
