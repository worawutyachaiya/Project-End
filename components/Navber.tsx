import Link from "next/link"
const Navber = () => {
    return (
        <nav className="bg-black text-amber-500 p-4">
    <div className="container mx-auto flex justify-between items-center">
        <div>
        <h1 className="text-2xl font-bold">Logo</h1>
        </div>
        <ul className="flex space-x-20">
        <li>
            <Link href="/" className="hover:text-white transition-colors duration-200">
                หน้าแรก
            </Link>
        </li>
        <li>
            <Link href="/couse" className="hover:text-white transition-colors duration-200">
                คอร์สเรียน
            </Link>
        </li>
        <li>
            <Link href="/" className="hover:text-white transition-colors duration-200">
                ข่าวสาร
            </Link>
        </li>
        <li>
            <Link href="/" className="hover:text-white transition-colors duration-200">
                เกี่ยวกับเรา
            </Link>
        </li>
        </ul>
        <div className="flex items-center space-x-8">
        <div className="relative flex items-center w-64">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 text-gray-400 h-5 w-5"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            >
            <path
                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z"
            ></path>
            </svg>

            <input
            type="text"
            placeholder="ค้นหา..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
            style={{ paddingRight: '2.5rem' }} 
            />

        </div>
        <div>
            <Link href="/login">
                <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200">
                    Login
                </button>
            </Link>
        </div>
        </div>
    </div>
    </nav>
    )
}
export default Navber