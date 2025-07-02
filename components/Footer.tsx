import Link from "next/link"
const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
                <h3 className="text-2xl font-bold mb-4">Logo</h3>
                <p className="text-gray-400 text-sm">
                    เว็บไซต์ของคุณเป็นแหล่งรวมข้อมูลที่น่าเชื่อถือและครบวงจร
                    สำหรับทุกความต้องการของคุณ
                </p>
            </div>

            <div className="col-span-1">
                <h4 className="text-lg font-semibold mb-4">เมนู</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">หน้าแรก</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">เกี่ยวกับเรา</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">บริการ</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">ติดต่อ</a></li>
                </ul>
            </div>

            <div className="col-span-1">
                <h4 className="text-lg font-semibold mb-4">ลิงก์ที่เป็นประโยชน์</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">นโยบายความเป็นส่วนตัว</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">ข้อกำหนดและเงื่อนไข</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">คำถามที่พบบ่อย</a></li>
                </ul>
            </div>

            <div className="col-span-1">
                <h4 className="text-lg font-semibold mb-4">ติดตามเรา</h4>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                        
                    </a>
                </div>
            </div>
        </div>

        <hr className="border-gray-700 my-8"/>

        <div className="text-center text-gray-400 text-sm">
            &copy; 2025 RUS-Learning. All rights reserved.
        </div>
    </div>
</footer>
    )
}
export default Footer