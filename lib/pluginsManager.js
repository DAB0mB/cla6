var plugins = [];

var add = function(plugin) {
  if (plugin.initialize != null)
    plugin.initialize();

  plugins.push(plugin);
};

var remove = function(plugin) {
  var index = plugins.indexOf(plugin);
  plugins.splice(index, 1);
};

var manipulate = function(descriptors, Parent) {
  plugins.forEach(function(plugin) {
    plugin.manipulate(descriptors, Parent);
  });
};

module.exports = {
  add: add,
  remove: remove,
  manipulate: manipulate
};