var _ = require('./utils');

var plugins = [];

var classExtensions = {
  mixin: function(props) {
    if (arguments.length > 1) {
      Array.prototype.forEach.call(arguments, function(props) {
        this.mixin(props);
      }, this);

    } else {
      if (props == null)
        throwErr('properties must be provided');

      if (typeof props != 'object')
        throwErr('properties must be defined using an object');

      descriptors = _.toDescriptors(props);
      applyPlugins(descriptors);

      Object.defineProperties(this.prototype, descriptors);
    }

    return this;
  }
};

var createClass = function(name, props, Parent) {
  props = _.clone(props);

  if (typeof Parent != 'function')
    Parent = Object;

  if (!props.hasOwnProperty('constructor'))
    props.constructor = function() {
      Parent.apply(this, arguments);
    };

  var descriptors = _.toDescriptors(props);
  applyPlugins(descriptors);

  var Child = _.nameFn(descriptors.constructor.value, name);
  _.extend(Child, classExtensions);

  descriptors.constructor.value = Child;
  Child.prototype = Object.create(Parent.prototype, descriptors);

  return Child;
};

var addPlugin = function(plugin) {
  plugins.push(plugin);
};

var removePlugin = function(plugin) {
  var index = plugins.indexOf(plugin);
  plugins.splice(index, 1);
};

var applyPlugins = function(descriptors) {
  plugins.forEach(function(plugin) {
    plugin(descriptors);
  });
};

var throwErr = function(msg) {
  throw Error('Cla6 Class error - ' + msg);
};

module.exports = {
  create: createClass,
  use: addPlugin,
  unuse: removePlugin
};