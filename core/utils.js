var clone = function(obj) {
  return Object.keys(obj).reduce(function(result, k) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, k);
    return Object.defineProperty(result, k, descriptor);
  }, {});
};

var nameFn = function(fn, name) {
  return eval('(function ' + name + '() {return fn.apply(this, arguments);})');
};

module.exports = {
  clone: clone,
  nameFn: nameFn
};