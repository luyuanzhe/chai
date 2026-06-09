import {Assertion} from '../../assertion.js';
import {AssertionError} from 'assertion-error';
import * as _ from '../../utils/index.js';

const {flag} = _;

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

function assertKeys(keys) {
  let obj = flag(this, 'object'),
    objType = _.type(obj),
    keysType = _.type(keys),
    ssfi = flag(this, 'ssfi'),
    isDeep = flag(this, 'deep'),
    str,
    deepStr = '',
    actual,
    ok = true,
    flagMsg = flag(this, 'message');

  flagMsg = flagMsg ? flagMsg + ': ' : '';
  let mixedArgsMsg =
    flagMsg +
    'when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments';

  if (objType === 'Map' || objType === 'Set') {
    deepStr = isDeep ? 'deeply ' : '';
    actual = [];

    obj.forEach(function (val, key) {
      actual.push(key);
    });

    if (keysType !== 'Array') {
      keys = Array.prototype.slice.call(arguments);
    }
  } else {
    actual = _.getOwnEnumerableProperties(obj);

    switch (keysType) {
      case 'Array':
        if (arguments.length > 1) {
          throw new AssertionError(mixedArgsMsg, undefined, ssfi);
        }
        break;
      case 'Object':
        if (arguments.length > 1) {
          throw new AssertionError(mixedArgsMsg, undefined, ssfi);
        }
        keys = Object.keys(keys);
        break;
      default:
        keys = Array.prototype.slice.call(arguments);
    }

    keys = keys.map(function (val) {
      return typeof val === 'symbol' ? val : String(val);
    });
  }

  if (!keys.length) {
    throw new AssertionError(flagMsg + 'keys required', undefined, ssfi);
  }

  let len = keys.length,
    any = flag(this, 'any'),
    all = flag(this, 'all'),
    expected = keys,
    isEql = isDeep ? flag(this, 'eql') : (val1, val2) => val1 === val2;

  if (!any && !all) {
    all = true;
  }

  const uniqueExpected = [...new Set(expected)];

  if (any) {
    ok = uniqueExpected.some(function (expectedKey) {
      return actual.some(function (actualKey) {
        return isEql(expectedKey, actualKey);
      });
    });
  }

  if (all) {
    ok = uniqueExpected.every(function (expectedKey) {
      return actual.some(function (actualKey) {
        return isEql(expectedKey, actualKey);
      });
    });

    if (!flag(this, 'contains')) {
      ok = ok && uniqueExpected.length == actual.length;
    }
  }

  if (len > 1) {
    keys = keys.map(function (key) {
      return _.inspect(key);
    });
    let last = keys.pop();
    if (all) {
      str = keys.join(', ') + ', and ' + last;
    }
    if (any) {
      str = keys.join(', ') + ', or ' + last;
    }
  } else {
    str = _.inspect(keys[0]);
  }

  str = (len > 1 ? 'keys ' : 'key ') + str;
  str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;

  this.assert(
    ok,
    'expected #{this} to ' + deepStr + str,
    'expected #{this} to not ' + deepStr + str,
    expected.slice(0).sort(_.compareByInspect),
    actual.sort(_.compareByInspect),
    true
  );
}

Assertion.addMethod('keys', assertKeys);
Assertion.addMethod('key', assertKeys);
