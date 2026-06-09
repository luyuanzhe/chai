/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Language Chains
 */

import {Assertion} from '../../assertion.js';

/**
 * ### Language Chains
 *
 * The following are provided as chainable getters to improve the readability
 * of your assertions.
 *
 * **Chains**
 *
 * - to
 * - be
 * - been
 * - is
 * - that
 * - which
 * - and
 * - has
 * - have
 * - with
 * - at
 * - of
 * - same
 * - but
 * - does
 * - still
 * - also
 *
 * @name language chains
 * @namespace BDD
 * @public
 */

[
  'to',
  'be',
  'been',
  'is',
  'and',
  'has',
  'have',
  'with',
  'that',
  'which',
  'at',
  'of',
  'same',
  'but',
  'does',
  'still',
  'also'
].forEach(function (chain) {
  Assertion.addProperty(chain);
});