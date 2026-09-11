import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Avoid w=3840 candidates on mobile; hero uses sizes ≈ 100vw / 1400px.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'clubmatch-media.s3.eu-west-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Local macOS NAT64 resolves public S3 hosts to 64:ff9b::…, which Next 16 treats as private IPs.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
  },
};


export default nextConfig;
