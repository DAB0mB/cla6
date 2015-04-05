# Cla6.js
ES6 style class system

## Example
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

Unlike classic class definition, Cla6 defines unenumerable prototype properties
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

## Download
The source is available for download from
[GitHub](http://github.com/DAB0mB/cla6).
Alternatively, you can install using Node Package Manager (`npm`):

    npm install cla6