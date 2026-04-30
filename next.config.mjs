/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
      {
        source: "/student/:path*",
        destination: "/learner/:path*",
        permanent: true,
      },
    ];
  },
  // turbopack: {
  //   root: __dirname,
  // },
  output: "standalone",
};

export default nextConfig;
