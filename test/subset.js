import * as chai from '../index.js';

describe('containsSubset', function () {
  const {assert, expect} = chai;
  const should = chai.Should();

  describe('plain object', function () {
    var testedObject = {
      a: 'b',
      c: 'd'
    };

    it('should pass for smaller object', function () {
      expect(testedObject).to.containSubset({
        a: 'b'
      });
    });

    it('should pass for same object', function () {
      expect(testedObject).to.containSubset({
        a: 'b',
        c: 'd'
      });
    });

    it('should pass for similar, but not the same object', function () {
      expect(testedObject).to.not.containSubset({
        a: 'notB',
        c: 'd'
      });
    });
  });

  describe('complex object', function () {
    var testedObject = {
      a: 'b',
      c: 'd',
      e: {
        foo: 'bar',
        baz: {
          qux: 'quux'
        }
      }
    };

    it('should pass for smaller object', function () {
      expect(testedObject).to.containSubset({
        a: 'b',
        e: {
          foo: 'bar'
        }
      });
    });

    it('should pass for smaller object', function () {
      expect(testedObject).to.containSubset({
        e: {
          foo: 'bar',
          baz: {
            qux: 'quux'
          }
        }
      });
    });

    it('should pass for same object', function () {
      expect(testedObject).to.containSubset({
        a: 'b',
        c: 'd',
        e: {
          foo: 'bar',
          baz: {
            qux: 'quux'
          }
        }
      });
    });

    it('should pass for similar, but not the same object', function () {
      expect(testedObject).to.not.containSubset({
        e: {
          foo: 'bar',
          baz: {
            qux: 'notAQuux'
          }
        }
      });
    });

    it('should fail if comparing when comparing objects to dates', function () {
      expect(testedObject).to.not.containSubset({
        e: new Date()
      });
    });
  });

  describe('circular objects', function () {
    var object = {};

    before(function () {
      object.arr = [object, object];
      object.arr.push(object.arr);
      object.obj = object;
    });

    it('should contain subdocument', function () {
      expect(object).to.containSubset({
        arr: [{arr: []}, {arr: []}, [{arr: []}, {arr: []}]]
      });
    });

    it('should not contain similar object', function () {
      expect(object).to.not.containSubset({
        arr: [{arr: ['just random field']}, {arr: []}, [{arr: []}, {arr: []}]]
      });
    });
  });

  describe('object with compare function', function () {
    it('should pass when function returns true', function () {
      expect({a: 5}).to.containSubset({a: (a) => a});
    });

    it('should fail when function returns false', function () {
      expect({a: 5}).to.not.containSubset({a: (a) => !a});
    });

    it('should pass for function with no arguments', function () {
      expect({a: 5}).to.containSubset({a: () => true});
    });
  });

  describe('comparison of non objects', function () {
    it('should fail if actual subset is null', function () {
      expect(null).to.not.containSubset({a: 1});
    });

    it('should fail if expected subset is not a object', function () {
      expect({a: 1}).to.not.containSubset(null);
    });

    it('should not fail for same non-object (string) variables', function () {
      expect('string').to.containSubset('string');
    });
  });

  describe('assert style of test', function () {
    it('should find subset', function () {
      assert.containsSubset({a: 1, b: 2}, {a: 1});
      assert.containSubset({a: 1, b: 2}, {a: 1});
    });

    it('negated assert style should function', function () {
      assert.doesNotContainSubset({a: 1, b: 2}, {a: 3});
    });
  });

  describe('should style of test', function () {
    const objectA = {a: 1, b: 2};

    it('should find subset', function () {
      objectA.should.containSubset({a: 1});
    });

    it('negated should style should function', function () {
      objectA.should.not.containSubset({a: 3});
    });
  });

  describe('comparison of dates', function () {
    it('should pass for the same date', function () {
      expect(new Date('2015-11-30')).to.containSubset(new Date('2015-11-30'));
    });

    it('should pass for the same date if nested', function () {
      expect({a: new Date('2015-11-30')}).to.containSubset({
        a: new Date('2015-11-30')
      });
    });

    it('should fail for a different date', function () {
      expect(new Date('2015-11-30')).to.not.containSubset(
        new Date('2012-02-22')
      );
    });

    it('should fail for a different date if nested', function () {
      expect({a: new Date('2015-11-30')}).to.not.containSubset({
        a: new Date('2012-02-22')
      });
    });

    it('should fail for invalid expected date', function () {
      expect(new Date('2015-11-30')).to.not.containSubset(
        new Date('not valid date')
      );
    });

    it('should fail for invalid actual date', function () {
      expect(new Date('not valid actual date')).to.not.containSubset(
        new Date('not valid expected date')
      );
    });
  });

  describe('cyclic objects', () => {
    it('should pass', () => {
      const child = {};
      const parent = {
        children: [child]
      };
      child.parent = parent;

      const myObject = {
        a: 1,
        b: 'two',
        c: parent
      };
      expect(myObject).to.containSubset({
        a: 1,
        c: parent
      });
    });
  });

  describe('nested array subset', function () {
    it('should pass for nested array as subset', function () {
      const testedArray = [1, [2, 3], [4, [5, 6]]];
      expect(testedArray).to.containSubset([[2, 3]]);
    });

    it('should pass for deeply nested array subset', function () {
      const testedArray = [1, [2, 3], [4, [5, 6]]];
      expect(testedArray).to.containSubset([[4, [5]]]);
    });

    it('should fail when deeply nested subset does not match', function () {
      const testedArray = [1, [2, 3], [4, [5, 6]]];
      expect(testedArray).to.not.containSubset([[4, [7]]]);
    });

    it('should pass for array nested in object subset', function () {
      const testedObject = {
        data: [1, 2, [3, 4], [5, [6, 7]]]
      };
      expect(testedObject).to.containSubset({
        data: [[3, 4]]
      });
    });
  });

  describe('deeply nested object subset', function () {
    it('should pass for multiple levels of nesting', function () {
      const testedObject = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep',
                extra: 'data'
              }
            }
          }
        }
      };
      expect(testedObject).to.containSubset({
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep'
              }
            }
          }
        }
      });
    });

    it('should pass for nested objects within nested arrays', function () {
      const testedObject = {
        users: [
          {
            profile: {
              address: {
                city: 'New York',
                zip: '10001'
              }
            }
          },
          {
            profile: {
              address: {
                city: 'London',
                zip: 'SW1A 1AA'
              }
            }
          }
        ]
      };
      expect(testedObject).to.containSubset({
        users: [
          {
            profile: {
              address: {
                city: 'New York'
              }
            }
          }
        ]
      });
    });

    it('should fail when deep nested value does not match', function () {
      const testedObject = {
        level1: {
          level2: {
            level3: {
              value: 'correct'
            }
          }
        }
      };
      expect(testedObject).to.not.containSubset({
        level1: {
          level2: {
            level3: {
              value: 'wrong'
            }
          }
        }
      });
    });
  });

  describe('null/undefined subset matching', function () {
    it('should pass when actual and expected are null', function () {
      expect({a: null}).to.containSubset({a: null});
    });

    it('should pass when actual and expected are undefined', function () {
      expect({a: undefined}).to.containSubset({a: undefined});
    });

    it('should pass for nested null in object', function () {
      expect({
        user: {
          name: 'John',
          middleName: null
        }
      }).to.containSubset({
        user: {
          middleName: null
        }
      });
    });

    it('should fail when expected is null but actual is not null', function () {
      expect({a: 123}).to.not.containSubset({a: null});
    });

    it('should fail when expected is undefined but actual is not undefined', function () {
      expect({a: null}).to.not.containSubset({a: undefined});
    });

    it('should pass when null is in array subset', function () {
      expect([1, null, 3]).to.containSubset([null]);
    });
  });
});
