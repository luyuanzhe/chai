const fs = require('fs');
try {
  const chai = require('./lib/chai.js');
  chai.should();
  const obj = Object.freeze({ a: 1 });
  obj.should.have.property('a');
  fs.writeFileSync('output.txt', 'success\n');
} catch (e) {
  fs.writeFileSync('output.txt', e.stack + '\n');
}
