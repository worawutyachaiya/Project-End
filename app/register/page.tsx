"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const Register = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!form.firstName || !form.lastName || !form.studentId || !form.password || !form.confirmPassword) {
      alert("กรุณากรอกข้อมูลให้ครบ")
      return
    }

    if (form.password !== form.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน")
      return
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const data = await res.json()
    if (!res.ok) {
      alert(data.error || "เกิดข้อผิดพลาด")
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Register</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อจริง</label>
            <input
              name="firstName"
              type="text"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
            <input
              name="lastName"
              type="text"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสนักศึกษา</label>
            <input
              name="studentId"
              type="text"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่าน</label>
            <input
              name="confirmPassword"
              type="password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-full">
            ลงทะเบียน
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
