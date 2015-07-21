var Chai = require('chai');
var Sinon = require('sinon');

var Cla6 = require('..');
var ClassFactory = require('../lib/classFactory');
var PluginsManager = require('../lib/pluginsManager');

var expect = Chai.expect;
var spy = Sinon.spy;

describe('ClassFactory', function() {
  describe('create()', function() {
    before(function() {
      spy(PluginsManager, 'manipulate');
    });

    afterEach(function() {
      PluginsManager.manipulate.reset();
    });

    after(function() {
      PluginsManager.manipulate.restore();
    });

    it('should throw an error if properties are not defined using an object', function() {
      var boundCreate = ClassFactory.create.bind(ClassFactory, 'Klass', false);
      expect(boundCreate).to.throw(Error, /properties.*object/);

      boundCreate = ClassFactory.create.bind(ClassFactory, 'Klass', function() { return false; });
      expect(boundCreate).to.throw(Error, /properties.*object/);
    });

    it('should throw an error if constructor is not a function', function() {
      var props = {
        'constructor': false
      };

      var boundCreate = ClassFactory.create.bind(ClassFactory, 'Klass', props);
      expect(boundCreate).to.throw(Error, /constructor.*function/);
    });

    it('should create a class with the provided name', function() {
      var Klass = ClassFactory.create('Klass', {});
      expect(Klass.name).to.equal('Klass');
    });

    it('should set constructor on prototype', function() {
      var Klass = ClassFactory.create('Klass', {});
      expect(Klass.prototype.constructor).to.equal(Klass);
    });

    describe('properties', function() {
      it('should define constructor', function() {
        var constructor = spy();

        var props = {
          'constructor': constructor
        };

        var Klass = ClassFactory.create('Klass', props);

        Klass();
        expect(constructor.calledOnce).to.be.true;
      });

      it('should define unenumerable values', function() {
        var props = {
          'foo': 'foo',
          'bar': 'bar'
        };

        var Klass = ClassFactory.create('Klass', props);
        expect(Klass.prototype.foo).to.equal('foo');
        expect(Klass.prototype.bar).to.equal('bar');

        var keys = Object.keys(Klass.prototype);
        expect(keys).to.be.empty;
      });

      it('should define unenumerable accessors', function() {
        var getter = spy();
        var setter = spy();

        var props = {
          'get accessor': getter,
          'set accessor': setter
        };

        var Klass = ClassFactory.create('Klass', props);
        var obj = new Klass();

        obj.accessor = obj.accessor;
        expect(getter.calledOnce).to.be.true;
        expect(setter.calledOnce).to.be.true;
        
        var keys = Object.keys(Klass.prototype);
        expect(keys).to.be.empty;
      });

      it('should define statics', function() {
        var props = {
          'static foo': 'foo',
          'static bar': 'bar'
        };

        var Klass = ClassFactory.create('Klass', props);
        expect(Klass.foo).to.equal('foo');
        expect(Klass.bar).to.equal('bar');

        var keys = Object.keys(Klass.prototype);
        expect(keys).to.be.empty;
      });

      it('should set properties by function return value', function() {
        var props = function() {
          return {
            'foo': 'foo',
            'bar': 'bar'
          };
        };

        var Klass = ClassFactory.create('Klass', props);
        expect(Klass.prototype.foo).to.equal('foo');
        expect(Klass.prototype.bar).to.equal('bar');
      });

      it('should inject providers by plugin names', function() {
        var plugin1 = {
          name: 'provider1',
          provider: {}
        };

        var plugin2 = {
          name: 'provider2',
          provider: {}
        };

        PluginsManager.add(plugin1);
        PluginsManager.add(plugin2);

        ClassFactory.create('Klass', function(provider1, provider2) {
          expect(provider1).to.equal(plugin1.provider);
          expect(provider2).to.equal(plugin2.provider);
          return {};
        });

        ClassFactory.create('Klass', function(provider2, provider1) {
          expect(provider1).to.equal(plugin1.provider);
          expect(provider2).to.equal(plugin2.provider);
          return {};
        });

        PluginsManager.reset();
      });
    });

    describe('inheritance', function() {
      it('should inherit from Object by default', function() {
        var Klass = ClassFactory.create('Klass', {});
        expect(Klass.prototype).to.be.an.instanceof(Object);
      });

      it('should inherit from provided parent', function() {
        var Parent = function() {};
        var Child = ClassFactory.create('Child', {}, Parent);
        expect(Child.prototype).to.be.an.instanceof(Parent);
      });

      it('should call parent constructor by default', function() {
        var Parent = spy();
        var Child = ClassFactory.create('Child', {}, Parent);

        Child();
        expect(Parent.calledOnce).to.be.true;
      });
    });

    describe('mixins', function() {
      it('should extend class', function() {
        var mixin1 = {
          'foo': 'foo'
        };

        var mixin2 = {
          'bar': 'bar'
        };

        var mixins = [mixin1, mixin2];
        var Klass = ClassFactory.create('Klass', {}, null, mixins);

        expect(Klass.prototype.foo).to.equal('foo');
        expect(Klass.prototype.bar).to.equal('bar');
      });
    });

    it('should call plugin manipulation methods with properties and parent', function() {
      var props = {
        'foo': 'foo',
        'bar': 'bar'
      };

      var Parent = function() {};
      var Child = ClassFactory.create('Child', props, Parent);

      props.constructor = Child;
      expect(PluginsManager.manipulate.calledOnce).to.be.true;
      expect(PluginsManager.manipulate.getCall(0).args[0]).to.deep.equal(props);
      expect(PluginsManager.manipulate.getCall(0).args[1]).to.equal(Parent);
    });
  });
});