# Cla6.js

Provides a class factory with additional functionality, like [`mixins`](#mixins) and [`plugins`](#plugins). Although originally designed for use with [Node.js](http://nodejs.org) and installable via `npm install cla6`,
it can also be used directly in the browser.

Cla6 is also installable via:

- [bower](http://bower.io/): `bower install cla6`

## Usage

Cla6 is super declerative and easy to understand. Here are few examples:

### Basic
```js
var Klass = Cla6('Klass', {
  'static lib': 'cla6',

  'constructor': function(foo, bar) {
    this.foo = foo;
    this.bar = bar;
  },

  'method': function() {
    return this.foo + this.bar;
  },

  'get accessor': function() {
    return this._private;
  },

  'set accessor': function(v) {
    this._private = v;
  },
});
```

### Inheritance
```js
var Parent = Cla6('Parent', {
  'constructor': function(foo, bar) {
    this.foo = foo;
    this.bar = bar;
  },

  'method': function() {
    return this.foo + this.bar;
  }
});

var Child = Cla6('Child').extend(Parent, {
  'constructor': function(foo, bar, baz) {
    Parent.call(this, foo, bar);
    this.baz = baz;
  },

  'method': function() {
    var result = Parent.prototype.method.apply(this, arguments);
    return result + this.baz;
  }
});
```

### Mixins
```js
var mixin1 = {
  method1: function() {
    return "mixin1";
  }
};

var mixin2 = {
  method2: function() {
    return "mixin2";
  }
};

var Mixed = Cla6('Mixed').mixin(mixin1, mixin2, {
  method3: function() {
    return this.method1() + this.method2() + "method3";
  }
});
```

## Why Use It

- Easy to use
- Easy to read
- Highliy compatible
- Defines classes *THE RIGHT WAY*

Unlike classic class definition, Cla6 defines unenumerable peroperties, just like native classes:

```js
// Classic class definition

function Klass() {
  this.foo = 'foo';
  this.bar = 'bar';
}

Klass.prototype.constructor = Klass;

Klass.prototype.baz = function() {
  return 'baz';
};

var instance = new Klass();
var keys = Object.keys(instance);
console.log(keys); // foo, bar, baz

// Cla6 class definition

var Klass = Cla6('Klass', {
  constructor: function() {
    this.foo = 'foo';
    this.bar = 'bar';
  },

  baz: function() {
    return 'baz';
  }
});

var instance = new Klass();
var keys = Object.keys(instance);
console.log(keys); // foo, bar
```

## Plugins

A plugin is a module which adds functionality to Cla6 and can be loaded dynamcally.

Multipile plugins can be applied and will be called by their order of use:

```js
Cla6.use(plugin);
```

The official plugins currently available are:

- [cla6-base](https://github.com/DAB0mB/cla6-base)
- [cla6-hidden](https://github.com/DAB0mB/cla6-hidden)

### Building a plugin

A basic plugin stracture should look like so:

```js
var initialize = function(Cla6) {
  // initializer logic
};

var manipulate = function(descriptors, Parent) {
  // manipulator logic
};

module.exports = {
  initialize: initialize,
  manipulate: manipulate
};
```

- `initialize` - An optional initializer function which will be called with Cla6 instance once the plugin is used.
- `manipulate` - A required manipulator function which will be called class creation with its properties and Parent class.

## Download

The source is available for download from
[GitHub](http://github.com/DAB0mB/cla6).
Alternatively, you can install using Node Package Manager (`npm`):

    npm install cla6