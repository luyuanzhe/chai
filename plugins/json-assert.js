/*!
 * chai-json-assert
 * Copyright(c) 2024
 * MIT Licensed
 */

/**
 * # isValidJSON
 *
 * Asserts that the target is a valid JSON string.
 *
 *     expect('{"name": "test"}').to.isValidJSON();
 *     expect('{invalid}').to.not.isValidJSON();
 *
 * @name isValidJSON
 * @namespace Assertion
 * @public
 */
export function jsonAssertPlugin(chai, utils) {
  const Assertion = chai.Assertion;

  Assertion.addMethod('isValidJSON', function () {
    const obj = this._obj;
    
    // 检查是否为字符串类型
    new Assertion(obj).to.be.a('string', 'isValidJSON requires a string input');
    
    let isValid = false;
    try {
      JSON.parse(obj);
      isValid = true;
    } catch (e) {
      isValid = false;
    }

    this.assert(
      isValid,
      `expected #{this} to be a valid JSON string`,
      `expected #{this} not to be a valid JSON string`
    );
  });
}
