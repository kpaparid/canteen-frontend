/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],

    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  env: {
    BACKEND_URI: process.env.BACKEND_URI,
  },
};

module.exports = nextConfig;
