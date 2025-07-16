/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir: true, // Remove this line
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
