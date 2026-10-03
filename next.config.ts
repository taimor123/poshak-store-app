import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Product photos are served from Cloudinary (IMAGE_GUIDELINES.md §Storage).
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
};

export default nextConfig;
