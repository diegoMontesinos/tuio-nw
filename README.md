# tuio-nw [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> A JavaScript implementation of the TUIO protocol for multitouch and tangible interaction for NodeWebkit (nw).

## Install

```sh
$ npm install tuio-nw
```

## Usage

```js
var Tuio = require('tuio-nw');
var tuioClient = new Tuio.Client({
  host: '127.0.0.1',
  port: 3333
});

var onAddTuioCursor = function (addCursor) {
  console.log(addCursor);
},

onUpdateTuioCursor = function (updateCursor) {
  console.log(updateCursor);
},

onRemoveTuioCursor = function (removeCursor) {
  console.log(removeCursor);
},

onAddTuioObject = function (addObject) {
  console.log(addObject);
},

onUpdateTuioObject = function (updateObject) {
  console.log(updateObject);
},

onRemoveTuioObject = function (removeObject) {
  console.log(removeObject);
},

onRefresh = function (time) {
  console.log(time);
};

tuioClient.on('addTuioCursor', onAddTuioCursor);
tuioClient.on('updateTuioCursor', onUpdateTuioCursor);
tuioClient.on('removeTuioCursor', onRemoveTuioCursor);
tuioClient.on('addTuioObject', onAddTuioObject);
tuioClient.on('updateTuioObject', onUpdateTuioObject);
tuioClient.on('removeTuioObject', onRemoveTuioObject);
tuioClient.on('refresh', onRefresh);

tuioClient.listen();
```

## License

MIT © [Diego Montesinos]()

[npm-image]: https://badge.fury.io/js/tuio-nw.svg
[npm-url]: https://npmjs.org/package/tuio-nw
[travis-image]: https://travis-ci.org/diegoMontesinos/tuio-nw.svg?branch=master
[travis-url]: https://travis-ci.org/diegoMontesinos/tuio-nw
[daviddm-image]: https://david-dm.org/diegoMontesinos/tuio-nw.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/diegoMontesinos/tuio-nw
[coveralls-image]: https://coveralls.io/repos/diegoMontesinos/tuio-nw/badge.svg
[coveralls-url]: https://coveralls.io/r/diegoMontesinos/tuio-nw
