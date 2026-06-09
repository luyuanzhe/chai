import * as chai from '../lib/chai.js';
import jsonAssert from './json-assert.js';

chai.use(jsonAssert);

const expect = chai.expect;

console.log('--- Scene 1: 合法 JSON ---');
const validJSON = '{"name": "chai", "version": 1, "active": true}';
try {
  expect(validJSON).to.isValidJSON();
  console.log('✓ 通过: expect(validJSON).to.isValidJSON()');
} catch (err) {
  console.log('✗ 未通过:', err.message);
}

console.log('--- Scene 2: 非法 JSON ---');
const invalidJSON = '{name: chai, version: 1}';
try {
  expect(invalidJSON).to.not.isValidJSON();
  console.log('✓ 通过: expect(invalidJSON).to.not.isValidJSON()');
} catch (err) {
  console.log('✗ 未通过:', err.message);
}

try {
  expect(invalidJSON).to.isValidJSON();
  console.log('✗ 不应通过');
} catch (err) {
  console.log('✓ 按预期抛出错误:', err.message);
}

console.log('--- Scene 3: 空字符串 ---');
const emptyJSON = '';
try {
  expect(emptyJSON).to.not.isValidJSON();
  console.log('✓ 通过: expect(\'\').to.not.isValidJSON()');
} catch (err) {
  console.log('✗ 未通过:', err.message);
}

try {
  expect(emptyJSON).to.isValidJSON();
  console.log('✗ 不应通过');
} catch (err) {
  console.log('✓ 按预期抛出错误:', err.message);
}

console.log('所有示例运行完成。');
