import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable Vite client requests that are causing 404 errors
  async headers() {
    return [
      {
        source: '/@vite/client',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
