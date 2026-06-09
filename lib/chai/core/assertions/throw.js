/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Throw assertions: throw / throws / Throw
 */

import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .throw([errorLike], [errMsgMatcher], [msg])
 *
 * When no arguments are provided, `.throw` invokes the target function and
 * asserts that an error is thrown.
 *
 *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
 *     expect(badFn).to.throw();
 *
 * When one argument is provided, and it's an error constructor, `.throw`
 * invokes the target function and asserts that an error is thrown that's an
 * instance of that error constructor.
 *
 *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
 *     expect(badFn).to.throw(TypeError);
 *
 * When one argument is provided, and it's an error instance, `.throw` invokes
 * the target function and asserts that an error is thrown that's strictly
 * (`===`) equal to that error instance.
 *
 *     var err = new TypeError('Illegal salmon!');
 *     var badFn = function () { throw err; };
 *
 *     expect(badFn).to.throw(err);
 *
 * When one argument is provided, and it's a string, `.throw` invokes the
 * target function and asserts that an error is thrown with a message that
 * contains that string.
 *
 *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
 *     expect(badFn).to.throw('salmon');
 *
 * When one argument is provided, and it's a regular expression, `.throw`
 * invokes the target function and asserts that an error is thrown with a
 * message that matches that regular expression.
 *
 *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
 *     expect(badFn).to.throw(/salmon/);
 *
 * When two arguments are provided, and the first is an error instance or
 * constructor, and the second is a string or regular expression, `.throw`
 * invokes the function and asserts that an error is thrown that fulfills both
 * conditions as described above.
 *
 *     var err = new TypeError('Illegal salmon!');
 *     var badFn = function () { throw err; };
 *
 *     expect(badFn).to.throw(TypeError, 'salmon');
 *     expect(badFn).to.throw(TypeError, /salmon/);
 *     expect(badFn).to.throw(err, 'salmon');
 *     expect(badFn).to.throw(err, /salmon/);
 *
 * Add `.not` earlier in the chain to negate `.throw`.
 *
 *     var goodFn = function () {};
 *     expect(goodFn).to.not.throw();
 *
 * However, it's dangerous to negate `.throw` when providing any arguments.
 * The problem is that it creates uncertain expectations by asserting that the
 * target either doesn't throw an error, or that it throws an error but of a
 * different type than the given type, or that it throws an error of the given
 * type but with a message that doesn't include the given string. It's often
 * best to identify the exact output that's expected, and then write an
 * assertion that only accepts that exact output.
 *
 * When the target isn't expected to throw an error, it's often best to assert
 * exactly that.
 *
 *     var goodFn = function () {};
 *
 *     expect(goodFn).to.not.throw(); // Recommended
 *     expect(goodFn).to.not.throw(ReferenceError, 'x'); // Not recommended
 *
 * When the target is expected to throw an error, it's often best to assert
 * that the error is of its expected type, and has a message that includes an
 * expected string, rather than asserting that it doesn't have one of many
 * unexpected types, and doesn't have a message that includes some string.
 *
 *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
 *
 *     expect(badFn).to.throw(TypeError, 'salmon'); // Recommended
 *     expect(badFn).to.not.throw(ReferenceError, 'x'); // Not recommended
 *
 * `.throw` changes the target of any assertions that follow in the chain to
 * be the error object that's thrown.
 *
 *     var err = new TypeError('Illegal salmon!');
 *     err.code = 42;
 *     var badFn = function () { throw err; };
 *
 *     expect(badFn).to.throw(TypeError).with.property('code', 42);
 *
 * `.throw` accepts an optional `msg` argument which is a custom error message
 * to show when the assertion fails. The message can also be given as the
 * second argument to `expect`. When not providing two arguments, always use
 * the second form.
 *
 *     var goodFn = function () {};
 *
 *     expect(goodFn).to.throw(TypeError, 'x', 'nooo why fail??');
 *     expect(goodFn, 'nooo why fail??').to.throw();
 *
 * Due to limitations in ES5, `.throw` may not always work as expected when
 * using a transpiler such as Babel or TypeScript. In particular, it may
 * produce unexpected results when subclassing the built-in `Error` object and
 * then passing the subclassed constructor to `.throw`. See your transpiler's
 * docs for details:
 *
 * - ([Babel](https://babeljs.io/docs/usage/caveats/#classes))
 * - ([TypeScript](https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work))
 *
 * Beware of some common mistakes when using the `throw` assertion. One common
 * mistake is to accidentally invoke the function yourself instead of letting
 * the `throw` assertion invoke the function for you. For example, when
 * testing if a function named `fn` throws, provide `fn` instead of `fn()` as
 * the target for the assertion.
 *
 *     expect(fn).to.throw();     // Good! Tests `fn` as desired
 *     expect(fn()).to.throw();   // Bad! Tests result of `fn()`, not `fn`
 *
 * If you need to assert that your function `fn` throws when passed certain
 * arguments, then wrap a call to `fn` inside of another function.
 *
 *     expect(function () { fn(42); }).to.throw();  // Function expression
 *     expect(() => fn(42)).to.throw();             // ES6 arrow function
 *
 * Another common mistake is to provide an object method (or any stand-alone
 * function that relies on `this`) as the target of the assertion. Doing so is
 * problematic because the `this` context will be lost when the function is
 * invoked by `.throw`; there's no way for it to know what `this` is supposed
 * to be. There are two ways around this problem. One solution is to wrap the
 * method or function call inside of another function. Another solution is to
 * use `bind`.
 *
 *     expect(function () { cat.meow(); }).to.throw();  // Function expression
 *     expect(() => cat.meow()).to.throw();             // ES6 arrow function
 *     expect(cat.meow.bind(cat)).to.throw();           // Bind
 *
 * Finally, it's worth mentioning that it's a best practice in JavaScript to
 * only throw `Error` and derivatives of `Error` such as `ReferenceError`,
 * `TypeError`, and user-defined objects that extend `Error`. No other type of
 * value will generate a stack trace when initialized. With that said, the
 * `throw` assertion does technically support any type of value being thrown,
 * not just `Error` and its derivatives.
 *
 * The aliases `.throws` and `.Throw` can be used interchangeably with
 * `.throw`.
 *
 * @name throw
 * @alias throws
 * @alias Throw
 * @param {Error} errorLike
 * @param {string | RegExp} errMsgMatcher error message
 * @param {string} msg _optional_
 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
 * @returns {void} error for chaining (null if no error)
 * @namespace BDD
 * @public
 */
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