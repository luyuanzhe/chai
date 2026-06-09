/**
 * Chai Plugin - isValidJSON
 *
 * 添加一个新的断言方法 .isValidJSON()，用于校验传入字符串是否为合法的 JSON 格式。
 * 同时支持否定链式调用：.not.isValidJSON()。
 *
 * 使用方式：
 *   import * as chai from 'chai';
 *   import jsonAssert from './plugins/json-assert.js';
 *   chai.use(jsonAssert);
 *
 *   expect('{"a": 1}').to.isValidJSON();
 *   expect('not-json').to.not.isValidJSON();
 */

export default function jsonAssertPlugin(chai, utils) {
  const Assertion = chai.Assertion;
  const flag = utils.flag;

  function isValidJSONString(value) {
    if (typeof value !== 'string' || value.length === 0) return false;
    try {
      JSON.parse(value);
      return true;
    } catch (err) {
      return false;
    }
  }

  Assertion.addMethod('isValidJSON', function () {
    const obj = flag(this, 'object');

    this.assert(
      isValidJSONString(obj),
      'expected #{this} to be a valid JSON string',
      'expected #{this} to not be a valid JSON string',
      true,
      undefined
    );
  });
}
