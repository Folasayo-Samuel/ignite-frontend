/** @type {import('next').NextConfig} */

// Build the connect-src dynamically based on the production API URL
const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
// Extract the origin (e.g., https://your-api.digitalocean.com) from the full API URL
const apiOrigin = apiUrl ? new URL(apiUrl).origin : '';
// Build WebSocket URL from API origin
const wsOrigin = apiOrigin ? apiOrigin.replace('https://', 'wss://').replace('http://', 'ws://') : '';

const connectSources = [
  "'self'",
  "http://localhost:4000",
  "http://localhost:5000",
  "ws://localhost:4000",
  "ws://localhost:5000",
  "https://api.paystack.co",
  apiOrigin,
  wsOrigin,
].filter(Boolean).join(' ');

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.paystack.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://res.cloudinary.com https://avatars.githubusercontent.com https://ui-avatars.com; font-src 'self' https://fonts.gstatic.com; connect-src ${connectSources}; frame-src 'self' https://js.paystack.co;`
  }
];

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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  // turbopack: {
  //   root: __dirname,
  // },
  output: "standalone",
};

export default nextConfig;
