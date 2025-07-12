// next.config.ts
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // สำหรับ Prisma และ packages อื่นๆ ที่ต้องรันบน server
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
  
  // การตั้งค่า images สำหรับ external domains
  images: {
    domains: [
      'localhost', 
      'img.youtube.com',           // สำหรับ YouTube thumbnails
      'i.ytimg.com',               // YouTube thumbnails อีกรูปแบบ
      'via.placeholder.com'        // สำหรับ placeholder images (optional)
    ],
    // เพิ่ม remote patterns สำหรับ Next.js 13+ (แนะนำ)
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
    // เพิ่ม serverActions เพื่อใช้ Server Actions (optional)
    serverActions: {},
    
    // เพิ่ม serverComponentsExternalPackages หากจำเป็น
    serverComponentsExternalPackages: ['@prisma/client'],
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