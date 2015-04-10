var createClass = function(name, props, Parent) {
  if (typeof Parent != 'function')
    Parent = Object;

  var ctor = props.constructor;

  if (!props.hasOwnProperty('constructor'))
    ctor = function() {
      Parent.apply(this, arguments);
    };

  var Child = nameFn(ctor, name);
  
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

var nameFn = function(fn, name) {
  return eval('(function ' + name + '() {return fn.apply(this, arguments);})');
};

module.exports = {
  create: createClass
};