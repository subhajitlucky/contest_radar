import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/subscribe",
        destination: "/alerts",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
