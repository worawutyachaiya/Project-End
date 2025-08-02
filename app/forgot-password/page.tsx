//app/forgot-password/page.tsx
"use client"

import { useState, useMemo } from "react"

const ForgotPassword = () => {
  const [studentId, setStudentId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [resetUrl, setResetUrl] = useState('') // สำหรับ development mode

  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')
    setResetUrl('')

    if (!studentId) {
      setError("กรุณากรอกรหัสนักเรียน")
      setIsLoading(false)
      return
    }

    if (studentId.length < 12) {
      setError("รหัสนักเรียนต้องมีอย่างน้อย 12 ตัวอักษร")
      setIsLoading(false)
      return
    }

    if (!/^\d+$/.test(studentId)) {
      setError("รหัสนักเรียนต้องเป็นตัวเลขเท่านั้น")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาด")
      } else {
        setMessage(data.message)
        if (data.resetUrl) {
          setResetUrl(data.resetUrl) // สำหรับ development mode
        }
      }
    } catch (requestError) {
      console.error('Forgot password request error:', requestError)
      setError("เกิดข้อผิดพลาดในการส่งคำขอ")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-red-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 right-1/3 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Particle animation */}
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

      {/* Forgot password card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                ลืมรหัสผ่าน
              </h1>
              <p className="text-white/70 text-sm">กรอกรหัสนักเรียนเพื่อรีเซ็ตรหัสผ่าน</p>
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

            {message && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 text-green-100 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {message}
                </div>
                
                {resetUrl && (
                  <div className="mt-4 p-3 bg-black/20 rounded-lg">
                    <p className="text-sm text-yellow-200 mb-2">🔧 Development Mode - ลิงก์รีเซ็ต:</p>
                    <a 
                      href={resetUrl}
                      className="text-yellow-300 underline text-sm break-all hover:text-yellow-100"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resetUrl}
                    </a>
                    <p className="text-xs text-yellow-200/80 mt-2">
                      คลิกลิงก์ด้านบนเพื่อรีเซ็ตรหัสผ่าน
                    </p>
                  </div>
                )}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="group">
                <label className="block text-sm font-medium text-white/90 mb-2">รหัสนักเรียน</label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="กรอกรหัสนักเรียน 12 หลัก"
                    disabled={isLoading}
                    maxLength={12}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังส่งคำขอ...
                  </div>
                ) : (
                  '📤 ส่งลิงก์รีเซ็ตรหัสผ่าน'
                )}
              </button>
            </form>

            <div className="mt-8 text-center space-y-3">
              <p className="text-white/70 text-sm">
                จำรหัสผ่านได้แล้ว?{' '}
                <a 
                  href="/login" 
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200 hover:underline"
                >
                  เข้าสู่ระบบ
                </a>
              </p>
              <p className="text-white/70 text-sm">
                ยังไม่มีบัญชี?{' '}
                <a 
                  href="/register" 
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200 hover:underline"
                >
                  สมัครสมาชิก
                </a>
              </p>
            </div>

            {/* Help Section */}
            <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="text-white font-medium mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                ช่วยเหลือ
              </h3>
              <div className="text-white/70 text-sm space-y-2">
                <p>• หากไม่ได้รับอีเมล ให้ตรวจสอบในโฟลเดอร์ spam</p>
                <p>• ลิงก์รีเซ็ตจะหมดอายุใน 1 ชั่วโมง</p>
                <p>• ติดต่อแอดมินหากมีปัญหา</p>
              </div>
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

export default ForgotPassword