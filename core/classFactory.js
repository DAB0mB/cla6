var _ = require('./utils');

var createClass = function(name, props, Parent) {
  if (typeof Parent != 'function')
    Parent = Object;

  if (!props.hasOwnProperty('constructor'))
    props.constructor = function() {
      Parent.apply(this, arguments);
    };
  
  var fixedProps = getFixedProps(props);
  var Child = _.nameFn(props.constructor, name);

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

module.exports = {
  create: createClass
};