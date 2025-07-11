// next.config.ts
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ย้าย serverComponentsExternalPackages มาเป็น serverExternalPackages
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
  
  // ลบ experimental.api ออก (ไม่จำเป็นสำหรับ Next.js 13+)
  experimental: {
    // เก็บเฉพาะ experimental features ที่จำเป็น
  },
  
  // เพิ่ม configuration อื่นๆ ที่จำเป็น
  images: {
    domains: ['localhost'],
  },
}

export default nextConfig