'use strict';

// TuioCursor Events -> Touch Events
(function (window, document, exportName) {

  var cursors = {};
  var cursorsElements = {};

  var drawCursors_ = false;
  var callbacks;

  var TuioTouch = {
    cursorCSS: function (touch) {
      var size = 30;
      var pX = touch.clientX - (size / 2);
      var pY = touch.clientY - (size / 2);
      var transform = 'translate(' + pX + 'px, ' + pY + 'px)';

      return {
        position: 'fixed',
        left: 0,
        top: 0,
        background: '#fff',
        border: 'solid 1px #999',
        opacity: 0.6,
        borderRadius: '100%',
        height: size + 'px',
        width: size + 'px',
        padding: 0,
        margin: 0,
        display: 'block',
        overflow: 'hidden',
        pointerEvents: 'none',
        webkitUserSelect: 'none',
        mozUserSelect: 'none',
        userSelect: 'none',
        webkitTransform: transform,
        mozTransform: transform,
        transform: transform,
        zIndex: 100
      };
    },
    init: function (tuioClient) {
      if (!tuioClient) {
        throw new Error('tuioClient is required');
      }

      callbacks = tuioClient._callbacks;

      tuioClient.on('listening', function () {
        if (callbacks && callbacks.listening) {
          callbacks.listening.next.callback();
        }

        tuioClient.on('addTuioCursor', onTuioCursor('touchstart'));
        tuioClient.on('updateTuioCursor', onTuioCursor('touchmove'));
        tuioClient.on('removeTuioCursor', onTuioCursor('touchend'));

        window.addEventListener('touchstart', showCursors, true);
        window.addEventListener('touchmove', showCursors, true);
        window.addEventListener('touchend', showCursors, true);
      });
    },
    drawCursors: function (drawCursors) {
      drawCursors_ = drawCursors;
    }
  };

  function showCursors(ev) {
    if (drawCursors_) {
      var touch, i, el, styles;

      for (i = 0; i < ev.touches.length; i++) {
        touch = ev.touches[i];
        el = cursorsElements[touch.identifier];
        if (!el) {
          el = cursorsElements[touch.identifier] = document.createElement('div');
          document.body.appendChild(el);
        }

        styles = TuioTouch.cursorCSS(touch);
        for (var prop in styles) {
          el.style[prop] = styles[prop];
        }
      }

      // remove all ended touches
      if (ev.type === 'touchend' || ev.type === 'touchcancel') {
        for (i = 0; i < ev.changedTouches.length; i++) {
          touch = ev.changedTouches[i];
          el = cursorsElements[touch.identifier];
          if (el) {
            el.parentNode.removeChild(el);
            delete cursorsElements[touch.identifier];
          }
        }
      }
    }
  }

  function onTuioCursor(touchEventType) {
    return function (cursor) {
      if (callbacks) {
        var callback;

        switch (touchEventType) {
          case 'touchstart':
            callback = callbacks.addTuioCursor;
            break;

          case 'touchmove':
            callback = callbacks.updateTuioCursor;
            break;

          case 'touchend':
            callback = callbacks.removeTuioCursor;
            break;
        }

        if (callback) {
          callback.next.callback(cursor);
        }
      }

      tuioCallback(touchEventType, cursor.sessionId, cursor.xPos, cursor.yPos);
    };
  }

  /* TUIO CURSOR -> TOUCHEVENT API */

  // See http://dvcs.w3.org/hg/webevents/raw-file/tip/touchevents.html
  function Touch(sid, x, y) {

    this.update = function (x_, y_) {
      var client = { x: window.innerWidth * x_, y: window.innerHeight * y_ };
      var target = document.elementFromPoint(client.x, client.y);

      var scroll = getScrollPosition();
      var viewportSize = getViewportSize();

      this.target = target;
      this.clientX = client.x;
      this.clientY = client.y;
      this.pageX = client.x + scroll.x;
      this.pageY = client.y + scroll.y;
      this.screenX = client.x + (window.outerWidth - viewportSize.w);
      this.screenY = client.y + (window.outerHeight - viewportSize.h);
    };

    // Id
    this.identifier = sid;
    this.update(x, y);
  }

  function TouchList() {
    var touchList = [];

    touchList.item = function (index) {
      return this[index] || null;
    };

    // specified by Mozilla
    touchList.identifiedTouch = function (id) {
      return this[id + 1] || null;
    };

    return touchList;
  }

  function tuioCallback(type, sid, x, y) {

    // Creamos / obtenemos el touch
    var touch;
    if (type === 'touchstart') {
      touch = new Touch(sid, x, y);
      cursors[sid] = touch;

    } else {
      touch = cursors[sid];
      touch.update(x, y);
    }

    // Trigereamos el evento
    triggerTouchevent(type, touch);

    // Lo borramos
    if (type === 'touchend') {
      delete cursors[sid];
    }
  }

  function getScrollPosition() {
    var doc = document.documentElement;
    var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    return { x: left, y: top };
  }

  function getViewportSize() {
    var w_ = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h_ = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return { w: w_, h: h_ };
  }

  function triggerTouchevent(eventName, touch) {
    var touchEvent = document.createEvent('Event');
    touchEvent.initEvent(eventName, true, true);

    // Creamos las listas de toques
    var activeTouches = new TouchList();
    var targetTouches = new TouchList();
    var changedTouches = new TouchList();

    for (var sid in cursors) {

      // Cursores activos
      activeTouches.push(cursors[sid]);

      // Cursores sobre el target
      if (touch.target === cursors[sid].target) {
        targetTouches.push(cursors[sid]);
      }
    }
    changedTouches.push(touch);

    touchEvent.touches = activeTouches;
    touchEvent.targetTouches = targetTouches;
    touchEvent.changedTouches = changedTouches;

    // Disparamos el evento
    if (touch.target) {
      touch.target.dispatchEvent(touchEvent);
    } else {
      document.dispatchEvent(touchEvent);
    }
  }

  // export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TuioTouch;
  } else {
    window[exportName] = TuioTouch;
  }
})(window, document, 'TuioTouch');
