var _ = require('./utils');

var plugins = [];

var createClass = function(name, props, Parent) {
  props = _.clone(props);

  if (typeof Parent != 'function')
    Parent = Object;

  if (!props.hasOwnProperty('constructor'))
    props.constructor = function() {
      Parent.apply(this, arguments);
    };

  var fixedProps = getFixedProps(props);
  applyPlugins(fixedProps);

  var Child = _.nameFn(fixedProps.constructor.value, name);
  fixedProps.constructor.value = Child;

  Child.prototype = Object.create(Parent.prototype, fixedProps);
  return Child;
};

var getFixedProps = function(props) {
  return Object.keys(props).reduce(function(result, k) {
    var descriptor = Object.getOwnPropertyDescriptor(props, k);
    delete descriptor.enumerable;

    if (descriptor.value == null)
      delete descriptor.writable;

    result[k] = descriptor;
    return result;
  }, {});
};

var addPlugin = function(plugin) {
  plugins.push(plugin);
};

var applyPlugins = function(props) {
  plugins.forEach(function(plugin) {
    plugin(props);
  });
};

module.exports = {
  create: createClass,
  use: addPlugin
};