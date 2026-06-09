import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

function assertThrows(errorLike, errMsgMatcher, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    ssfi = flag(this, 'ssfi'),
    flagMsg = flag(this, 'message'),
    negate = flag(this, 'negate') || false;
  new Assertion(obj, flagMsg, ssfi, true).is.a('function');

  if (_.isRegExp(errorLike) || typeof errorLike === 'string') {
    errMsgMatcher = errorLike;
    errorLike = null;
  }

  let caughtErr;
  let errorWasThrown = false;
  try {
    obj();
  } catch (err) {
    errorWasThrown = true;
    caughtErr = err;
  }

  let everyArgIsUndefined =
    errorLike === undefined && errMsgMatcher === undefined;

  let everyArgIsDefined = Boolean(errorLike && errMsgMatcher);
  let errorLikeFail = false;
  let errMsgMatcherFail = false;

  if (everyArgIsUndefined || (!everyArgIsUndefined && !negate)) {
    let errorLikeString = 'an error';
    if (errorLike instanceof Error) {
      errorLikeString = '#{exp}';
    } else if (errorLike) {
      errorLikeString = _.checkError.getConstructorName(errorLike);
    }

    let actual = caughtErr;
    if (caughtErr instanceof Error) {
      actual = caughtErr.toString();
    } else if (typeof caughtErr === 'string') {
      actual = caughtErr;
    } else if (
      caughtErr &&
      (typeof caughtErr === 'object' || typeof caughtErr === 'function')
    ) {
      try {
        actual = _.checkError.getConstructorName(caughtErr);
      } catch (_err) {
      }
    }

    this.assert(
      errorWasThrown,
      'expected #{this} to throw ' + errorLikeString,
      'expected #{this} to not throw an error but #{act} was thrown',
      errorLike && errorLike.toString(),
      actual
    );
  }

  if (errorLike && caughtErr) {
    if (errorLike instanceof Error) {
      let isCompatibleInstance = _.checkError.compatibleInstance(
        caughtErr,
        errorLike
      );

      if (isCompatibleInstance === negate) {
        if (everyArgIsDefined && negate) {
          errorLikeFail = true;
        } else {
          this.assert(
            negate,
            'expected #{this} to throw #{exp} but #{act} was thrown',
            'expected #{this} to not throw #{exp}' +
              (caughtErr && !negate ? ' but #{act} was thrown' : ''),
            errorLike.toString(),
            caughtErr.toString()
          );
        }
      }
    }

    let isCompatibleConstructor = _.checkError.compatibleConstructor(
      caughtErr,
      errorLike
    );
    if (isCompatibleConstructor === negate) {
      if (everyArgIsDefined && negate) {
        errorLikeFail = true;
      } else {
        this.assert(
          negate,
          'expected #{this} to throw #{exp} but #{act} was thrown',
          'expected #{this} to not throw #{exp}' +
            (caughtErr ? ' but #{act} was thrown' : ''),
          errorLike instanceof Error
            ? errorLike.toString()
            : errorLike && _.checkError.getConstructorName(errorLike),
          caughtErr instanceof Error
            ? caughtErr.toString()
            : caughtErr && _.checkError.getConstructorName(caughtErr)
        );
      }
    }
  }

  if (caughtErr && errMsgMatcher !== undefined && errMsgMatcher !== null) {
    let placeholder = 'including';
    if (_.isRegExp(errMsgMatcher)) {
      placeholder = 'matching';
    }

    let isCompatibleMessage = _.checkError.compatibleMessage(
      caughtErr,
      errMsgMatcher
    );
    if (isCompatibleMessage === negate) {
      if (everyArgIsDefined && negate) {
        errMsgMatcherFail = true;
      } else {
        this.assert(
          negate,
          'expected #{this} to throw error ' +
            placeholder +
            ' #{exp} but got #{act}',
          'expected #{this} to throw error not ' + placeholder + ' #{exp}',
          errMsgMatcher,
          _.checkError.getMessage(caughtErr)
        );
      }
    }
  }

  if (errorLikeFail && errMsgMatcherFail) {
    this.assert(
      negate,
      'expected #{this} to throw #{exp} but #{act} was thrown',
      'expected #{this} to not throw #{exp}' +
        (caughtErr ? ' but #{act} was thrown' : ''),
      errorLike instanceof Error
        ? errorLike.toString()
        : errorLike && _.checkError.getConstructorName(errorLike),
      caughtErr instanceof Error
        ? caughtErr.toString()
        : caughtErr && _.checkError.getConstructorName(caughtErr)
    );
  }

  flag(this, 'object', caughtErr);
}

Assertion.addMethod('throw', assertThrows);
Assertion.addMethod('throws', assertThrows);
Assertion.addMethod('Throw', assertThrows);

function respondTo(method, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    itself = flag(this, 'itself'),
    context =
      'function' === typeof obj && !itself
        ? obj.prototype[method]
        : obj[method];

  this.assert(
    'function' === typeof context,
    'expected #{this} to respond to ' + _.inspect(method),
    'expected #{this} to not respond to ' + _.inspect(method)
  );
}

Assertion.addMethod('respondTo', respondTo);
Assertion.addMethod('respondsTo', respondTo);

Assertion.addProperty('itself', function () {
  flag(this, 'itself', true);
});

function satisfy(matcher, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object');
  let result = matcher(obj);
  this.assert(
    result,
    'expected #{this} to satisfy ' + _.objDisplay(matcher),
    'expected #{this} to not satisfy' + _.objDisplay(matcher),
    flag(this, 'negate') ? false : true,
    result
  );
}

Assertion.addMethod('satisfy', satisfy);
Assertion.addMethod('satisfies', satisfy);

function isSubsetOf(_subset, _superset, cmp, contains, ordered) {
  let superset = Array.from(_superset);
  let subset = Array.from(_subset);
  if (!contains) {
    if (subset.length !== superset.length) return false;
    superset = superset.slice();
  }

  return subset.every(function (elem, idx) {
    if (ordered) return cmp ? cmp(elem, superset[idx]) : elem === superset[idx];

    if (!cmp) {
      let matchIdx = superset.indexOf(elem);
      if (matchIdx === -1) return false;

      if (!contains) superset.splice(matchIdx, 1);
      return true;
    }

    return superset.some(function (elem2, matchIdx) {
      if (!cmp(elem, elem2)) return false;

      if (!contains) superset.splice(matchIdx, 1);
      return true;
    });
  });
}

Assertion.addMethod('members', function (subset, msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object'),
    flagMsg = flag(this, 'message'),
    ssfi = flag(this, 'ssfi');

  new Assertion(obj, flagMsg, ssfi, true).to.be.iterable;
  new Assertion(subset, flagMsg, ssfi, true).to.be.iterable;

  let contains = flag(this, 'contains');
  let ordered = flag(this, 'ordered');

  let subject, failMsg, failNegateMsg;

  if (contains) {
    subject = ordered ? 'an ordered superset' : 'a superset';
    failMsg = 'expected #{this} to be ' + subject + ' of #{exp}';
    failNegateMsg = 'expected #{this} to not be ' + subject + ' of #{exp}';
  } else {
    subject = ordered ? 'ordered members' : 'members';
    failMsg = 'expected #{this} to have the same ' + subject + ' as #{exp}';
    failNegateMsg =
      'expected #{this} to not have the same ' + subject + ' as #{exp}';
  }

  let cmp = flag(this, 'deep') ? flag(this, 'eql') : undefined;

  this.assert(
    isSubsetOf(subset, obj, cmp, contains, ordered),
    failMsg,
    failNegateMsg,
    subset,
    obj,
    true
  );
});

Assertion.addProperty('iterable', function (msg) {
  if (msg) flag(this, 'message', msg);
  let obj = flag(this, 'object');

  this.assert(
    obj != undefined && obj[Symbol.iterator],
    'expected #{this} to be an iterable',
    'expected #{this} to not be an iterable',
    obj
  );
});

function oneOf(list, msg) {
  if (msg) flag(this, 'message', msg);
  let expected = flag(this, 'object'),
    flagMsg = flag(this, 'message'),
    ssfi = flag(this, 'ssfi'),
    contains = flag(this, 'contains'),
    isDeep = flag(this, 'deep'),
    eql = flag(this, 'eql');
  new Assertion(list, flagMsg, ssfi, true).to.be.an('array');

  if (contains) {
    this.assert(
      list.some(function (possibility) {
        return (
          expected.indexOf(possibility) > -1 ||
          (isDeep &&
            Array.isArray(expected) &&
            expected.some(function (item) {
              return eql(item, possibility);
            }))
        );
      }),
      'expected #{this} to ' +
        (isDeep ? 'deeply ' : '') +
        'contain one of #{exp}',
      'expected #{this} to not ' +
        (isDeep ? 'deeply ' : '') +
        'contain one of #{exp}',
      list,
      expected
    );
  } else {
    if (isDeep) {
      this.assert(
        list.some(function (possibility) {
          return eql(expected, possibility);
        }),
        'expected #{this} to deeply equal one of #{exp}',
        'expected #{this} to deeply equal one of #{exp}',
        list,
        expected
      );
    } else {
      this.assert(
        list.indexOf(expected) > -1,
        'expected #{this} to be one of #{exp}',
        'expected #{this} to not be one of #{exp}',
        list,
        expected
      );
    }
  }
}

Assertion.addMethod('oneOf', oneOf);
