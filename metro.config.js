const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// docs/ berisi dokumen perencanaan dan prototipe, bukan bagian dari aplikasi.
const docsDir = path
  .resolve(__dirname, 'docs')
  .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  .replace(/\\\\|\//g, '[/\\\\]');
config.resolver.blockList = [
  ...[config.resolver.blockList].flat(),
  new RegExp(`^${docsDir}[/\\\\].*`),
];

// expo-sqlite di web: memuat wa-sqlite.wasm dan butuh SharedArrayBuffer (header COEP/COOP).
config.resolver.assetExts.push('wasm');
config.server.enhanceMiddleware = (middleware) => (req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  middleware(req, res, next);
};

module.exports = withNativeWind(config, { input: './src/global.css' });
