    import Link from "next/link";
    const Footer = () => {
    return (
        // เปลี่ยนสีพื้นหลัง Footer เป็นสีเขียวอ่อนที่เข้ากับธีม
        <footer className="bg-white bg-opacity-70 backdrop-blur-sm text-gray-700 p-4 rounded-xl shadow-lg m-4">
        {" "}
        {/* เพิ่ม py-12 เพื่อให้มี padding ด้านบนและล่าง */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
                {/* สี Logo เป็นสีเขียวอมน้ำเงินที่เข้มขึ้น */}
                <h3 className="text-2xl font-bold mb-4 text-teal-800">Logo</h3>
                {/* สีข้อความทั่วไปเป็นสีเทาเข้ม เพื่อให้อ่านง่ายบนพื้นหลังสว่าง */}
                <p className="text-gray-700 text-sm">
                เว็บไซต์ของคุณเป็นแหล่งรวมข้อมูลที่น่าเชื่อถือและครบวงจร
                สำหรับทุกความต้องการของคุณ
                </p>
            </div>

            <div className="col-span-1">
                {/* สีหัวข้อเป็นสีเขียวอมน้ำเงิน */}
                <h4 className="text-lg font-semibold mb-4 text-teal-700">เมนู</h4>
                <ul className="space-y-2">
                <li>
                    {/* สีลิงก์ปกติเป็นเทาเข้ม และโฮเวอร์เป็นสีเขียวอมน้ำเงินที่เข้มขึ้น */}
                    <a
                    href="#"
                    className="text-gray-700 hover:text-teal-800 transition duration-300"
                    >
                    หน้าแรก
                    </a>
                </li>
                <li>
                    <a
                    href="#"
                    className="text-gray-700 hover:text-teal-800 transition duration-300"
                    >
                    คอร์สเรียน
                    </a>
                </li>
                <li>
                    <a
                    href="#"
                    className="text-gray-700 hover:text-teal-800 transition duration-300"
                    >
                    ข่าวสาร
                    </a>
                </li>
                <li>
                    <a
                    href="#"
                    className="text-gray-700 hover:text-teal-800 transition duration-300"
                    >
                    เกี่ยวกับเรา
                    </a>
                </li>
                </ul>
            </div>

            <div className="col-span-1">
                {/* สีหัวข้อเป็นสีเขียวอมน้ำเงิน */}
                <h4 className="text-lg font-semibold mb-4 text-teal-700">
                ลิงก์ที่เป็นประโยชน์
                </h4>
                <ul className="space-y-2">
                <li>
                    <a
                    href="#"
                    className="text-gray-700 hover:text-teal-800 transition duration-300"
                    >
                    นโยบายความเป็นส่วนตัว
                    </a>
                </li>
                <li>
                    <a
                    href="#"
                    className="text-gray-700 hover:text-teal-800 transition duration-300"
                    >
                    ข้อกำหนดและเงื่อนไข
                    </a>
                </li>
                <li>
                    <a
                    href="#"
                    className="text-gray-700 hover:text-teal-800 transition duration-300"
                    >
                    คำถามที่พบบ่อย
                    </a>
                </li>
                </ul>
            </div>

            <div className="col-span-1">
                {/* สีหัวข้อเป็นสีเขียวอมน้ำเงิน */}
                <h4 className="text-lg font-semibold mb-4 text-teal-700">
                ติดตามเรา
                </h4>
                <div className="flex space-x-4">
                {/* ตรงนี้คุณสามารถเพิ่ม icon Social Media เช่นจาก Heroicons หรือ Font Awesome */}
                <a
                    href="#"
                    className="text-gray-700 hover:text-teal-800 transition duration-300"
                >
                    {/* ตัวอย่าง Icon: แทนที่ด้วย SVG ของ Facebook, Twitter, Instagram ฯลฯ */}
                    {/* <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">...</svg> */}
                    Facebook
                </a>
                <a
                    href="#"
                    className="text-gray-700 hover:text-teal-800 transition duration-300"
                >
                    Twitter
                </a>
                <a
                    href="#"
                    className="text-gray-700 hover:text-teal-800 transition duration-300"
                >
                    Instagram
                </a>
                </div>
            </div>
            </div>

            {/* เส้นคั่นเป็นสีเทาอ่อนลง */}
            <hr className="border-gray-300 my-8" />

            {/* ข้อความลิขสิทธิ์เป็นสีเทาเข้ม */}
            <div className="text-center text-gray-700 text-sm">
            &copy; 2025 RUS-Learning. All rights reserved.
            </div>
        </div>
        </footer>
    );
    };
    export default Footer;