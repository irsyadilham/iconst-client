/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/services',
        permanent: false
      }
    ]
  },
  reactStrictMode: true,
  swcMinify: true,
  env: {
    HOST: process.env.HOST,
    TOYYIBPAY_URL: process.env.TOYYIBPAY_URL
  }
}

module.exports = nextConfig
