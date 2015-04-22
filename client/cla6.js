(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Cla6 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Extender = require('./extender');
var ClassFactory = require('./classFactory');
var PluginsManager = require('./pluginsManager');

function Cla6(name, props) {
  if (name == null)
    throwErr('a name must be provided');

  if (typeof name != 'string')
    throwErr('name must be a string');

  if (props != null) {
    if (typeof props != 'object')
      throwErr('properties must be defined using an object');
    
    if (props.hasOwnProperty('constructor') &&
        typeof props.constructor != 'function')
      throwErr('constructor must be a function');
  }

  if (props == null)
    return new Extender(name);
  else
    return ClassFactory.create(name, props);
}

Cla6.use = function(plugin) {
  if (plugin == null)
    throwErr('a plugin must be provided');

  if (typeof plugin != 'function')
    throwErr('plugin must be a function');

  PluginsManager.add(plugin);
};

var throwErr = function(msg) {
  throw Error('Cla6 error - ' + msg);
};

module.exports = Cla6;
},{"./classFactory":2,"./extender":3,"./pluginsManager":5}],2:[function(require,module,exports){
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
},{"./extensionsFactory":4,"./pluginsManager":5,"./utils":6}],3:[function(require,module,exports){
var ClassFactory = require('./classFactory');

var Extender = ClassFactory.create('Extender', {
  constructor: function(name) {
    this.name = name;
  },

  extend: function(Parent, props) {
    if (Parent == null)
      throwErr('a parent must be provided');

    if (typeof Parent != 'function')
      throwErr('parent must be a function');

    if (props == null)
      throwErr('properties must be provided');

    if (typeof props != 'object')
      throwErr('properties must be defined using an object');

    if (props.hasOwnProperty('constructor') &&
        typeof props.constructor != 'function')
      throwErr('constructor must be a function');

    return ClassFactory.create(this.name, props, Parent);
  }
});

var throwErr = function(msg) {
  throw Error('Cla6 extension error - ' + msg);
};

module.exports = Extender;
},{"./classFactory":2}],4:[function(require,module,exports){
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
},{"./pluginsManager":5,"./utils":6}],5:[function(require,module,exports){
var plugins = [];

var add = function(plugin) {
  plugins.push(plugin);
};

var remove = function(plugin) {
  var index = plugins.indexOf(plugin);
  plugins.splice(index, 1);
};

var manipulate = function(descriptors, Parent) {
  plugins.forEach(function(plugin) {
    plugin(descriptors, Parent);
  });
};

module.exports = {
  add: add,
  remove: remove,
  manipulate: manipulate
};
},{}],6:[function(require,module,exports){
var clone = function(obj) {
  return Object.keys(obj).reduce(function(result, k) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, k);
    return Object.defineProperty(result, k, descriptor);
  }, {});
};

var extend = function(obj, extension) {
  Object.keys(extension).forEach(function(k) {
    obj[k] = extension[k];
  });
};

var nameFn = function(fn, name) {
  return eval('(function ' + name + '() {return fn.apply(this, arguments);})');
};

var toDescriptors = function(props) {
  return Object.keys(props).reduce(function(result, k) {
    var descriptor = Object.getOwnPropertyDescriptor(props, k);
    delete descriptor.enumerable;

    if (descriptor.value == null)
      delete descriptor.writable;

    result[k] = descriptor;
    return result;
  }, {});
};

module.exports = {
  clone: clone,
  extend: extend,
  nameFn: nameFn,
  toDescriptors: toDescriptors
};
},{}]},{},[1])(1)
});