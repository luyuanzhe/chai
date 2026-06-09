import * as chai from '../lib/chai.js';
import jsonAssert from './json-assert.js';

chai.use(jsonAssert);

const expect = chai.expect;
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log('PASS:', name);
    passed++;
  } catch (err) {
    console.log('FAIL:', name, '->', err.message);
    failed++;
  }
}

function assertThrows(fn, message) {
  let thrown = false;
  try {
    fn();
  } catch (err) {
    thrown = true;
    if (message && !err.message.includes(message)) {
      throw new Error('Expected message to include: ' + message + ' but got: ' + err.message);
    }
  }
  if (!thrown) throw new Error('Expected to throw');
}

test('合法 JSON - expect(valid).to.isValidJSON()', function () {
  expect('{"name": "chai", "version": 1, "active": true}').to.isValidJSON();
});

test('合法 JSON - expect(valid).to.not.throw 对 assert 无意义，额外验证数组 JSON', function () {
  expect('[1, 2, "abc", null]').to.isValidJSON();
});

test('非法 JSON - expect(invalid).to.not.isValidJSON()', function () {
  expect('{name: chai}').to.not.isValidJSON();
});

test('非法 JSON - expect(invalid).to.isValidJSON() 抛出异常', function () {
  assertThrows(function () {
    expect('{name: chai}').to.isValidJSON();
  }, 'expected');
});

test('空字符串 - expect(\'\').to.not.isValidJSON()', function () {
  expect('').to.not.isValidJSON();
});

test('空字符串 - expect(\'\').to.isValidJSON() 抛出异常', function () {
  assertThrows(function () {
    expect('').to.isValidJSON();
  }, 'expected');
});

test('非字符串输入 - 数字 123 应视为非法 JSON', function () {
  expect(123).to.not.isValidJSON();
});

test('对象字面量非字符串 - 应视为非法 JSON', function () {
  expect({a: 1}).to.not.isValidJSON();
});

console.log('\n结果: 通过 ' + passed + ' 个，失败 ' + failed + ' 个');
if (failed > 0) process.exit(1);
