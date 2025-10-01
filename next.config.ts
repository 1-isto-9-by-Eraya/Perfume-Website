// next.config.ts
import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Serve the whole app under this sub-path
  basePath: "/1isto9-perfumery", // build-time setting
  assetPrefix: "/1isto9-perfumery", // runtime setting (for assets like images, etc.)

  // // Redirect the domain root to the sub-path (avoids double-prefixing)
  // async redirects() {
  //   return [
  //     {
  //       source: "/",                    // matches https://thehouseoferaya.in/
  //       destination: "/1isto9-perfumery",
  //       permanent: true,                // 308 (good for SEO/caching)
  //     },
  //   ];
  // },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

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
