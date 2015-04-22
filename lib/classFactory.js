var _ = require('./utils');
var ExtensionsFactory = require('./extensionsFactory');
var PluginsManager = require('./pluginsManager');

var createClass = function(name, props, Parent) {
  props = _.clone(props);

  if (typeof Parent != 'function')
    Parent = Object;

  if (!props.hasOwnProperty('constructor'))
    props.constructor = function() {
      Parent.apply(this, arguments);
    };

  var descriptors = _.toDescriptors(props);
  PluginsManager.manipulate(descriptors, Parent);

  var Child = _.nameFn(descriptors.constructor.value, name);
  var extensions = ExtensionsFactory.create(Parent);
  _.extend(Child, extensions);

  descriptors.constructor.value = Child;
  Child.prototype = Object.create(Parent.prototype, descriptors);

  return Child;
};

module.exports = {
  create: createClass
};