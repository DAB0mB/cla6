var Chai = require('chai');
var Cla6 = require('..');

var ClassFactory = require('../lib/classFactory');

var expect = Chai.expect;
var spy = Chai.spy;
var unuse = ClassFactory.unuse;

describe('Cla6', function() {
  describe('plugins', function() {
    describe('validations', function() {
      it('should throw an error if a plugin is not provided', function() {
        expect(Cla6.use).to.throw(Error, /plugin/);
      });

      it('should throw an error if plugin is not a function', function() {
        bondUse = Cla6.use.bind(null, false);
        expect(bondUse).to.throw(Error, /plugin.*function/);
      });
    });

    it('should call plugin with class descriptors', function() {
      var props = {
        method: function() {},
        get accessor() {},
        set accessor(value) {}
      };

      var plugin = spy(function(descriptors) {
        expect(descriptors).to.have.all.keys('constructor', 'method', 'accessor');
        expect(descriptors.method.value).to.equal(props.method);
        
        var accessorDescriptor = Object.getOwnPropertyDescriptor(props, 'accessor');
        expect(descriptors.accessor.get).to.equal(accessorDescriptor.get);
        expect(descriptors.accessor.set).to.equal(accessorDescriptor.set);
      });      

      Cla6.use(plugin);
      Cla6('Klass', props);
      expect(plugin).to.have.been.called.once;

      unuse(plugin);
      Cla6('Klass', props);
      expect(plugin).to.have.been.called.once;
    });
  });
});