import Image from 'next/image'
import Link from 'next/link'

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
        description: 'ปูพื้นฐาน CSS สําหรับผู้เริ่มต้น เพื่อการออกแบบเว็บให้สวยงาม',
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
        // ปรับ padding ภาชนะหลักเล็กน้อย และเพิ่ม margin บน/ล่างเพื่อให้มีระยะห่างจากองค์ประกอบอื่น
        <div className="container mx-auto p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-12" >
            {courses.map((course, index) => (
                <div
                    key={index}
                    // ปรับแต่ง Card: มุมโค้งมนขึ้น, เงาที่ชัดเจนแต่ไม่ทึบ, ขอบสีอ่อน, พื้นหลังขาว
                    // เพิ่ม hover effect ที่สวยงามและมีมิติ
                    className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white
                                hover:shadow-xl hover:shadow-teal-100/50 transform hover:-translate-y-2 transition-all duration-300 ease-in-out"
                >
                    {/* ✅ ปรับขนาดรูปให้เท่ากัน */}
                    <div className="w-full h-[200px] relative bg-white flex items-center justify-center p-4">
                        <Image
                            src={course.image}
                            alt={course.title}
                            width={200} // กำหนด width และ height เพื่อป้องกัน CLS (Cumulative Layout Shift)
                            height={200} // ปรับให้เหมาะกับ object-contain และพื้นที่ 200px
                            className="object-contain" // ไม่ต้องมี p-4 เพราะ div มี p-4 แล้ว
                        />
                    </div>

                    <div className="p-6">
                        {/* ชื่อคอร์ส: ใช้สีเขียวอมน้ำเงินที่เข้มขึ้นเล็กน้อย */}
                        <h3 className="text-2xl font-bold mb-2 text-teal-800">
                            {course.title}
                        </h3>
                        {/* รายละเอียด: ใช้สีเทาที่อ่านง่าย */}
                        <p className="text-gray-700 mb-4 text-base leading-relaxed">
                            {course.description}
                        </p>
                        <div className="flex justify-between items-center mt-4">
                            {/* ราคา: ใช้สีเขียวอมน้ำเงิน และปรับ font-size/weight */}
                            <span className="text-teal-600 font-bold text-xl">
                                {course.price}
                            </span>
                            {/* ปุ่ม: ใช้สีเขียวอมน้ำเงิน, มุมโค้งมน, มี hover effect */}
                            
                            <button
                                className="bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition-colors duration-300
                                        shadow-md hover:shadow-lg"
                            >
                            < Link href="/htmlvideo" >เรียนเลย </Link>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}