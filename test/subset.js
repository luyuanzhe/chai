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

  describe('array nested subset', function () {
    it('should match array containing objects with nested properties', function () {
      var tested = [
        {id: 1, name: 'Alice', address: {city: 'NYC', zip: '10001'}},
        {id: 2, name: 'Bob', address: {city: 'LA', zip: '90001'}}
      ];
      expect(tested).to.containSubset([
        {name: 'Alice', address: {city: 'NYC'}}
      ]);
    });

    it('should not match when nested object in array element differs', function () {
      var tested = [
        {id: 1, name: 'Alice', address: {city: 'NYC'}},
        {id: 2, name: 'Bob', address: {city: 'LA'}}
      ];
      expect(tested).to.not.containSubset([
        {name: 'Alice', address: {city: 'LA'}}
      ]);
    });

    it('should match array containing nested arrays', function () {
      var tested = [
        {name: 'Alice', tags: ['admin', 'user']},
        {name: 'Bob', tags: ['user']}
      ];
      expect(tested).to.containSubset([
        {name: 'Alice', tags: ['admin', 'user']}
      ]);
    });

    it('should match empty array as subset of any array', function () {
      expect([1, 2, 3]).to.containSubset([]);
    });

    it('should not match when array subset element has no match', function () {
      var tested = [{a: 1}, {a: 2}];
      expect(tested).to.not.containSubset([{a: 3}]);
    });
  });

  describe('object multi-level nested subset', function () {
    it('should match deeply nested object (4+ levels)', function () {
      var tested = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep'
              }
            }
          }
        }
      };
      expect(tested).to.containSubset({
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

    it('should match partial at deep nesting level', function () {
      var tested = {
        level1: {
          level2: {
            level3: {
              a: 1,
              b: 2,
              c: 3
            }
          }
        }
      };
      expect(tested).to.containSubset({
        level1: {
          level2: {
            level3: {
              a: 1
            }
          }
        }
      });
    });

    it('should not match when deep nested value differs', function () {
      var tested = {
        level1: {
          level2: {
            level3: {
              value: 'correct'
            }
          }
        }
      };
      expect(tested).to.not.containSubset({
        level1: {
          level2: {
            level3: {
              value: 'wrong'
            }
          }
        }
      });
    });

    it('should match mixed arrays and objects at different nesting levels', function () {
      var tested = {
        users: [
          {
            name: 'Alice',
            profile: {
              contacts: [{type: 'email', value: 'alice@example.com'}]
            }
          },
          {
            name: 'Bob',
            profile: {
              contacts: [{type: 'phone', value: '123-456'}]
            }
          }
        ]
      };
      expect(tested).to.containSubset({
        users: [
          {
            name: 'Alice',
            profile: {
              contacts: [{type: 'email'}]
            }
          }
        ]
      });
    });
  });

  describe('empty value subset matching', function () {
    it('should match empty object as subset of any object', function () {
      expect({a: 1, b: 2}).to.containSubset({});
    });

    it('should match empty array as subset of any array', function () {
      expect([{a: 1}]).to.containSubset([]);
    });

    it('should match object with null property value', function () {
      expect({a: null, b: 2}).to.containSubset({a: null});
    });

    it('should not match when expected null but actual is not null', function () {
      expect({a: 1, b: 2}).to.not.containSubset({a: null});
    });

    it('should not match when expected object but actual is null', function () {
      expect({a: null}).to.not.containSubset({a: {b: 1}});
    });

    it('should match object with undefined property value', function () {
      expect({a: undefined, b: 2}).to.containSubset({a: undefined});
    });

    it('should match empty string as subset value', function () {
      expect({a: '', b: 'hello'}).to.containSubset({a: ''});
    });

    it('should match zero as subset value', function () {
      expect({a: 0, b: 1}).to.containSubset({a: 0});
    });
  });
});
