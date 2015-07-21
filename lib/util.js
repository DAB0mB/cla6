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

var getParams = function(fn) {
  return fn.toString()
    .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'') // strip comments
    .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1] // get params
    .split(/,/); // split params
};

module.exports = {
  clone: clone,
  extend: extend,
  nameFn: nameFn,
  getParams: getParams
};