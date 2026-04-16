/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer, dev }) => {
    // Only apply externals on server-side
    if (isServer) {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
    }
    
    // Resolve React Native dependencies to empty module
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };
    
    // Workaround for Next.js 15.5.15 webpack minification bug
    if (!dev) {
      config.optimization.minimize = false;
    }
    
    return config;
  },
};

module.exports = nextConfig;
