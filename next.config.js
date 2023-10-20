/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: ["static-01.daraz.com"],
    // domains: ["m.media-amazon.com"],
  },
};

module.exports = nextConfig;
