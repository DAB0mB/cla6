var Chai = require('chai');
var Cla6 = require('..');

var expect = Chai.expect;
var spy = Chai.spy;

describe('cla6', function() {
  describe('plugins', function() {
    describe('validations', function() {
      it('should throw an error if a plugin is not provided', function() {
        expect(Cla6.use).to.throw(Error, 'plugin');
      });

      it('should throw an error if plugin is not a function', function() {
        bondUse = Cla6.use.bind(null, false);
        expect(bondUse).to.throw(Error, 'plugin', 'function');
      });
    });

    it('should call plugin with class properties', function() {
      var plugin = spy(function(fixedProps) {
        expect(fixedProps).to.have.all.keys('constructor', 'method', 'accessor');
        expect(fixedProps.method.value).to.equal(props.method);
        
        var accessorDescriptor = Object.getOwnPropertyDescriptor(props, 'accessor');
        expect(fixedProps.accessor.get).to.equal(accessorDescriptor.get);
        expect(fixedProps.accessor.set).to.equal(accessorDescriptor.set);
      });
      
      Cla6.use(plugin);

      var props = {
        method: function() {},
        get accessor() {},
        set accessor(value) {}
      };

      Cla6('Klass', props);
      expect(plugin).to.have.been.called.once;
    });
  });
});