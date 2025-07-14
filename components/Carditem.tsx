//components\Carditem.tsx
import Image from 'next/image'
import Link from 'next/link'

type Course = {
    title: string
    description: string
    image: string
    price: string
    link: string
    buttonText: string
}

const courses: Course[] = [
    {
        title: 'HTML5 พื้นฐาน',
        description: 'เรียนรู้ HTML5 อย่างเข้าใจ เหมาะสำหรับผู้เริ่มต้นสร้างเว็บไซต์',
        image: '/img/html5.png',
        price: 'ฟรี',
        link: '/htmlvideo',
        buttonText: 'เรียนเลย',
    },
    {
        title: 'CSS สำหรับผู้เริ่มต้น',
        description: 'ปูพื้นฐาน CSS สําหรับผู้เริ่มต้น เพื่อการออกแบบเว็บให้สวยงาม',
        image: '/img/css.png',
        price: 'ฟรี',
        link: '/cssvideo',
        buttonText: 'เรียนเลย',
    },
    {
        title: 'JavaScript เบื้องต้น',
        description: 'เริ่มต้นเรียน JavaScript ด้วยภาษาง่าย ๆ เข้าใจได้เร็ว',
        image: '/img/javascript.png',
        price: 'ฟรี',
        link: '#',
        buttonText: 'เร็วๆนี้...',
    },
]

export default function CourseCardList() {
    return (
        <div className="container mx-auto p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 mb-6">
            {/* HTML5 Course Card */}
            <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white
                            hover:shadow-xl hover:shadow-teal-100/50 transform hover:-translate-y-2 transition-all duration-300 ease-in-out">
                <div className="w-full h-[200px] relative bg-white flex items-center justify-center p-4">
                    <Image
                        src={courses[0].image}
                        alt={courses[0].title}
                        width={200}
                        height={200}
                        className="object-contain"
                    />
                </div>

                <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 text-teal-800">
                        {courses[0].title}
                    </h3>
                    <p className="text-gray-700 mb-4 text-base leading-relaxed">
                        {courses[0].description}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-teal-600 font-bold text-xl">
                            {courses[0].price}
                        </span>
                        <Link href={courses[0].link}>
                            <h4 className="bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition-colors duration-300
                                        shadow-md hover:shadow-lg cursor-pointer">
                                {courses[0].buttonText}
                            </h4>
                        </Link>
                    </div>
                </div>
            </div>

            {/* CSS Course Card */}
            <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white
                            hover:shadow-xl hover:shadow-teal-100/50 transform hover:-translate-y-2 transition-all duration-300 ease-in-out">
                <div className="w-full h-[200px] relative bg-white flex items-center justify-center p-4">
                    <Image
                        src={courses[1].image}
                        alt={courses[1].title}
                        width={200}
                        height={200}
                        className="object-contain"
                    />
                </div>

                <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 text-teal-800">
                        {courses[1].title}
                    </h3>
                    <p className="text-gray-700 mb-4 text-base leading-relaxed">
                        {courses[1].description}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-teal-600 font-bold text-xl">
                            {courses[1].price}
                        </span>
                        <Link href={courses[1].link}>
                            <h4 className="bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition-colors duration-300
                                        shadow-md hover:shadow-lg cursor-pointer">
                                {courses[1].buttonText}
                            </h4>
                        </Link>
                    </div>
                </div>
            </div>

            {/* JavaScript Course Card */}
            <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white
                            hover:shadow-xl hover:shadow-teal-100/50 transform hover:-translate-y-2 transition-all duration-300 ease-in-out">
                <div className="w-full h-[200px] relative bg-white flex items-center justify-center p-4">
                    <Image
                        src={courses[2].image}
                        alt={courses[2].title}
                        width={200}
                        height={200}
                        className="object-contain"
                    />
                </div>

                <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 text-teal-800">
                        {courses[2].title}
                    </h3>
                    <p className="text-gray-700 mb-4 text-base leading-relaxed">
                        {courses[2].description}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-teal-600 font-bold text-xl">
                            {courses[2].price}
                        </span>
                        <span className="text-gray-500 px-5 py-2 rounded-full bg-gray-100 cursor-not-allowed">
                            {courses[2].buttonText}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}