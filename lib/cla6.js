var ClassFactory = require('./classFactory');
var Extender = require('./extender');
var PluginsManager = require('./pluginsManager');

var pack = require('../package.json');

function Cla6(name, props) {
  if (name == null)
    throwErr('a name must be provided');

  if (typeof name != 'string')
    throwErr('name must be a string');

  if (props == null)
    return new Extender(name);
  else
    return ClassFactory.create(name, props);
}

Cla6.version = pack.version;

Cla6.use = function(plugin) {
  PluginsManager.add(plugin, Cla6);
};

var throwErr = function(msg) {
  throw Error('Cla6 error - ' + msg);
};

module.exports = Cla6;