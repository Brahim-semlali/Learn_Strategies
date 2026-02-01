const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Évite le warning "multiple lockfiles" quand le repo est dans un dossier avec d'autres lockfiles
  turbopack: {
    root: path.resolve(__dirname),
  },
};

module.exports = nextConfig;
