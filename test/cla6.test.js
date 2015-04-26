var Chai = require('chai');
var Sinon = require('sinon');

var Cla6 = require('..');
var ClassFactory = require('../lib/classFactory');
var Extender = require('../lib/extender');
var PluginsManager = require('../lib/pluginsManager');

var expect = Chai.expect;
var spy = Sinon.spy;

describe('Cla6', function() {
  before(function() {
    spy(ClassFactory, 'create');
  });

  afterEach(function() {
    ClassFactory.create.reset();
  });

  after(function() {
    ClassFactory.create.restore();
  });

  it('should throw an error if a name is not provided', function() {
    expect(Cla6).to.throw(Error, /name/);
  });

  it('should throw an error if name is not a string', function() {
    boundCla6 = Cla6.bind(null, false);
    expect(boundCla6).to.throw(Error, /name.*string/);
  });

  it('should return an extender if properties were not provided', function() {
    var extender = Cla6('Klass');
    expect(extender).to.be.an.instanceof(Extender);
    expect(extender.name).to.equal('Klass');
  });

  it('should create a class if properties were provided', function() {
    var name = 'Klass';
    var props = {};
    var args = [name, props];

    Cla6(name, props);
    expect(ClassFactory.create.calledOnce).to.be.true;
    expect(ClassFactory.create.getCall(0).args).to.deep.equal(args);
  });

  describe('use()', function() {
    var addPlugin = PluginsManager.add;

    before(function() {
      PluginsManager.add = spy(addPlugin);
    });

    afterEach(function() {
      PluginsManager.add.reset();
      PluginsManager.reset();
    });

    after(function() {
      PluginsManager.add = addPlugin;
    });

    it('should add plugin', function() {
      var plugin = {};
      Cla6.use(plugin);

      expect(PluginsManager.add.calledOnce).to.be.true;
      expect(PluginsManager.add.getCall(0).args[0]).to.equal(plugin);
    });

    it('should call plugin initializer with cla6 instance', function() {
      var plugin = {
        initialize: spy()
      };

      Cla6.use(plugin);
      expect(plugin.initialize.calledOnce).to.be.true;
      expect(plugin.initialize.getCall(0).args[0]).to.equal(Cla6);
    });
  });
});