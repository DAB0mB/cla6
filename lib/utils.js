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