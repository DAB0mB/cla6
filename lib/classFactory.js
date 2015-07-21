var PluginsManager = require('./pluginsManager');
var Util = require('./util');

var create = function(name, props, Parent, mixins) {
  if (typeof props == 'function')
    props = injectProviders(props);

  if (typeof props != 'object')
    throwErr('properties must be defined using an object');

  if (props.hasOwnProperty('constructor') &&
      typeof props.constructor != 'function')
    throwErr('constructor must be a function');

  if (mixins == null)
    mixins = [];

  props = mixins.reduce(function(props, mixin) {
    return Util.extend(props, mixin);
  }, Util.clone(props));

  if (typeof Parent != 'function')
    Parent = Object;

  if (!props.hasOwnProperty('constructor'))
    props.constructor = function() {
      Parent.apply(this, arguments);
    };

  PluginsManager.manipulate(props, Parent);
  props.constructor = Util.nameFn(props.constructor, name);

  var Child = props.constructor;
  var descriptors = generateDescriptors(props);

  Child.prototype = Object.create(Parent.prototype, descriptors);
  defineStatics(Child, props);
  return Child;
};

var injectProviders = function(fn) {
  var providers = Util.getParams(fn).map(PluginsManager.getProvider);
  return fn.apply(null, providers);
};

var generateDescriptors = function(props) {
  var descriptors = {};
  defineValues(descriptors, props);
  defineAccesstors(descriptors, props);
  return descriptors;
};

var defineValues = function(descriptors, props) {
  Object.keys(props).filter(function(k) {
    return k.split(' ').length == 1;
  })
  .forEach(function(k) {
    var v = props[k];

    descriptors[k] = {
      configurable: true,
      writable: true,
      value: v
    };
  });
};

var defineAccesstors = function(descriptors, props) {
  Object.keys(props).filter(function(k) {
    var method = k.split(' ')[0];

    return method == 'get' ||
           method == 'set';
  })
  .forEach(function(k) {
    var v = props[k];
    var split = k.split(' ');
    var method = split[0];
    var prop = split[1];
    var descriptor = descriptors[prop];

    if (descriptor == null) {
      descriptor = {
        configurable: true
      };

      descriptors[prop] = descriptor;
    }

    descriptor[method] = v;
  });
};

var defineStatics = function(Klass, props) {
  Object.keys(props).filter(function(k) {
    return k.split(' ')[0] == 'static';
  })
  .forEach(function(k) {
    var v = props[k];
    var prop = k.split(' ')[1];

    Object.defineProperty(Klass, prop, {
      configurable: true,
      writable: true,
      value: v
    });
  });
};

var throwErr = function(msg) {
  throw Error('Cla6 error - ' + msg);
};

module.exports = {
  create: create
};