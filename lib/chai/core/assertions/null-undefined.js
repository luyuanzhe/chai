/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Null/undefined/NaN/exist assertions
 */

import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .null
 *
 * Asserts that the target is strictly (`===`) equal to `null`.
 *
 *     expect(null).to.be.null;
 *
 * Add `.not` earlier in the chain to negate `.null`. However, it's often best
 * to assert that the target is equal to its expected value, rather than not
 * equal to `null`.
 *
 *     expect(1).to.equal(1); // Recommended
 *     expect(1).to.not.be.null; // Not recommended
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect(42, 'nooo why fail??').to.be.null;
 *
 * @name null
 * @namespace BDD
 * @public
 */
Assertion.addProperty('null', function () {
  this.assert(
    null === flag(this, 'object'),
    'expected #{this} to be null',
    'expected #{this} not to be null'
  );
});

/**
 * ### .undefined
 *
 * Asserts that the target is strictly (`===`) equal to `undefined`.
 *
 *     expect(undefined).to.be.undefined;
 *
 * Add `.not` earlier in the chain to negate `.undefined`. However, it's often
 * best to assert that the target is equal to its expected value, rather than
 * not equal to `undefined`.
 *
 *     expect(1).to.equal(1); // Recommended
 *     expect(1).to.not.be.undefined; // Not recommended
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect(42, 'nooo why fail??').to.be.undefined;
 *
 * @name undefined
 * @namespace BDD
 * @public
 */
Assertion.addProperty('undefined', function () {
  this.assert(
    undefined === flag(this, 'object'),
    'expected #{this} to be undefined',
    'expected #{this} not to be undefined'
  );
});

/**
 * ### .NaN
 *
 * Asserts that the target is exactly `NaN`.
 *
 *     expect(NaN).to.be.NaN;
 *
 * Add `.not` earlier in the chain to negate `.NaN`. However, it's often best
 * to assert that the target is equal to its expected value, rather than not
 * equal to `NaN`.
 *
 *     expect('foo').to.equal('foo'); // Recommended
 *     expect('foo').to.not.be.NaN; // Not recommended
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect(42, 'nooo why fail??').to.be.NaN;
 *
 * @name NaN
 * @namespace BDD
 * @public
 */
Assertion.addProperty('NaN', function () {
  this.assert(
    _.isNaN(flag(this, 'object')),
    'expected #{this} to be NaN',
    'expected #{this} not to be NaN'
  );
});

/**
 * ### .exist
 *
 * Asserts that the target is not strictly (`===`) equal to either `null` or
 * `undefined`. However, it's often best to assert that the target is equal to
 * its expected value.
 *
 *     expect(1).to.equal(1); // Recommended
 *     expect(1).to.exist; // Not recommended
 *
 *     expect(0).to.equal(0); // Recommended
 *     expect(0).to.exist; // Not recommended
 *
 * Add `.not` earlier in the chain to negate `.exist`.
 *
 *     expect(null).to.be.null; // Recommended
 *     expect(null).to.not.exist; // Not recommended
 *
 *     expect(undefined).to.be.undefined; // Recommended
 *     expect(undefined).to.not.exist; // Not recommended
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect(null, 'nooo why fail??').to.exist;
 *
 * The alias `.exists` can be used interchangeably with `.exist`.
 *
 * @name exist
 * @alias exists
 * @namespace BDD
 * @public
 */
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