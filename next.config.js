/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer, dev }) => {
    // Only apply externals on server-side
    if (isServer) {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
    }
    
    // Resolve React Native dependencies to empty module
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      '@features': require('path').resolve(__dirname, 'src/features'),
      '@shared': require('path').resolve(__dirname, 'src/shared'),
    };
    
    // Workaround for Next.js 15.5.15 webpack minification bug
    if (!dev) {
      config.optimization.minimize = false;
    }
    
    return config;
  },
};

module.exports = nextConfig;
