var ClassFactory = require('./classFactory');

var Mixer = ClassFactory.create('Mixer', {
  'constructor': function(name, Parent) {
    this.name = name;
    this.Parent = Parent;
  },

  'mixin': function() {
    var mixins = [].slice.call(arguments, 0, - 1);
    var props = arguments[arguments.length - 1];

    if (mixins.length == 0)
      throwErr('mixins must be provided');

    mixins.forEach(function(mixin) {
      if (typeof mixin != 'object')
        throwErr('all mixins must be objects');

      if (mixin.hasOwnProperty('constructor'))
        throwErr('constructor property is not allowed');
    });

    return ClassFactory.create(this.name, props, this.Parent, mixins);
  }
});

var throwErr = function(msg) {
  throw Error('Cla6 mixin error - ' + msg);
};

module.exports = Mixer;