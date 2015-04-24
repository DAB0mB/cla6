var clone = function(obj) {
  return extend({}, obj);
};

var extend = function(obj, extension) {
  return Object.keys(extension).reduce(function(result, k) {
    var descriptor = Object.getOwnPropertyDescriptor(extension, k);
    return Object.defineProperty(result, k, descriptor);
  }, obj);
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