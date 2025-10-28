import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 uses Turbopack by default - no explicit configuration needed
  
  // Enable React 19 features (valid experimental features)
  experimental: {
    // Enable package optimization for React 19
    optimizePackageImports: ['react', 'react-dom'],
    // Enable Server Actions for form handling
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
    // Enable Webpack build worker for faster builds
    webpackBuildWorker: true,
  },
  
  // External packages for Server Components
  serverExternalPackages: [],
  
  // Performance optimizations
  compiler: {
    // Remove console logs in production for better performance
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
  
  // Redirects for better SEO and migration
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/app/dashboard',
        permanent: true,
      },
      {
        source: '/contests',
        destination: '/app/contests',
        permanent: true,
      },
      {
        source: '/leaderboard',
        destination: '/app/leaderboard',
        permanent: true,
      },
    ];
  },
  
  // Webpack configuration (fallback for unsupported Turbopack features)
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer in development
    if (dev && !isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Optimize for production
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      };
    }
    
    return config;
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'contest_radar_2025',
  },
  
  // Output configuration for deployment
  output: 'standalone',
  
  // Enable performance optimizations
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
