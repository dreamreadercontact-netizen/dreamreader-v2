/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['hmsmyizqmbtnfzbcblnv.supabase.co'],
  },
}

module.exports = nextConfig
