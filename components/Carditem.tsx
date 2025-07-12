import Image from 'next/image'
import Link from 'next/link'

type Course = {
    title: string
    description: string
    image: string
    price: string
    link: string // เพิ่ม property สำหรับ link
    buttonText: string // เพิ่ม property สำหรับข้อความปุ่ม
}

const courses: Course[] = [
    {
        title: 'HTML5 พื้นฐาน',
        description: 'เรียนรู้ HTML5 อย่างเข้าใจ เหมาะสำหรับผู้เริ่มต้นสร้างเว็บไซต์',
        image: '/img/html5.png',
        price: 'ฟรี',
        link: '/htmlvideo', // link สำหรับคอร์ส HTML
        buttonText: 'เรียนเลย',
    },
    {
        title: 'CSS สำหรับผู้เริ่มต้น',
        description: 'ปูพื้นฐาน CSS สําหรับผู้เริ่มต้น เพื่อการออกแบบเว็บให้สวยงาม',
        image: '/img/css.png',
        price: 'ฟรี',
        link: '/cssvideo', // link สำหรับคอร์ส CSS
        buttonText: 'เรียนเลย',
    },
    {
        title: 'JavaScript เบื้องต้น',
        description: 'เริ่มต้นเรียน JavaScript ด้วยภาษาง่าย ๆ เข้าใจได้เร็ว',
        image: '/img/javascript.png',
        price: 'ฟรี',
        link: '#', // link สำหรับคอร์ส JavaScript
        buttonText: 'เร็วๆนี้...',
    },
]

export default function CourseCardList() {
    return (
        <div className="container mx-auto p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
            {courses.map((course, index) => (
                <div
                    key={index}
                    className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white
                                hover:shadow-xl hover:shadow-teal-100/50 transform hover:-translate-y-2 transition-all duration-300 ease-in-out"
                >
                    <div className="w-full h-[200px] relative bg-white flex items-center justify-center p-4">
                        <Image
                            src={course.image}
                            alt={course.title}
                            width={200}
                            height={200}
                            className="object-contain"
                        />
                    </div>

                    <div className="p-6">
                        <h3 className="text-2xl font-bold mb-2 text-teal-800">
                            {course.title}
                        </h3>
                        <p className="text-gray-700 mb-4 text-base leading-relaxed">
                            {course.description}
                        </p>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-teal-600 font-bold text-xl">
                                {course.price}
                            </span>
                            {/* แก้ไข: ใช้ Link ห่อรอบ button และใช้ course.link */}
                            <Link href={course.link}>
                                <button
                                    className="bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition-colors duration-300
                                            shadow-md hover:shadow-lg"
                                >
                                    {course.buttonText}
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}