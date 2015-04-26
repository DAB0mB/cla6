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