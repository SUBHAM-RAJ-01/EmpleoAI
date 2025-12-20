/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  // ESLint configuration for builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

module.exports = nextConfig
