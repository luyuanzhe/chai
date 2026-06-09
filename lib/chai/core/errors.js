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
        // somehow wasn't a constructor, maybe we got a function thrown
        // or similar
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
