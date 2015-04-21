var Chai = require('chai');
var ChaiSpies = require('chai-spies');

// plugins
Chai.use(ChaiSpies);

// tests
require('./cla6');
require('./extender');
require('./plugins');
require('./mixins');