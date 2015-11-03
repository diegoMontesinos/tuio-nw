'use strict';

require('chai').should();
var Tuio = require('../index.js');
var tuioClient;

describe('Tuio.Client initialization', function () {
  it('should init with default params', function () {
    tuioClient = new Tuio.Client();

    tuioClient.host.should.equal('127.0.0.1');
    tuioClient.port.should.equal(3333);
  });

  it('should init with custom params', function () {
    tuioClient = new Tuio.Client({
      host: '10.0.0.15',
      port: 1234
    });

    tuioClient.host.should.equal('10.0.0.15');
    tuioClient.port.should.equal(1234);
  });
});
