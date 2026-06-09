/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Object state assertions: extensible, sealed, frozen, finite
 */

import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .extensible
 *
 * Asserts that the target is extensible, which means that new properties can
 * be added to it. Primitives are never extensible.
 *
 *     expect({a: 1}).to.be.extensible;
 *
 * Add `.not` earlier in the chain to negate `.extensible`.
 *
 *     var nonExtensibleObject = Object.preventExtensions({})
 *     , sealedObject = Object.seal({})
 *     , frozenObject = Object.freeze({});
 *
 *     expect(nonExtensibleObject).to.not.be.extensible;
 *     expect(sealedObject).to.not.be.extensible;
 *     expect(frozenObject).to.not.be.extensible;
 *     expect(1).to.not.be.extensible;
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect(1, 'nooo why fail??').to.be.extensible;
 *
 * @name extensible
 * @namespace BDD
 * @public
 */
Assertion.addProperty('extensible', function () {
  let obj = flag(this, 'object');

  let isExtensible = obj === Object(obj) && Object.isExtensible(obj);

  this.assert(
    isExtensible,
    'expected #{this} to be extensible',
    'expected #{this} to not be extensible'
  );
});

/**
 * ### .sealed
 *
 * Asserts that the target is sealed, which means that new properties can't be
 * added to it, and its existing properties can't be reconfigured or deleted.
 * However, it's possible that its existing properties can still be reassigned
 * to different values. Primitives are always sealed.
 *
 *     var sealedObject = Object.seal({});
 *     var frozenObject = Object.freeze({});
 *
 *     expect(sealedObject).to.be.sealed;
 *     expect(frozenObject).to.be.sealed;
 *     expect(1).to.be.sealed;
 *
 * Add `.not` earlier in the chain to negate `.sealed`.
 *
 *     expect({a: 1}).to.not.be.sealed;
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect({a: 1}, 'nooo why fail??').to.be.sealed;
 *
 * @name sealed
 * @namespace BDD
 * @public
 */
Assertion.addProperty('sealed', function () {
  let obj = flag(this, 'object');

  let isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;

  this.assert(
    isSealed,
    'expected #{this} to be sealed',
    'expected #{this} to not be sealed'
  );
});

/**
 * ### .frozen
 *
 * Asserts that the target is frozen, which means that new properties can't be
 * added to it, and its existing properties can't be reassigned to different
 * values, reconfigured, or deleted. Primitives are always frozen.
 *
 *     var frozenObject = Object.freeze({});
 *
 *     expect(frozenObject).to.be.frozen;
 *     expect(1).to.be.frozen;
 *
 * Add `.not` earlier in the chain to negate `.frozen`.
 *
 *     expect({a: 1}).to.not.be.frozen;
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect({a: 1}, 'nooo why fail??').to.be.frozen;
 *
 * @name frozen
 * @namespace BDD
 * @public
 */
Assertion.addProperty('frozen', function () {
  let obj = flag(this, 'object');

  let isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;

  this.assert(
    isFrozen,
    'expected #{this} to be frozen',
    'expected #{this} to not be frozen'
  );
});

/**
 * ### .finite
 *
 * Asserts that the target is a number, and isn't `NaN` or positive/negative
 * `Infinity`.
 *
 *     expect(1).to.be.finite;
 *
 * Add `.not` earlier in the chain to negate `.finite`. However, it's
 * dangerous to do so. The problem is that it creates uncertain expectations
 * by asserting that the subject either isn't a number, or that it's `NaN`, or
 * that it's positive `Infinity`, or that it's negative `Infinity`. It's often
 * best to identify the exact output that's expected, and then write an
 * assertion that only accepts that exact output.
 *
 * When the target isn't expected to be a number, it's often best to assert
 * that it's the expected type, rather than asserting that it isn't one of
 * many unexpected types.
 *
 *     expect('foo').to.be.a('string'); // Recommended
 *     expect('foo').to.not.be.finite; // Not recommended
 *
 * When the target is expected to be `NaN`, it's often best to assert exactly
 * that.
 *
 *     expect(NaN).to.be.NaN; // Recommended
 *     expect(NaN).to.not.be.finite; // Not recommended
 *
 * When the target is expected to be positive infinity, it's often best to
 * assert exactly that.
 *
 *     expect(Infinity).to.equal(Infinity); // Recommended
 *     expect(Infinity).to.not.be.finite; // Not recommended
 *
 * When the target is expected to be negative infinity, it's often best to
 * assert exactly that.
 *
 *     expect(-Infinity).to.equal(-Infinity); // Recommended
 *     expect(-Infinity).to.not.be.finite; // Not recommended
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect('foo', 'nooo why fail??').to.be.finite;
 *
 * @name finite
 * @namespace BDD
 * @public
 */
Assertion.addProperty('finite', function (_msg) {
  let obj = flag(this, 'object');

  this.assert(
    typeof obj === 'number' && isFinite(obj),
    'expected #{this} to be a finite number',
    'expected #{this} to not be a finite number'
  );
});