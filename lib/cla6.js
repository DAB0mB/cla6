var _ = require('./utils');
var Extender = require('./extender');
var ClassFactory = require('./classFactory');
var PluginsManager = require('./pluginsManager');

function Cla6(name, props) {
  if (name == null)
    throwErr('a name must be provided');

  if (typeof name != 'string')
    throwErr('name must be a string');

  if (props != null) {
    if (typeof props != 'object')
      throwErr('properties must be defined using an object');
    
    if (props.hasOwnProperty('constructor') &&
        typeof props.constructor != 'function')
      throwErr('constructor must be a function');
  }

  if (props == null)
    return new Extender(name);
  else
    return ClassFactory.create(name, props);
}

Cla6.use = function(plugin) {
  if (plugin == null)
    throwPluginErr('a plugin must be provided');

  if (typeof plugin != 'object')
    throwPluginErr('plugin must be an object');

  if (plugin.manipulate == null)
    throwPluginErr('manipulator must be defined');

  if (typeof plugin.manipulate != 'function')
    throwPluginErr('manipulator must be a function');

  if (plugin.initialize != null &&
      typeof plugin.initialize != 'function')
    throwPluginErr('initializer must be a function');

  plugin = _.clone(plugin);

  if (plugin.initialize != null)
    plugin.initialize = plugin.initialize.bind(null, Cla6);

  PluginsManager.add(plugin);
};

var throwErr = function(msg) {
  throw Error('Cla6 error - ' + msg);
};

var throwPluginErr = function(msg) {
  throw Error('Cla6 plugin error - ' + msg);
};

module.exports = Cla6;