import * as chai from '../index.js';
import {jsonAssertPlugin} from '../plugins/json-assert.js';

// 注册插件
chai.use(jsonAssertPlugin);

const expect = chai.expect;

// ============================================
// 场景 1：合法 JSON 字符串
// ============================================
console.log('场景 1：合法 JSON 字符串');

const validJson1 = '{"name": "张三", "age": 25, "city": "北京"}';
const validJson2 = '[1, 2, 3, {"key": "value"}]';
const validJson3 = '"just a string"';
const validJson4 = '42';
const validJson5 = 'true';

try {
  expect(validJson1).to.isValidJSON();
  console.log('✓ 通过：复杂对象 JSON');
  
  expect(validJson2).to.isValidJSON();
  console.log('✓ 通过：数组 JSON');
  
  expect(validJson3).to.isValidJSON();
  console.log('✓ 通过：字符串 JSON');
  
  expect(validJson4).to.isValidJSON();
  console.log('✓ 通过：数字 JSON');
  
  expect(validJson5).to.isValidJSON();
  console.log('✓ 通过：布尔值 JSON');
  
  console.log('场景 1 全部通过！\n');
} catch (err) {
  console.error('✗ 场景 1 失败:', err.message, '\n');
}

// ============================================
// 场景 2：非法 JSON 字符串
// ============================================
console.log('场景 2：非法 JSON 字符串');

const invalidJson1 = '{name: "张三"}';
const invalidJson2 = '[1, 2, 3,]';
const invalidJson3 = '{"key": undefined}';
const invalidJson4 = 'not json at all';
const invalidJson5 = '{"incomplete": ';

try {
  expect(invalidJson1).to.not.isValidJSON();
  console.log('✓ 通过：未加引号的键名');
  
  expect(invalidJson2).to.not.isValidJSON();
  console.log('✓ 通过：数组末尾多余逗号');
  
  expect(invalidJson3).to.not.isValidJSON();
  console.log('✓ 通过：undefined 值');
  
  expect(invalidJson4).to.not.isValidJSON();
  console.log('✓ 通过：普通文本');
  
  expect(invalidJson5).to.not.isValidJSON();
  console.log('✓ 通过：不完整的 JSON');
  
  console.log('场景 2 全部通过！\n');
} catch (err) {
  console.error('✗ 场景 2 失败:', err.message, '\n');
}

// ============================================
// 场景 3：空字符串
// ============================================
console.log('场景 3：空字符串');

const emptyString = '';

try {
  expect(emptyString).to.not.isValidJSON();
  console.log('✓ 通过：空字符串不是合法 JSON');
  
  console.log('场景 3 全部通过！\n');
} catch (err) {
  console.error('✗ 场景 3 失败:', err.message, '\n');
}

console.log('所有示例执行完毕！');
