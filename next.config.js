/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = {
  reactStrictMode: true,
  eslint: {
    dirs: ['app', 'components', 'lib', 'data'],
  },
  experimental: {
    appDir: true,
  },
  swcMinify: true,
};
