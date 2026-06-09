/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Flags and modifiers (not, deep, nested, own, ordered, any, all)
 */

import {Assertion} from '../../assertion.js';
import * as _ from '../../utils/index.js';

const {flag} = _;

/**
 * ### .not
 *
 * Negates all assertions that follow in the chain.
 *
 *     expect(function () {}).to.not.throw();
 *     expect({a: 1}).to.not.have.property('b');
 *     expect([1, 2]).to.be.an('array').that.does.not.include(3);
 *
 * Just because you can negate any assertion with `.not` doesn't mean you
 * should. With great power comes great responsibility. It's often best to
 * assert that the one expected output was produced, rather than asserting
 * that one of countless unexpected outputs wasn't produced. See individual
 * assertions for specific guidance.
 *
 *     expect(2).to.equal(2); // Recommended
 *     expect(2).to.not.equal(1); // Not recommended
 *
 * @name not
 * @namespace BDD
 * @public
 */

Assertion.addProperty('not', function () {
  flag(this, 'negate', true);
});

/**
 * ### .deep
 *
 * Causes all `.equal`, `.include`, `.members`, `.keys`, and `.property`
 * assertions that follow in the chain to use deep equality instead of strict
 * (`===`) equality. See the `deep-eql` project page for info on the deep
 * equality algorithm: https://github.com/chaijs/deep-eql.
 *
 *     // Target object deeply (but not strictly) equals `{a: 1}`
 *     expect({a: 1}).to.deep.equal({a: 1});
 *     expect({a: 1}).to.not.equal({a: 1});
 *
 *     // Target array deeply (but not strictly) includes `{a: 1}`
 *     expect([{a: 1}]).to.deep.include({a: 1});
 *     expect([{a: 1}]).to.not.include({a: 1});
 *
 *     // Target object deeply (but not strictly) includes `x: {a: 1}`
 *     expect({x: {a: 1}}).to.deep.include({x: {a: 1}});
 *     expect({x: {a: 1}}).to.not.include({x: {a: 1}});
 *
 *     // Target array deeply (but not strictly) has member `{a: 1}`
 *     expect([{a: 1}]).to.have.deep.members([{a: 1}]);
 *     expect([{a: 1}]).to.not.have.members([{a: 1}]);
 *
 *     // Target set deeply (but not strictly) has key `{a: 1}`
 *     expect(new Set([{a: 1}])).to.have.deep.keys([{a: 1}]);
 *     expect(new Set([{a: 1}])).to.not.have.keys([{a: 1}]);
 *
 *     // Target object deeply (but not strictly) has property `x: {a: 1}`
 *     expect({x: {a: 1}}).to.have.deep.property('x', {a: 1});
 *     expect({x: {a: 1}}).to.not.have.property('x', {a: 1});
 *
 * @name deep
 * @namespace BDD
 * @public
 */

Assertion.addProperty('deep', function () {
  flag(this, 'deep', true);
});

/**
 * ### .nested
 *
 * Enables dot- and bracket-notation in all `.property` and `.include`
 * assertions that follow in the chain.
 *
 *     expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]');
 *     expect({a: {b: ['x', 'y']}}).to.nested.include({'a.b[1]': 'y'});
 *
 * If `.` or `[]` are part of an actual property name, they can be escaped by
 * adding two backslashes before them.
 *
 *     expect({'.a': {'[b]': 'x'}}).to.have.nested.property('\\.a.\\[b\\]');
 *     expect({'.a': {'[b]': 'x'}}).to.nested.include({'\\.a.\\[b\\]': 'x'});
 *
 * `.nested` cannot be combined with `.own`.
 *
 * @name nested
 * @namespace BDD
 * @public
 */

Assertion.addProperty('nested', function () {
  flag(this, 'nested', true);
});

/**
 * ### .own
 *
 * Causes all `.property` and `.include` assertions that follow in the chain
 * to ignore inherited properties.
 *
 *     Object.prototype.b = 2;
 *
 *     expect({a: 1}).to.have.own.property('a');
 *     expect({a: 1}).to.have.property('b');
 *     expect({a: 1}).to.not.have.own.property('b');
 *
 *     expect({a: 1}).to.own.include({a: 1});
 *     expect({a: 1}).to.include({b: 2}).but.not.own.include({b: 2});
 *
 * `.own` cannot be combined with `.nested`.
 *
 * @name own
 * @namespace BDD
 * @public
 */

Assertion.addProperty('own', function () {
  flag(this, 'own', true);
});

/**
 * ### .ordered
 *
 * Causes all `.members` assertions that follow in the chain to require that
 * members be in the same order.
 *
 *     expect([1, 2]).to.have.ordered.members([1, 2])
 *       .but.not.have.ordered.members([2, 1]);
 *
 * When `.include` and `.ordered` are combined, the ordering begins at the
 * start of both arrays.
 *
 *     expect([1, 2, 3]).to.include.ordered.members([1, 2])
 *       .but.not.include.ordered.members([2, 3]);
 *
 * @name ordered
 * @namespace BDD
 * @public
 */

Assertion.addProperty('ordered', function () {
  flag(this, 'ordered', true);
});

/**
 * ### .any
 *
 * Causes all `.keys` assertions that follow in the chain to only require that
 * the target have at least one of the given keys. This is the opposite of
 * `.all`, which requires that the target have all of the given keys.
 *
 *     expect({a: 1, b: 2}).to.not.have.any.keys('c', 'd');
 *
 * See the `.keys` doc for guidance on when to use `.any` or `.all`.
 *
 * @name any
 * @namespace BDD
 * @public
 */

Assertion.addProperty('any', function () {
  flag(this, 'any', true);
  flag(this, 'all', false);
});

/**
 * ### .all
 *
 * Causes all `.keys` assertions that follow in the chain to require that the
 * target have all of the given keys. This is the opposite of `.any`, which
 * only requires that the target have at least one of the given keys.
 *
 *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
 *
 * Note that `.all` is used by default when neither `.all` nor `.any` are
 * added earlier in the chain. However, it's often best to add `.all` anyway
 * because it improves readability.
 *
 * See the `.keys` doc for guidance on when to use `.any` or `.all`.
 *
 * @name all
 * @namespace BDD
 * @public
 */

Assertion.addProperty('all', function () {
  flag(this, 'all', true);
  flag(this, 'any', false);
});