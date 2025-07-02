const login = () => {
return (
<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>
    
    <form className="space-y-4">
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
        
        {/* ช่องลืมรหัส */}
        {/* <div className="flex items-center justify-between">
            <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">ลืมรหัสผ่าน ?</a>
        </div> */}

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
            Sign In
        </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
        สามารถสมัครได้ที่ 
        <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium pl-1">Sign up</a>
        </div>
    </div>
</div>
)
}
export default login