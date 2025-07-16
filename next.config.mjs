/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir: true, // This line was removed in the previous step
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
