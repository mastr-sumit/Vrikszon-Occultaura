import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    qualities: [75, 95],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
