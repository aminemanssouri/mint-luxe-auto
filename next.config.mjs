/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: '*.scene7.com',
        pathname: '/is/image/**',
      },
      {
        protocol: 'https',
        hostname: 'azimutyachts.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.wandaloo.com',
        pathname: '/files/**',
      },
      {
        protocol: 'https',
        hostname: '*.hearstapps.com',
        pathname: '/hmg-prod/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.charles-pozzi.fr',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'toppng.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.vhv.rs',
        pathname: '/dpng/**',
      },
      {
        protocol: 'https',
        hostname: '*.pngegg.com',
        pathname: '/pngimages/**',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
}

export default nextConfig
