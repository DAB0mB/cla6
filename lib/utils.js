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