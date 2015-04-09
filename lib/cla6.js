(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Cla6 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var _ = require('./utils');
var Extender = require('./extender');

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
    return _.createClass(name, props);
}

var throwErr = function(msg) {
  throw Error('Cla6 error - ' + msg);
};

module.exports = Cla6;
},{"./extender":2,"./utils":3}],2:[function(require,module,exports){
var _ = require('./utils');

var Extender = _.createClass('Extender', {
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

    return _.createClass(this.name, props, Parent);
  }
});

var throwErr = function(msg) {
  throw Error('Cla6 extension error - ' + msg);
};

module.exports = Extender;
},{"./utils":3}],3:[function(require,module,exports){
var createClass = function(name, props, Parent) {
  if (typeof Parent != 'function')
    Parent = Object;

  var constructor = props.constructor;

  if (!props.hasOwnProperty('constructor'))
    constructor = function() {
      Parent.apply(this, arguments);
    };

  var Child = nameFn(constructor, name);
  
  var fixedProps = Object.keys(props).reduce(function(result, k) {
    if (k == 'constructor')
      return result;

    var descriptor = Object.getOwnPropertyDescriptor(props, k);
    delete descriptor.enumerable;

    if (descriptor.value == null)
      delete descriptor.writable;

    result[k] = descriptor;
    return result;
  }, {
    'constructor': {
      configurable: true,
      writable: true,
      value: Child
    }
  });

  Child.prototype = Object.create(Parent.prototype, fixedProps);
  return Child;
};

var nameFn = function(func, name) {
  return eval('(function ' + name + '() {return func.apply(this, arguments);})');
};

module.exports = {
  createClass: createClass,
  nameFn: nameFn
};
},{}]},{},[1])(1)
});