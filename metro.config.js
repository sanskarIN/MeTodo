const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Use NativeWind's default virtual CSS handling. Forcing a generated file into
// node_modules/react-native-css-interop/.cache can break clean CI web exports:
// Metro cannot reliably watch/hash that file across platforms.
module.exports = withNativeWind(config, {
  input: "./global.css",
});
