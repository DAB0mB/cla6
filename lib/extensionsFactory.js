var _ = require('./utils');
var PluginsManager = require('./pluginsManager');

var createExtensions = function(Parent) {
  var mixin = function(props) {
    if (arguments.length > 1) {
      Array.prototype.forEach.call(arguments, function(props) {
        this.mixin(props);
      }, this);

      return this;
    }

    if (props == null)
      throwErr('properties must be provided');

    if (typeof props != 'object')
      throwErr('properties must be defined using an object');

    descriptors = _.toDescriptors(props);
    PluginsManager.manipulate(descriptors, Parent);

    Object.defineProperties(this.prototype, descriptors);

    return this;
  };

  return {
    mixin: mixin
  };
};

var throwErr = function(msg) {
  throw Error('Cla6 mixin error - ' + msg);
};

module.exports = {
  create: createExtensions
};