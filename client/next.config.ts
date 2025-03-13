// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    disableOptimizedLoading: true, // Disables Next.js overlay
  },
};

export default nextConfig;
