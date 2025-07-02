import Link from "next/link"

const register = () => {
return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Register</h2>
    
    <form className="space-y-4">
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อจริง</label>
        <input 
            type="email" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder=""
        />
        </div>

        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
        <input 
            type="email" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder=""
        />
        </div>

        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">รหัสนักศึกษา</label>
        <input 
            type="email" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder=""
        />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
            <input 
            type="password" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder=""
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่าน</label>
            <input 
            type="password" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder=""
            />
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
            ลงทะเบียน
        </button>
        </form>
    </div>
</div>
  )
}
export default register