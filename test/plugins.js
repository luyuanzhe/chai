import * as chai from '../index.js';
import {jsonAssertPlugin, registerJSONAssert} from '../plugins/json-assert.js';

describe('plugins', function () {

  function plugin (chai) {
    if (chai.Assertion.prototype.testing) return;

    Object.defineProperty(chai.Assertion.prototype, 'testing', {
      get: function () {
        return 'successful';
      }
    });
  }

  it('basic usage', function () {
    chai.use(plugin);
    var expect = chai.expect;
    expect(expect('').testing).to.equal('successful');
  });

  it('double plugin', function () {
    chai.expect(function () {
      chai.use(plugin);
    }).to.not.throw();
  });

  it('nested plugin', function () {
    chai.use(function (chai) {
      chai.use(plugin);
    });
    var expect = chai.expect;
    expect(expect('').testing).to.equal('successful');
  });

  it('chained plugin', function () {
    chai.use(function (chaiObj) {
      Object.defineProperty(chaiObj.Assertion.prototype, 'testing2', {
        get() {
          return 'bleep bloop';
        }
      });
    }).use(plugin);
    var expect = chai.expect;
    expect(expect('').testing).to.equal('successful');
    expect(expect('').testing2).to.equal('bleep bloop');
  });

  it('.use detached from chai object', function () {
    function anotherPlugin (chai) {
      Object.defineProperty(chai.Assertion.prototype, 'moreTesting', {
        get: function () {
          return 'more success';
        }
      });
    }

    var use = chai.use;
    use(anotherPlugin);

    var expect = chai.expect;
    expect(expect('').moreTesting).to.equal('more success');
  });
});

describe('json assert plugin examples', function () {
  before(function () {
    registerJSONAssert(chai);
  });

  it('合法 JSON', function () {
    chai.use(jsonAssertPlugin);
    chai.expect('{"name":"chai","version":1}').to.be.isValidJSON();
  });

  it('非法 JSON', function () {
    chai.expect('{"name":chai}').to.not.be.isValidJSON();
  });

  it('空字符串', function () {
    chai.expect('').to.not.be.isValidJSON();
  });
});
