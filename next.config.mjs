/** @type {import('next').NextConfig} */

import config from './config.js';

const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: config.MONGODB_URI,
    API: config.API,
    NEXTAUTH_SECRET: config.NEXTAUTH_SECRET,
    GOOGLE_API_KEY: config.GOOGLE_API_KEY,
  }
};

export default nextConfig;
