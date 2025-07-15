/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This is the key change to disable the failing optimization.
    // By default, Next.js tries to optimize imports from certain libraries.
    // We are overriding this list to be empty, which prevents the
    // '__barrel_optimize__' issue with lucide-react during the build.
    optimizePackageImports: [],
  },
};

export default nextConfig;
