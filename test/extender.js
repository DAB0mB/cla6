var Chai = require('chai');
var Cla6 = require('..');

var expect = Chai.expect;
var spy = Chai.spy;

describe('Cla6', function() {
  describe('extender', function() {
    it('should return an extender if only a name is provided', function() {
      var extender = Cla6('Child');
      expect(extender.extend).to.be.exist;
    });

    describe('validations', function() {
      it('should throw an error if a parent is not provided', function() {
        var extend = Cla6('Child').extend;
        expect(extend).to.throw(Error, 'parent');
      });

      it('should throw an error if parent is not a function', function() {
        var extend = Cla6('Child').extend.bind(null, false);
        expect(extend).to.throw(Error, 'parent', 'function');
      });

      it('should throw an error if properties are not provided', function() {
        var Parent = getParent();
        var extend = Cla6('Child').extend.bind(null, Parent);
        expect(extend).to.throw(Error, 'properties');
      });

      it('should throw an error if properties are not defined using an object', function() {
        var Parent = getParent();
        var extend = Cla6('Child').extend.bind(null, Parent, false);
        expect(extend).to.throw(Error, 'properties', 'object');
      });

      it('should throw an error if constructor is not a function', function() {
        var Parent = getParent();
        
        var extend = Cla6('Child').extend.bind(null, Parent, {
          constructor: false
        });

        expect(extend).to.throw(Error, 'constructor', 'function');
      });
    });

    describe('inheritance', function() {
      it('should return a child class', function() {
        var Parent = getParent();
        var Child = Cla6('Child').extend(Parent, {});

        expect(Child).to.be.a('function');
        expect(Child.name).to.equal('Child');
        expect(Child.prototype).to.be.an.instanceOf(Parent);
        expect(Child.prototype.constructor).to.equal(Child);
      });

      it('should call parent\'s constructor if not defined', function() {
        var parentCtor = spy(Parent);
        
        var Parent = getParent({
          constructor: parentCtor
        });
        
        var Child = Cla6('Child').extend(Parent, {});

        expect(Child).to.be.a('function');
        expect(Child.name).to.equal('Child');
        expect(Child.prototype).to.be.an.instanceOf(Parent);
        expect(Child.prototype.constructor).to.equal(Child);

        new Child();
        expect(parentCtor).to.have.been.called.once;
      });
    });
  });
});

var getParent = function(props) {
  if (props == null)
    props = {};
  
  return Cla6('Parent', props);
};