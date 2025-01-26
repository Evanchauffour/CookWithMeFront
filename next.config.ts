import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000', // Port utilisé par Symfony
        pathname: '/uploads/**', // Chemin des images
      },
    ],
  },
};

export default nextConfig;
