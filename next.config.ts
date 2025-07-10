/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // เพิ่มขนาดตามที่ต้องการ
    },
  },
}

module.exports = nextConfig