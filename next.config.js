/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mysql2", "@prisma/client"],
  experimental: {
    optimizePackageImports: ["lucide-react", "@heroicons/react"],
  },
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
  env: {
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  webpack: (config, { isServer }) => {
    // Handle file imports for Ant Design
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/,
      use: {
        loader: "file-loader",
        options: {
          publicPath: "/_next/static/images/",
          outputPath: "static/images/",
        },
      },
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "/api/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = nextConfig;
