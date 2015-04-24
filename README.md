# Cla6.js

Provides a class factory with additional functionality, like [`mixins`](#mixins) and [`plugins`](#plugins). Although originally designed for use with [Node.js](http://nodejs.org) and installable via `npm install cla6`,
it can also be used directly in the browser.

Cla6 is also installable via:

- [bower](http://bower.io/): `bower install cla6`

## Basic Example

```js
var Cla6 = require('cla6');

var Parent = Cla6('Parent', {
  constructor: function() {
    console.log('parent constructor');
  },

  parentMethod: function() {
    console.log('parent method');
  }
});

var Child = Cla6('Child').extend(Parent, {
  childMethod: function() {
    this.parentMethod();
    console.log('child method');
  },

  get accessor() {
    console.log('child getter');
  },

  set accessor(value) {
    console.log('child setter');
  }
});

child = new Child(); // parent constructor
child.childMethod(); // parent method, child method
child.accessor = child.accessor; // child getter, child setter
```

## Why Use It

- Easy to use
- Easy to read
- Highliy compatible
- Defines classes *THE RIGHT WAY*

Unlike classic class definition, Cla6 defines unenumerable prototype properties:

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

// prints foo, bar, baz
for (var k in instance)
  console.log(k);

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

// prints foo, bar
for (var k in instance)
  console.log(k);
```

## Mixins

Each class created by Cla6 can be extended using a mixin. Mixins can be applied at class creation or during run time.

```js
var mixin1 = {
  method1: function() {
    console.log('mixin1');
  }
};

var mixin2 = {
  method2: function() {
    console.log('mixin2');
  }
};

var mixin3 = {
  method3: function() {
    console.log('mixin3');
  }
};

var Klass = Cla6('Klass', {
  constructor: function() {
    console.log("klass");
  },
}).mixin(mixin1, mixin2);

Klass.mixin(mixin3);

var obj = new Klass(); // klass
obj.method1(); // mixin1
obj.method2(); // mixin2
obj.method3(); // mixin3
```

## Plugins

A Cla6 plugin is a manupulation function which gets the classe's descriptors and parent anytime before it gets created, thus the properties can be manipulated. Multipile plugins can be applied and will be called by their use order.  

Note, each plugin will affect the descriptors object for the next plugin in the plugins chain.

```js
Cla6.use(plugin);
```

The official plugins currently available are:

- [cla6-base](https://github.com/DAB0mB/cla6-base)
- [cla6-hidden](https://github.com/DAB0mB/cla6-hidden)

## Download

The source is available for download from
[GitHub](http://github.com/DAB0mB/cla6).
Alternatively, you can install using Node Package Manager (`npm`):

    npm install cla6