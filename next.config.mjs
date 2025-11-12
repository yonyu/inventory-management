/** @type {import('next').NextConfig} */

import config, { STRIPE_SECRET_KEY } from './config.js';

const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: config.MONGODB_URI,
    API: config.API,
    NEXTAUTH_SECRET: config.NEXTAUTH_SECRET,
    GOOGLE_API_KEY: config.GOOGLE_API_KEY,
    CLOUDINARY_CLOUD_NAME: config.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: config.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: config.CLOUDINARY_API_SECRET,
    STRIPE_SECRET_KEY: config.STRIPE_SECRET_KEY,
  }
};

export default nextConfig;
