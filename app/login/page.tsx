"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const Login = () => {
  const router = useRouter()
  const [form, setForm] = useState({ studentId: '', password: '' })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!form.studentId || !form.password) {
      alert("กรุณากรอกข้อมูลให้ครบ")
      return
    }

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const data = await res.json()
    if (!res.ok) {
      alert(data.error || "เข้าสู่ระบบไม่สำเร็จ")
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสนักศึกษา</label>
            <input 
              name="studentId"
              type="text"
              value={form.studentId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
            <input 
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ยังไม่มีบัญชี?
          <a href="/register" className="text-indigo-600 hover:text-indigo-500 font-medium pl-1">สมัครสมาชิก</a>
        </div>
      </div>
    </div>
  )
}

export default Login
