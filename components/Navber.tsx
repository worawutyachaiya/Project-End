"use client"; // เพิ่มบรรทัดนี้ที่ด้านบนสุดของไฟล์

import Link from "next/link";
import { useState } from "react"; // นำเข้า useState เพื่อจัดการสถานะของเมนูมือถือ

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // สถานะสำหรับเปิด/ปิดเมนูมือถือ

return (
        <nav className="bg-white bg-opacity-70 backdrop-blur-sm text-gray-700 p-4 rounded-xl shadow-lg m-4"> {/* ปรับพื้นหลัง navbar และสีข้อความหลัก */}
        <div className="container mx-auto flex justify-between items-center flex-wrap">
            {/* Logo */}
            <div>
            <h1 className="text-2xl font-bold text-teal-700">Logo</h1> {/* เปลี่ยนสี Logo */}
            </div>

            {/* Hamburger Icon สำหรับมือถือ */}
            <div className="block lg:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center px-3 py-2 border rounded text-gray-700 border-gray-400 hover:text-teal-700 hover:border-teal-700 transition-colors duration-200" // ปรับสีปุ่ม Hamburger
            >
                <svg
                className="fill-current h-4 w-4" // ปรับขนาด icon ให้ใหญ่ขึ้นนิดหน่อย
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
            </button>
            </div>

            {/* เมนูนำทางและช่องค้นหา/ปุ่ม Login */}
            <div
            className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${
                isOpen ? "block" : "hidden"
            }`}
            >
            <ul className="lg:flex flex-grow justify-center lg:space-x-20 mt-4 lg:mt-0">
                <li>
                <Link
                    href="/"
                    className="block py-2 hover:text-teal-700 transition-colors duration-200" // เปลี่ยนสีโฮเวอร์
                >
                    หน้าแรก
                </Link>
                </li>
                <li>
                <Link
                    href="/couse"
                    className="block py-2 hover:text-teal-700 transition-colors duration-200" // เปลี่ยนสีโฮเวอร์
                >
                    คอร์สเรียน
                </Link>
                </li>
                <li>
                <Link
                    href="/"
                    className="block py-2 hover:text-teal-700 transition-colors duration-200" // เปลี่ยนสีโฮเวอร์
                >
                    ข่าวสาร
                </Link>
                </li>
                <li>
                <Link
                    href="/"
                    className="block py-2 hover:text-teal-700 transition-colors duration-200" // เปลี่ยนสีโฮเวอร์
                >
                    เกี่ยวกับเรา
                </Link>
                </li>
            </ul>

            {/* ช่องค้นหาและปุ่ม Login */}
            <div className="flex items-center space-x-8 mt-4 lg:mt-0 flex-col lg:flex-row w-full lg:w-auto">
                <div className="relative flex items-center w-full lg:w-64 mb-4 lg:mb-0">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-3 text-gray-500 h-5 w-5" // ปรับสี icon ค้นหา
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z"></path>
                </svg>
                <input
                    type="text"
                    placeholder="ค้นหา..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 bg-opacity-80 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-500" // ปรับสีช่องค้นหา
                />
                </div>
                <div>
                <Link href="/login">
                    <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200 w-full lg:w-auto"> {/* ปรับสีปุ่ม Login */}
                    Login
                    </button>
                </Link>
                </div>
            </div>
            </div>
        </div>
        </nav>
    );
};

export default Navbar;