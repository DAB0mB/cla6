var _ = require('./utils');
var Extender = require('./extender');

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
    return _.createClass(name, props);
}

var throwErr = function(msg) {
  throw Error('Cla6 error - ' + msg);
};

module.exports = Cla6;