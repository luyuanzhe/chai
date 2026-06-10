import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

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

Assertion.addProperty('not', function () {
  flag(this, 'negate', true);
});

Assertion.addProperty('deep', function () {
  flag(this, 'deep', true);
});

Assertion.addProperty('nested', function () {
  flag(this, 'nested', true);
});

Assertion.addProperty('own', function () {
  flag(this, 'own', true);
});

Assertion.addProperty('ordered', function () {
  flag(this, 'ordered', true);
});

Assertion.addProperty('any', function () {
  flag(this, 'any', true);
  flag(this, 'all', false);
});

Assertion.addProperty('all', function () {
  flag(this, 'all', true);
  flag(this, 'any', false);
});
