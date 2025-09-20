// next.config.ts
import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Add these from your old config to ignore build errors during deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["three", "@react-three/drei", "@react-three/fiber"],
  } as any,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: "three-vendor",
            priority: 10,
          },
          gsap: {
            test: /[\\/]node_modules[\\/]gsap[\\/]/,
            name: "gsap-vendor",
            priority: 10,
          },
        },
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);