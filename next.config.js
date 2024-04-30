/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate-plugin')
const { withNextVideo } = require('next-video/process')

const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },
  ...nextTranslate(),
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true
      }
    ]
  },
  env: {
    // NEXT_APP_BEEGIN_DOMAIN: 'https://beegin.onrender.com',
    NEXT_APP_BEEGIN_DOMAIN: 'http://localhost:8000',
    NEXTAUTH_URL: 'http://localhost:3000'
  },
  images: {
    domains: ['images.pexels.com', 'res.cloudinary.com']
  }
}

module.exports = withNextVideo(nextConfig, {
  provider: 'cloudinary',
  providerConfig: {
    cloudinary: { endpoint: 'https://res.cloudinary.com' }
  }
})
