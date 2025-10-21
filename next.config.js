/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: '/hipatia-extension-privacy.html',
        destination: '/hipatia-extension-privacy',
      },
    ];
  },
};

module.exports = nextConfig;
