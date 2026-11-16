"use strict";

// Metro 0.83 passes a filename while image-size 2.x requires image bytes.
// Adapt the legacy API without using vulnerable image decoders.
const fs = require("node:fs");
const core = require("image-size-patched");

function imageSize(input, callback) {
  try {
    const data = typeof input === "string" || input instanceof URL
      ? fs.readFileSync(input)
      : input instanceof ArrayBuffer
        ? new Uint8Array(input)
        : input;
    if (!data || !(ArrayBuffer.isView(data) || data instanceof Uint8Array)) {
      throw new TypeError("Expected an image filename or binary bytes");
    }
    const result = core.imageSize(data);
    if (typeof callback === "function") {
      callback(null, result);
      return;
    }
    return result;
  } catch (error) {
    if (typeof callback === "function") {
      callback(error);
      return;
    }
    throw error;
  }
}

module.exports = imageSize;
module.exports.imageSize = imageSize;
