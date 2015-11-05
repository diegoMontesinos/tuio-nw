'use strict';

require('chai').should();
var Tuio = require('../index.js');

describe('Tuio.Container initialization', function () {
  it('should init with session id and position', function () {
    var container = new Tuio.Container({
      si: 1,
      xp: 10,
      yp: 20
    });

    var si = container.getSessionId();
    si.should.equal(1);

    var x = container.getX();
    x.should.equal(10);
    var y = container.getY();
    y.should.equal(20);

    var xspeed = container.getXSpeed();
    xspeed.should.equal(0);
    var yspeed = container.getXSpeed();
    yspeed.should.equal(0);

    var speed = container.getMotionSpeed();
    speed.should.equal(0);
    var accel = container.getMotionAccel();
    accel.should.equal(0);

    var path = container.getPath();
    path.length.should.equal(1);

    var state = container.getTuioState();
    state.should.equal(Tuio.Container.TUIO_ADDED);
  });
});

