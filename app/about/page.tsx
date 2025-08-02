//app/about/page.tsx
"use client"

import Image from 'next/image'

const About = () => {
  return (
    <div className="min-h-screen w-full  px-4 py-12">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">เกี่ยวกับเรา</h1>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-10 rounded-full" />

        <p className="text-gray-600 text-lg mb-12">
          เว็บไซต์นี้พัฒนาโดยทีมนักเรียนจำนวน 2 คน ที่มีความตั้งใจในการสร้างระบบที่ใช้งานง่าย ปลอดภัย และทันสมัย
        </p>

        {/* ส่วนของผู้พัฒนา */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* ผู้พัฒนาคนที่ 1 */}
          <div className="bg-gray-50 rounded-2xl shadow-md p-6 flex flex-col items-center">
            <Image
              src="/img/get.jpg" // เปลี่ยนเป็น path รูปจริงของคุณ
              alt="Developer 1"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover mb-4"
              priority
            />
            <h2 className="text-xl font-semibold text-gray-800">วรวุฒิ ยาชัยยะ</h2>
            <p className="text-gray-600 mt-2 text-center">
              ผู้พัฒนา Full Stack ด้วย React, Next.js และการออกแบบระบบฐานข้อมูล
            </p>
          </div>

          {/* ผู้พัฒนาคนที่ 2 */}
          <div className="bg-gray-50 rounded-2xl shadow-md p-6 flex flex-col items-center">
            <Image
              src="/img/fuse.jpg" // เปลี่ยนเป็น path รูปจริงของคุณ
              alt="Developer 2"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover mb-4"
              priority
            />
            <h2 className="text-xl font-semibold text-gray-800">ปรเมศวร์ สุขรอด</h2>
            <p className="text-gray-600 mt-2 text-center">
              ผู้พัฒนา UI/UX และการจัดการระบบ Backend ด้วย Prisma และ PostgreSQL
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About