var Chai = require('chai');
var Cla6 = require('..');

var expect = Chai.expect;
var spy = Chai.spy;

describe('Cla6', function() {
  describe('mixins', function() {
    beforeEach(function() {
      var Klass = Cla6('Klass', {});
      Klass.mixin = Klass.mixin.bind(Klass);
      this.Klass = Klass;
    });

    describe('validations', function() {
      it('should throw error if no properties provided', function() {
        expect(this.Klass.mixin).to.throw(Error, 'properties');
      });

      it('should throw an error if properties are not defined using an object', function() {
        var mixin = this.Klass.mixin.bind(null, false);
        expect(mixin).to.throw(Error, 'properties', 'object');
      });
    });

    it('should add properties to classe\'s prototype', function() {
      this.Klass.mixin({
        foo: function() {
          return 'foo';
        }
      });

      var obj = new this.Klass();
      expect(obj.foo()).to.equal('foo');
    });

    it('should add all properties to classe\'s prototype if multipile mixins provided', function() {
      this.Klass.mixin({
        baz: 'baz',

        foo: function() {
          return 'foo';
        }
      }, {
        baz: 'overriden',

        bar: function() {
          return 'bar';
        }
      });

      var obj = new this.Klass();
      expect(obj.foo()).to.equal('foo');
      expect(obj.bar()).to.equal('bar');
      expect(obj.baz).to.equal('overriden');
    });
  });
});