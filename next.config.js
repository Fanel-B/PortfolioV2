/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = {
  reactStrictMode: true,
  // Les images de public/ sont déjà redimensionnées et compressées : on les sert telles quelles.
  // (La conversion à la volée de Next.js bloquait parfois plus d'une minute en local.)
  images: {
    unoptimized: true,
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'data'],
  },
};
