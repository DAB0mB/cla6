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