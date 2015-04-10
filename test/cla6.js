var Chai = require('chai');
var Cla6 = require('..');

var expect = Chai.expect;
var spy = Chai.spy;

describe('Cla6', function() {
  describe('validations', function() {
    it('should throw an error if a name is not provided', function() {
      expect(Cla6).to.throw(Error, 'name');
    });

    it('should throw an error if a name is not of type string', function() {
      var boundCla6 = Cla6.bind(null, false);
      expect(boundCla6).to.throw(Error, 'name', 'string');
    });

    it('should throw an error if properties are not defined using an object', function() {
      var boundCla6 = Cla6.bind(null, 'Klass', false);
      expect(boundCla6).to.throw(Error, 'properties', 'object');
    });

    it('should throw an error if constructor is not a function', function() {
      var boundCla6 = Cla6.bind(null, 'Klass', {
        constructor: false
      });

      expect(boundCla6).to.throw(Error, 'constructor', 'function');
    });
  });

  describe('properties', function() {
    it('should create an empty class if no properties provided', function() {
      var Klass = Cla6('Klass', {});
      expect(Klass).to.be.a('function');
      expect(Klass.name).to.equal('Klass');
      expect(Klass.prototype).to.be.an.instanceOf(Object);
      expect(Klass.prototype.constructor).to.equal(Klass);
    });

    it('should create a class with the constructor provided', function() {
      var constructor = spy(function() {});

      var Klass = Cla6('Klass', {
        constructor: constructor
      });

      expect(Klass).to.be.a('function');
      expect(Klass.name).to.equal('Klass');
      expect(Klass.prototype).to.be.an.instanceOf(Object);
      expect(Klass.prototype.constructor).to.equal(Klass);
      
      new Klass(); 
      expect(constructor).to.have.been.called.once;
    });

    it('should create a class with the methods provided', function() {
      var method = spy(function() {});

      var Klass = Cla6('Klass', {
        method: method
      });

      expect(Klass).to.be.a('function');
      expect(Klass.name).to.equal('Klass');
      expect(Klass.prototype).to.be.an.instanceOf(Object);
      expect(Klass.prototype.constructor).to.equal(Klass);
      
      new Klass().method();
      expect(method).to.have.been.called.once;
    });

    it('should create a class with the accessors provided', function() {
      var getter = spy(function() {});
      var setter = spy(function() {});

      var Klass = Cla6('Klass', {
        get accessor() {
          getter();
        },

        set accessor(value) {
          setter(value);
        }
      });

      expect(Klass).to.be.a('function');
      expect(Klass.name).to.equal('Klass');
      expect(Klass.prototype).to.be.an.instanceOf(Object);
      expect(Klass.prototype.constructor).to.equal(Klass);

      var k = new Klass();
      k.accessor = k.accessor;
      expect(getter).to.have.been.called.once;
      expect(setter).to.have.been.called.once;
    });
  });
});