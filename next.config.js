/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' }
    ]
  },
  experimental: {
    typedRoutes: false,
    outputFileTracingIncludes: {
      '/**': ['./content/**/*']
    }
  }
};

module.exports = nextConfig;
