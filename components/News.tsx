// components/NewsSection.tsx
'use client'
import { useRef } from 'react'
import Image from 'next/image'

const news = [
{
    title: 'รออัปเดต',
    date: '7 กรกฎาคม 2568',
    description: 'ไม่มีข่าวสารในปัจจุบัน',
    image: '/images/news1.png',
},
{
    title: 'รออัปเดต',
    date: '7 กรกฎาคม 2568',
    description: 'ไม่มีข่าวสารในปัจจุบัน',
    image: '/images/news1.png',
},
{
    title: 'รออัปเดต',
    date: '7 กรกฎาคม 2568',
    description: 'ไม่มีข่าวสารในปัจจุบัน',
    image: '/images/news1.png',
},
{
    title: 'รออัปเดต',
    date: '7 กรกฎาคม 2568',
    description: 'ไม่มีข่าวสารในปัจจุบัน',
    image: '/images/news1.png',
},
{
    title: 'รออัปเดต',
    date: '7 กรกฎาคม 2568',
    description: 'ไม่มีข่าวสารในปัจจุบัน',
    image: '/images/news1.png',
},
{
    title: 'รออัปเดต',
    date: '7 กรกฎาคม 2568',
    description: 'ไม่มีข่าวสารในปัจจุบัน',
    image: '/images/news1.png',
},
{
    title: 'รออัปเดต',
    date: '7 กรกฎาคม 2568',
    description: 'ไม่มีข่าวสารในปัจจุบัน',
    image: '/images/news1.png',
}
]

export default function NewsSection() {
const scrollRef = useRef<HTMLDivElement>(null)

const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
    scrollRef.current.scrollBy({
        left: direction === 'left' ? -350 : 350,
        behavior: 'smooth',
    })
    }
}

return (
    <section className="flex flex-col items-center bg-white py-10">
    <div className="w-full max-w-4xl px-3">
        <div className="flex flex-col items-center md:items-center">
          {/* ✅ ฝั่งซ้าย - พื้นหลังชมพู */}
        <div className="w-full md:w-1/3 mb-6 bg-amber-400 text-white p-5 rounded-2xl text-center md:text-center">
            <h2 className="text-3xl font-bold">ข่าวสาร</h2>
            <p className="text-xl">และบทความ</p>
        </div>

          {/* ✅ ฝั่งขวา - Scroll แนวนอน */}
        <div className="max-w-7xl md:w-2/1 overflow-x-auto">
            <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto scroll-smooth"
            >
            {news.map((item, index) => (
                <div
                key={index}
                className="min-w-[320px] max-w-[320px] bg-white shadow-lg rounded-2xl border border-gray-200"
                >
                <div className="w-full h-[180px] relative rounded-t-2xl overflow-hidden">
                    <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    />
                </div>
                <div className="p-4">
                    <p className="text-amber-500 text-sm mb-1">{item.date}</p>
                    <h3 className="font-semibold text-gray-800 mb-2 leading-tight">
                    {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                </div>
            ))}
            </div>
            {/* ปุ่มเลื่อนซ้าย/ขวา */}
            <div className="flex justify-center gap-4 mt-4">
            <button
                onClick={() => scroll('left')}
                className="w-10 h-10 bg-amber-500 text-white rounded-full hover:bg-amber-600"
            >
                &lt;
            </button>
            <button
                onClick={() => scroll('right')}
                className="w-10 h-10 bg-amber-500 text-white rounded-full hover:bg-amber-600"
            >
                &gt;
            </button>
            </div>
        </div>
        </div>
    </div>
    </section>
)
}
