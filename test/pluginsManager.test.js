var Chai = require('chai');
var Sinon = require('sinon');

var PluginsManager = require('../lib/pluginsManager');

var expect = Chai.expect;
var spy = Sinon.spy;

describe('PluginsManager', function() {
  before(function() {
    this.plugin = {
      name: 'testPlugin',
      provider: {},
      initialize: spy(),
      manipulate: spy()
    };
  });

  afterEach(function() {
    this.plugin.initialize.reset();
    this.plugin.manipulate.reset();
    PluginsManager.reset();
  });

  describe('add()', function() {
    it('should throw an error if a plugin is not provided', function() {
      expect(PluginsManager.add).to.throw(Error, /plugin/);
    });

    it('should throw an error if plugin is not an object', function() {
      boundAdd = PluginsManager.add.bind(PluginsManager, false);
      expect(boundAdd).to.throw(Error, /plugin.*object/);
    });

    it('should call plugin initializer with one arg', function() {
      var arg1 = {};
      var args = [arg1];

      PluginsManager.add(this.plugin, arg1, {});
      expect(this.plugin.initialize.calledOnce).to.be.true;
      expect(this.plugin.initialize.getCall(0).args).to.deep.equal(args);
    });
  });

  describe('manipulate()', function() {
    it('should call all plugins manipulators with two args', function() {
      var arg1 = {};
      var arg2 = {};
      var args = [arg1, arg2];

      PluginsManager.add(this.plugin);
      PluginsManager.add(this.plugin);
      PluginsManager.add(this.plugin);
      PluginsManager.manipulate(arg1, arg2, {});

      expect(this.plugin.manipulate.callCount).to.equal(3);
      expect(this.plugin.manipulate.getCall(0).args).to.deep.equal(args);
      expect(this.plugin.manipulate.getCall(1).args).to.deep.equal(args);
      expect(this.plugin.manipulate.getCall(2).args).to.deep.equal(args);
    });
  });

  describe('getProvider()', function() {
    it('should get provider by plugin name', function() {
      PluginsManager.add({});
      PluginsManager.add(this.plugin);
      PluginsManager.add({});

      var provider = PluginsManager.getProvider('testPlugin');
      expect(provider).to.equal(this.plugin.provider);
    });
  });
});