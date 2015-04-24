var _ = require('./utils');
var PluginsManager = require('./pluginsManager');

var createExtension = function(Parent) {
  var mixin = function(props) {
    if (arguments.length > 1) {
      Array.prototype.forEach.call(arguments, function(props) {
        this.mixin(props);
      }, this);

    } else {
      if (props == null)
        throwMixinErr('properties must be provided');

      if (typeof props != 'object')
        throwMixinErr('properties must be defined using an object');

      descriptors = _.toDescriptors(props);
      PluginsManager.manipulate(descriptors, Parent);
      Object.defineProperties(this.prototype, descriptors);
    }

    return this;
  };

  return {
    mixin: mixin
  };
};

var throwMixinErr = function(msg) {
  throw Error('Cla6 mixin error - ' + msg);
};

module.exports = {
  create: createExtension
};