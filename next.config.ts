// next.config.ts
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // เพิ่มบรรทัดนี้เพื่อข้าม ESLint ขณะ build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // สำหรับ Prisma และ packages อื่นๆ ที่ต้องรันบน server
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
  
  // การตั้งค่า images สำหรับ external domains
  images: {
    domains: [
      'localhost', 
      'img.youtube.com',
      'i.ytimg.com',
      'via.placeholder.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      }
    ],
  },
  
  // การตั้งค่าสำหรับ file uploads
  experimental: {
    // เอา serverComponentsExternalPackages ออก เพราะย้ายไป serverExternalPackages แล้ว
    serverActions: {},
  },
  
  // เพิ่ม webpack config สำหรับ handle บางไฟล์ที่อาจมีปัญหา
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  // เพิ่ม headers สำหรับ CORS หากจำเป็น
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  
  // เพิ่ม redirects หากต้องการ
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/video',
        permanent: false,
      },
    ];
  },
}

export default nextConfig