/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

import {Assertion} from '../assertion.js';
import * as _ from '../utils/index.js';
import {flag} from '../utils/index.js';

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
