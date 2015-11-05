'use strict';

var Tuio = require('./lib/tuio');
require('./lib/tuio-time')(Tuio);
require('./lib/tuio-point')(Tuio);
require('./lib/tuio-container')(Tuio);
require('./lib/tuio-cursor')(Tuio);
require('./lib/tuio-object')(Tuio);
require('./lib/tuio-client')(Tuio);

module.exports = Tuio;
