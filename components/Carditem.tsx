import Image from 'next/image'

type Course = {
    title: string
    description: string
    image: string
    price: string
    }

    const courses: Course[] = [
    {
        title: 'HTML5 พื้นฐาน',
        description: 'เรียนรู้ HTML5 อย่างเข้าใจ เหมาะสำหรับผู้เริ่มต้นสร้างเว็บไซต์',
        image: '/img/html5.png',
        price: 'ฟรี',
    },
    {
        title: 'CSS สำหรับผู้เริ่มต้น',
        description: 'ปูพื้นฐาน CSS เพื่อการจัดการ layout และการออกแบบเว็บให้สวยงาม',
        image: '/img/css.png',
        price: 'ฟรี',
    },
    {
        title: 'JavaScript เบื้องต้น',
        description: 'เริ่มต้นเรียน JavaScript ด้วยภาษาง่าย ๆ เข้าใจได้เร็ว',
        image: '/img/javascript.png',
        price: 'ฟรี',
    },
    ]

    export default function CourseCardList() {
    return (
        <div className="container mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((course, index) => (
            <div
            key={index}
            className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all"
            >
            {/* ✅ ปรับขนาดรูปให้เท่ากัน */}
            <div className="w-full h-[200px] relative bg-white">
                <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-contain p-4"
                />
            </div>

            <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between items-center">
                <span className="text-amber-600 font-semibold">{course.price}</span>
                <button className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition">
                    เรียนเลย
                </button>
                </div>
            </div>
            </div>
        ))}
        </div>
    )
    }
