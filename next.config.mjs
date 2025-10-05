/** @type {import('next').NextConfig} */

import config from './config.js';

const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: config.MONGODB_URI,
    API: config.API,
  }
};

export default nextConfig;
