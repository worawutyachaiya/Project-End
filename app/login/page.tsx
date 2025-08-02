//app/login/page.tsx - เพิ่มลิงก์ลืมรหัสผ่าน
"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

const Login = () => {
  const router = useRouter()
  const { login, user } = useAuth()
  
  const [form, setForm] = useState({
    studentId: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // redirect ถ้ามีผู้ใช้อยู่แล้ว
  useEffect(() => {
    if (user) {
      router.push(user.role === 'admin' ? '/admin/quiz' : '/')
    }
  }, [user, router])

  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
    }))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!form.studentId || !form.password) {
      setError("กรุณากรอกรหัสนักเรียนและรหัสผ่าน")
      setIsLoading(false)
      return
    }

    const success = await login(form.studentId, form.password)
    
    if (!success) {
      setError("รหัสนักเรียนหรือรหัสผ่านไม่ถูกต้อง")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 right-1/3 w-72 h-72 bg-gradient-to-r from-pink-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Particle animation */}
      {isClient && (
        <div className="absolute inset-0">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                animation: `float ${p.duration}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Login card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-white/70 text-sm">เข้าสู่ระบบเรียนรู้ของคุณ</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-100 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="group">
                <label className="block text-sm font-medium text-white/90 mb-2">รหัสนักเรียน</label>
                <div className="relative">
                  <input
                    name="studentId"
                    type="text"
                    value={form.studentId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="กรอกรหัสนักเรียน"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-white/90 mb-2">รหัสผ่าน</label>
                <div className="relative">
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="กรอกรหัสผ่าน"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <a 
                  href="/forgot-password" 
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-200 hover:underline"
                >
                  ลืมรหัสผ่าน?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังเข้าสู่ระบบ...
                  </div>
                ) : (
                  'เข้าสู่ระบบ'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/70 text-sm">
                ยังไม่มีบัญชี?{' '}
                <a 
                  href="/register" 
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200 hover:underline"
                >
                  สมัครสมาชิก
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}

export default Login