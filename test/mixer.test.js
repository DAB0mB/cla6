var Chai = require('chai');
var Sinon = require('sinon');

var ClassFactory = require('../lib/classFactory');
var Mixer = require('../lib/mixer');

var expect = Chai.expect;
var spy = Sinon.spy;

describe('Mixer', function() {
  before(function() {
    this.mixer = new Mixer('Child', Object);
  });

  describe('#mixin()', function() {
    before(function() {
      spy(ClassFactory, 'create');
    });

    afterEach(function() {
      ClassFactory.create.reset();
    });

    after(function() {
      ClassFactory.create.restore();
    });

    it('should throw an error if mixins are not provided', function() {
      expect(this.mixer.mixin).to.throw(Error, /mixins/);
    });

    it('should throw an error if not all mixins are objects', function() {
      var boundMixin = this.mixer.mixin.bind(this.mixer, {}, false, {});
      expect(boundMixin).to.throw(Error, /mixins.*objects/);
    });

    it('should throw an error if constructor is defined', function() {
      var mixin = {
        'constructor': function() {}
      };

      var boundMixin = this.mixer.mixin.bind(this.mixer, mixin, {});
      expect(boundMixin).to.throw(Error, /constructor/);
    });

    it('should create a mixed class', function() {
      var props = {};
      var mixin1 = {};
      var mixin2 = {};
      var args = [this.mixer.name, props, this.mixer.Parent, [mixin1, mixin2]];

      this.mixer.mixin(mixin1, mixin2, props);
      expect(ClassFactory.create.calledOnce).to.be.true;
      expect(ClassFactory.create.getCall(0).args).to.deep.equal(args);
    });
  });
});