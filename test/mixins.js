var Chai = require('chai');
var Cla6 = require('..');

var ClassFactory = require('../lib/classFactory');

var expect = Chai.expect;
var spy = Chai.spy;
var unuse = ClassFactory.unuse;

describe('Cla6', function() {
  describe('mixins', function() {
    beforeEach(function() {
      var Klass = Cla6('Klass', {});
      Klass.mixin = Klass.mixin.bind(Klass);
      this.Klass = Klass;
    });

    describe('validations', function() {
      it('should throw error if no properties provided', function() {
        expect(this.Klass.mixin).to.throw(Error, /properties/);
      });

      it('should throw an error if properties are not defined using an object', function() {
        var mixin = this.Klass.mixin.bind(null, false);
        expect(mixin).to.throw(Error, /properties.*object/);
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

    describe('plugins', function() {
      it('should apply plugins for applied mixins', function() {
        var mixin = {
          method: function() {},
          get accessor() {},
          set accessor(value) {}
        };
        
        var plugin = spy(function(descriptors) {
          expect(descriptors).to.have.all.keys('method', 'accessor');
          expect(descriptors.method.value).to.equal(mixin.method);
          
          var accessorDescriptor = Object.getOwnPropertyDescriptor(mixin, 'accessor');
          expect(descriptors.accessor.get).to.equal(accessorDescriptor.get);
          expect(descriptors.accessor.set).to.equal(accessorDescriptor.set);
        });

        Cla6.use(plugin);
        this.Klass.mixin(mixin);
        expect(plugin).to.have.been.called.once;

        unuse(plugin);
        this.Klass.mixin(mixin);
        expect(plugin).to.have.been.called.once;
      });
    });
  });
});