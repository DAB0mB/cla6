var ClassFactory = require('./classFactory');
var Mixer = require('./mixer');

var Extender = ClassFactory.create('Extender', {
  'constructor': function(name) {
    Mixer.call(this, name, Object);
  },

  'extend': function(Parent, props) {
    if (Parent == null)
      throwErr('a parent must be provided');

    if (typeof Parent != 'function')
      throwErr('parent must be a function');

    if (props == null)
      return new Mixer(this.name, Parent);
    else
      return ClassFactory.create(this.name, props, Parent);
  }

}, Mixer);

var throwErr = function(msg) {
  throw Error('Cla6 extension error - ' + msg);
};

module.exports = Extender;