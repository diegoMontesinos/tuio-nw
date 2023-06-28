"use strict";

// OSC parsing based on node-osc
module.exports = (function () {
  var jspack = require("jspack").jspack;

  var decodeInt = function (data) {
    return {
      value: jspack.Unpack(">i", data.slice(0, 4))[0],
      data: data.slice(4),
    };
  };

  var decodeFloat = function (data) {
    return {
      value: jspack.Unpack(">f", data.slice(0, 4))[0],
      data: data.slice(4),
    };
  };

  var decodeString = function (data) {
    var end = 0;
    while (data[end] && end < data.length) {
      end++;
    }

    return {
      value: data.toString("ascii", 0, end),
      data: data.slice(Math.ceil((end + 1) / 4) * 4),
    };
  };

  var decodeTime = function (data) {
    var time = jspack.Unpack(">LL", data.slice(0, 8)),
      seconds = time[0],
      fraction = time[1];

    return {
      value: seconds + fraction / 4294967296,
      data: data.slice(8),
    };
  };

  var decode;
  var previousData;
  var decodeBundle = function (data, message) {
    var time = decodeTime(data),
      bundleSize,
      content;

    data = time.data;

    message.push("#bundle");
    message.push(time.value);

    while (data.length > 0) {
      bundleSize = decodeInt(data);
      data = bundleSize.data;

      content = data.slice(0, bundleSize.value);
      message.push(decode(content));

      data = data.slice(bundleSize.value, data.length);
    }

    return data;
  };

  var decodeByTypeTag = function (typeTag, data) {
    switch (typeTag) {
      case "i":
        return decodeInt(data);
      case "f":
        return decodeFloat(data);
      case "s":
        return decodeString(data);
      default:
        return null;
    }
  };

  var decodeMessage = function (address, data, message) {
    try {
      message.push(address.value);
      var typeTags = decodeString(data);
      data = typeTags.data;
      typeTags = typeTags.value;

      if (typeTags[0] === ",") {
        for (var i = 1; i < typeTags.length; i++) {
          var arg = decodeByTypeTag(typeTags[i], data);
          data = arg.data;
          message.push(arg.value);
        }
      }
    } catch (e) {
      return previousData;
    }
    previousData = data;
    return data;
  };

  decode = function (data) {
    var message = [],
      address = decodeString(data);
    data = address.data;

    if (address.value === "#bundle") {
      data = decodeBundle(data, message);
    } else if (data.length > 0) {
      data = decodeMessage(address, data, message);
    }

    return message;
  };

  return {
    decode: decode,
  };
})();
