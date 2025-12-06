import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/notelogs',
        permanent: true,
      },
      {
        source: '/blogs',
        destination: '/notelogs',
        permanent: true,
      },
    ];
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 30,
    },
  },
};

export default nextConfig;
