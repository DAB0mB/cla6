var Chai = require('chai');
var Cla6 = require('..');

var PluginsManager = require('../lib/pluginsManager');

var expect = Chai.expect;
var spy = Chai.spy;
var unuse = PluginsManager.remove;

describe('Cla6', function() {
  describe('plugins', function() {
    describe('validations', function() {
      it('should throw an error if a plugin is not provided', function() {
        expect(Cla6.use).to.throw(Error, /plugin/);
      });

      it('should throw an error if plugin is not an object', function() {
        bondUse = Cla6.use.bind(null, false);
        expect(bondUse).to.throw(Error, /plugin.*object/);
      });

      it('should throw an error if manupulator is not defined', function() {
        var plugin = {};

        bondUse = Cla6.use.bind(null, plugin);
        expect(bondUse).to.throw(Error, /manipulator/);
      });

      it('should throw an error if manupulator is not a function', function() {
        var plugin = {
          manipulate: false
        };

        bondUse = Cla6.use.bind(null, plugin);
        expect(bondUse).to.throw(Error, /manipulator.*function/);
      });

      it('should throw an error if initializer is not a function', function() {
        var plugin = {
          manipulate: function() {},
          initialize: false
        };

        bondUse = Cla6.use.bind(null, plugin);
        expect(bondUse).to.throw(Error, /initializer.*function/);
      });
    });

    it('should call manipulator with class\'es descriptors and parent', function() {
      var props = {
        method: function() {},
        get accessor() {},
        set accessor(value) {}
      };

      var manipulate = spy(function(descriptors, Parent) {
        expect(descriptors).to.have.all.keys('constructor', 'method', 'accessor');
        expect(descriptors.method.value).to.equal(props.method);
        
        var accessorDescriptor = Object.getOwnPropertyDescriptor(props, 'accessor');
        expect(descriptors.accessor.get).to.equal(accessorDescriptor.get);
        expect(descriptors.accessor.set).to.equal(accessorDescriptor.set);

        expect(Parent).to.equal(Array);
      });      

      var plugin = {
        manipulate: manipulate
      };

      Cla6.use(plugin);
      Cla6('Klass').extend(Array, props);
      expect(plugin.manipulate).to.have.been.called.once;

      unuse(plugin);
      Cla6('Klass', props);
      expect(plugin.manipulate).to.have.been.called.once;
    });
  });

  it('should call initializer with Cla6', function() {
    var initialize = spy(function(module) {
      expect(module).to.equal(Cla6);
    });

    var plugin = {
      manipulate: function() {},
      initialize: initialize
    }

    Cla6.use(plugin);
    expect(plugin.initialize).to.have.been.called.once;
    unuse(plugin);
  });
});