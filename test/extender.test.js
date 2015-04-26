var Chai = require('chai');
var Sinon = require('sinon');

var ClassFactory = require('../lib/classFactory');
var Extender = require('../lib/extender');
var Mixer = require('../lib/mixer');

var expect = Chai.expect;
var spy = Sinon.spy;

describe('Extender', function() {
  before(function() {
    this.extender = new Extender('Child');
  });

  describe('#extend()', function() {
    before(function() {
      spy(ClassFactory, 'create');
    });

    afterEach(function() {
      ClassFactory.create.reset();
    });

    after(function() {
      ClassFactory.create.restore();
    });

    it('should throw an error if a parent is not provided', function() {
      expect(this.extender.extend).to.throw(Error, /parent/);
    });

    it('should throw an error if parent is not a function', function() {
      var boundExtend = this.extender.extend.bind(this.extender, false);
      expect(boundExtend).to.throw(Error, /parent.*function/);
    });

    it('should return a mixer if properties were not provided', function() {
      var Parent = function() {};
      var mixer = this.extender.extend(Parent);

      expect(mixer).to.be.an.instanceof(Mixer);
      expect(mixer.name).to.equal(this.extender.name);
      expect(mixer.Parent).to.equal(Parent);
    });

    it('should create a child class if properties were provided', function() {
      var props = {};
      var Parent = function() {};
      var args = [this.extender.name, props, Parent];

      this.extender.extend(Parent, props);
      expect(ClassFactory.create.calledOnce).to.be.true;
      expect(ClassFactory.create.getCall(0).args).to.deep.equal(args);
    });

  });
});