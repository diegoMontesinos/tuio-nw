'use strict';

var Tuio = require('./lib/tuio');
require('./lib/tuio-time')(Tuio, Tuio._);
require('./lib/tuio-point')(Tuio, Tuio._);
require('./lib/tuio-container')(Tuio, Tuio._);
require('./lib/tuio-cursor')(Tuio, Tuio._);
require('./lib/tuio-object')(Tuio, Tuio._);
require('./lib/tuio-client')(Tuio, Tuio._);

module.exports = Tuio;
