/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  webpack: (config, { dev }) => {
    // Avoid filesystem cache snapshot issues on some Windows setups during dev.
    if (dev) {
      config.cache = false
    }
    return config
  }
}

module.exports = nextConfig
