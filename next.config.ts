import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/admin/:tab",
        destination: "/admin",
      },
      {
        source: "/dashboard",
        destination: "/admin",
      },
      {
        source: "/dashboard/:tab",
        destination: "/admin",
      },
    ];
  },
};

export default nextConfig;
