'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'

const news = [
    {
        title: 'รออัปเดต: การเปลี่ยนแปลงครั้งสำคัญในหลักสูตร',
        date: '7 กรกฎาคม 2568',
        description: 'เรากำลังปรับปรุงและเพิ่มหลักสูตรใหม่ๆ เพื่อตอบสนองความต้องการของผู้เรียนในปัจจุบัน เตรียมพบกับประสบการณ์การเรียนรู้ที่เข้มข้นยิ่งขึ้น!',
        image: '/img/news.jpg',
    },
    {
        title: 'สัมมนาออนไลน์: เจาะลึกเทคโนโลยี AI ล่าสุด',
        date: '10 กรกฎาคม 2568',
        description: 'เข้าร่วมสัมมนาฟรีเพื่อเรียนรู้เกี่ยวกับความก้าวหน้าล่าสุดในปัญญาประดิษฐ์ และวิธีนำไปประยุกต์ใช้ในการทำงานของคุณ',
        image: '/img/news.jpg',

    },
    {
        title: 'โปรโมชั่นพิเศษ: ส่วนลดคอร์สเรียนช่วงฤดูร้อน',
        date: '15 กรกฎาคม 2568',
        description: 'อย่าพลาดโอกาสพิเศษ! รับส่วนลดสูงสุด 30% สำหรับคอร์สเรียนยอดนิยมของเรา เฉพาะช่วงฤดูร้อนนี้เท่านั้น',
        image: '/img/news.jpg',
    },
    {
        title: 'เคล็ดลับสู่ความสำเร็จ: การสร้างพอร์ตโฟลิโอออนไลน์',
        date: '20 กรกฎาคม 2568',
        description: 'เรียนรู้วิธีสร้างพอร์ตโฟลิโอที่น่าประทับใจเพื่อดึงดูดผู้จ้างและแสดงผลงานของคุณอย่างมืออาชีพ',
        image: '/img/news.jpg',

    }
]

export default function NewsSection() {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scrollWithLoop = () => {
        if (scrollRef.current) {
            const el = scrollRef.current
            const maxScrollLeft = el.scrollWidth - el.clientWidth

            // ตรวจสอบว่ามีเนื้อหาให้เลื่อนหรือไม่
            if (maxScrollLeft <= 0) return;

            if (el.scrollLeft >= maxScrollLeft - 20) { // ปรับค่า 10 เป็น 20 เพื่อความแม่นยำ
                el.scrollTo({ left: 0, behavior: 'smooth' })
            } else {
                el.scrollBy({ left: 350, behavior: 'smooth' })
            }
        }
    }

    useEffect(() => {
        // ตรวจสอบว่ามีข่าวมากกว่า 1 รายการก่อนตั้ง Interval
        if (news.length > 1) {
            const interval = setInterval(() => {
                scrollWithLoop()
            }, 3000)
            return () => clearInterval(interval)
        }
    }, [])

    return (
        // ปรับพื้นหลังของ section ให้เป็น gradient สีเขียวอมฟ้า/มินต์
        <section id="news-section" className="flex flex-col items-center py-16 bg-gradient-to-br from-emerald-50 to-teal-100" style={{ backgroundImage: "url('/img/bg-green.jpg')", backgroundSize: "cover", backgroundAttachment: "fixed" }}>
            <div className="w-full max-w-7xl px-5">
                {/* หัวข้อ (ยังคงใช้การตั้งค่าเดิมที่ปรับแล้ว) */}
                <div className="mb-10 bg-gradient-to-r from-teal-600 to-teal-400 text-white px-8 py-6 rounded-3xl shadow-lg shadow-teal-400/40 text-center relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 opacity-20 text-8xl pointer-events-none select-none">📰</div>
                    <h2 className="text-4xl sm:text-5xl font-extrabold drop-shadow-md mb-2 animate-fade-in">
                        ข่าวสารและบทความจากเรา
                    </h2>
                    <p className="text-lg sm:text-xl font-medium drop-shadow-sm">
                        ติดตามเรื่องราวอัปเดตล่าสุดจากทีมของเราได้ที่นี่
                    </p>
                </div>

                {/* กล่องข่าว */}
                <div className="relative">
                    <div
                        ref={scrollRef}
                        className="flex space-x-6 overflow-x-auto scroll-smooth no-scrollbar pb-2"
                    >
                        {news.map((item, index) => (
                            <div
                                key={index}
                                // ปรับแต่ง Card ข่าว: Shadow ที่ละมุนขึ้น, border ที่อ่อนลง, และ hover effect ที่สวยงาม
                                className="min-w-[300px] md:min-w-[360px] max-w-[360px] flex-shrink-0 bg-white
                                           shadow-md shadow-gray-200 border border-gray-200 rounded-2xl
                                           transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-200/50"
                            >
                                <div className="w-full h-[200px] relative rounded-t-2xl overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-5">
                                    {/* วันที่: เปลี่ยนเป็นสีเทาที่เข้มขึ้นเล็กน้อย หรือสีเขียวอมน้ำเงินอ่อนๆ */}
                                    <p className="text-gray-500 text-sm mb-1">{item.date}</p>
                                    {/* ชื่อข่าว: คงเดิม (text-gray-800) เพื่อความชัดเจน */}
                                    <h3 className="font-semibold text-gray-800 text-lg mb-2">
                                        {item.title}
                                    </h3>
                                    {/* คำอธิบาย: คงเดิม (text-gray-600) */}
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ปุ่มเลื่อน */}
                    <div className="flex justify-center gap-4 mt-8"> {/* เพิ่ม mt-8 เพื่อระยะห่างที่มากขึ้น */}
                        <button
                            onClick={() => scrollRef.current?.scrollBy({ left: -350, behavior: 'smooth' })}
                            // ปรับสีปุ่มเลื่อนให้เป็นสีเขียวอมน้ำเงิน
                            className="w-12 h-12 bg-teal-600 text-white rounded-full hover:bg-teal-700 shadow-md flex items-center justify-center text-xl font-bold"
                        >
                            &lt;
                        </button>
                        <button
                            onClick={scrollWithLoop}
                            // ปรับสีปุ่มเลื่อนให้เป็นสีเขียวอมน้ำเงิน
                            className="w-12 h-12 bg-teal-600 text-white rounded-full hover:bg-teal-700 shadow-md flex items-center justify-center text-xl font-bold"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}