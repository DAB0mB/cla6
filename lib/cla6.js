var _ = require('./utils');

function Cla6(name, props) {
  if (name == null)
    throw Error('Cla6 error - a name must be provided');

  if (typeof name != 'string')
    throw Error('Cla6 error - name must be a string');

  if (props != null) {
    if (typeof props != 'object')
      throw Error('Cla6 error - properties must be defined using an object');
    
    if (props.hasOwnProperty('constructor') &&
        typeof props.constructor != 'function')
      throw Error('Cla6 error - constructor must be a function');
  }

  if (props == null)
    return new Extender(name);
  else
    return _.createClass(name, props);
}

var Extender = _.createClass('Extender', {
  constructor: function(name) {
    this.name = name;
  },

  extend: function(Parent, props) {
    if (Parent == null)
      throw Error('Cla6 extension error - a parent must be provided');

    if (typeof Parent != 'function')
      throw Error('Cla6 extension error - parent must be a function');

    if (props == null)
      throw Error('Cla6 extension error - properties must be provided');

    if (typeof props != 'object')
      throw Error('Cla6 extension error - properties must be defined using an object');

    if (props.hasOwnProperty('constructor') &&
        typeof props.constructor != 'function')
      throw Error('Cla6 extension error - constructor must be a function');

    return _.createClass(this.name, props, Parent);
  }
});

module.exports = Cla6;