(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Cla6 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ClassFactory = require('./classFactory');
var Extender = require('./extender');
var PluginsManager = require('./pluginsManager');

var pack = require('../package.json');

function Cla6(name, props) {
  if (name == null)
    throwErr('a name must be provided');

  if (typeof name != 'string')
    throwErr('name must be a string');

  if (props == null)
    return new Extender(name);
  else
    return ClassFactory.create(name, props);
}

Cla6.version = pack.version;

Cla6.use = function(plugin) {
  PluginsManager.add(plugin, Cla6);
};

var throwErr = function(msg) {
  throw Error('Cla6 error - ' + msg);
};

module.exports = Cla6;
},{"../package.json":7,"./classFactory":2,"./extender":3,"./pluginsManager":5}],2:[function(require,module,exports){
var PluginsManager = require('./pluginsManager');
var Util = require('./util');

var create = function(name, props, Parent, mixins) {
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
    Klass[prop] = v;
  });
};

var throwErr = function(msg) {
  throw Error('Cla6 error - ' + msg);
};

module.exports = {
  create: create
};
},{"./pluginsManager":5,"./util":6}],3:[function(require,module,exports){
var ClassFactory = require('./classFactory');
var Mixer = require('./mixer');

var Extender = ClassFactory.create('Extender', {
  'constructor': function(name) {
    Mixer.call(this, name, Object);
  },

  'extend': function(Parent, props) {
    if (Parent == null)
      throwErr('a parent must be provided');

    if (typeof Parent != 'function')
      throwErr('parent must be a function');

    if (props == null)
      return new Mixer(this.name, Parent);
    else
      return ClassFactory.create(this.name, props, Parent);
  }

}, Mixer);

var throwErr = function(msg) {
  throw Error('Cla6 extension error - ' + msg);
};

module.exports = Extender;
},{"./classFactory":2,"./mixer":4}],4:[function(require,module,exports){
var ClassFactory = require('./classFactory');

var Mixer = ClassFactory.create('Mixer', {
  'constructor': function(name, Parent) {
    this.name = name;
    this.Parent = Parent;
  },

  'mixin': function() {
    var mixins = [].slice.call(arguments, 0, - 1);
    var props = arguments[arguments.length - 1];

    if (mixins.length == 0)
      throwErr('mixins must be provided');

    mixins.forEach(function(mixin) {
      if (typeof mixin != 'object')
        throwErr('all mixins must be objects');

      if (mixin.hasOwnProperty('constructor'))
        throwErr('constructor property is not allowed');
    });

    return ClassFactory.create(this.name, props, this.Parent, mixins);
  }
});

var throwErr = function(msg) {
  throw Error('Cla6 mixin error - ' + msg);
};

module.exports = Mixer;
},{"./classFactory":2}],5:[function(require,module,exports){
var Util = require('./util');

var plugins = [];

var add = function(plugin, Cla6) {
  if (plugin == null)
    throwErr('a plugin must be provided');

  if (typeof plugin != 'object')
    throwErr('plugin must be an object');

  if (typeof plugin.initialize == 'function')
    plugin.initialize(Cla6);

  return plugins.push(plugin);
};

var reset = function() {
  plugins.splice(0);
};

var manipulate = function(props, Parent) {
  Object.keys(plugins).filter(function(k) {
    return typeof plugins[k].manipulate == 'function';
  })
  .forEach(function(k) {
    plugins[k].manipulate(props, Parent);
  });
};

var throwErr = function(msg) {
  throw Error('Cla6 plugin error - ' + msg);
};

module.exports = {
  plugins: plugins,
  add: add,
  reset: reset,
  manipulate: manipulate
};
},{"./util":6}],6:[function(require,module,exports){
var clone = function(obj) {
  return extend({}, obj);
};

var extend = function(obj, extension) {
  return Object.keys(extension).reduce(function(obj, k) {
    obj[k] = extension[k];
    return obj;
  }, obj);
};

var nameFn = function(fn, name) {
  return eval('(function ' + name + '() {return fn.apply(this, arguments);})');
};

module.exports = {
  clone: clone,
  extend: extend,
  nameFn: nameFn
};
},{}],7:[function(require,module,exports){
module.exports={
  "name": "cla6",
  "description": "ES6 style class system",
  "version": "1.4.2",
  "main": "lib/cla6.js",
  "repository": {
    "type": "git",
    "url": "https://DAB0mB@github.com/DAB0mB/cla6.git"
  },
  "devDependencies": {
    "browserify": "~9.0.0",
    "chai": "~2.1.0",
    "mocha": "~2.1.0",
    "sinon": "~1.14.0",
    "uglify-js": "~2.4.0"
  },
  "engines": {
    "node": "~0.10.0"
  },
  "keywords": [
    "class",
    "es6"
  ]
}

},{}]},{},[1])(1)
});