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
    NEXT_APP_BEEGIN_DOMAIN: 'https://music-tx16.onrender.com',
    NEXTAUTH_URL: 'https://soundee.vercel.app'
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
