import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  // Hydrationエラーの対策
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  // 開発時のHydrationエラーを抑制
  reactStrictMode: true,
  // Linting/TypeScriptチェックをスキップしてビルド分析を実行
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 画像最適化設定
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default withBundleAnalyzer(nextConfig);
