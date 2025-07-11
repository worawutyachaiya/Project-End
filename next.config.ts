/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    domains: ['img.youtube.com'], // สำหรับ YouTube thumbnails
  },
  // เพิ่มการกำหนดค่าสำหรับ file upload
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig