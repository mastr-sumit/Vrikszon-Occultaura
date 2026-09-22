import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
    proxyClientMaxBodySize: "100mb",
  },
  images: {
    formats: ["image/webp", "image/avif"],
    qualities: [75, 95],
    dangerouslyAllowSVG: true,
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: "/images/:path*",
          destination: "/api/media/images/:path*",
        },
        {
          source: "/videos/:path*",
          destination: "/api/media/videos/:path*",
        },
      ],
      fallback: [
        {
          source: "/images/:path*",
          destination: "/api/media/images/:path*",
        },
        {
          source: "/videos/:path*",
          destination: "/api/media/videos/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
