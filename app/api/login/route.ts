import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { studentId, password } = await req.json()

  const user = await prisma.user.findUnique({ where: { studentId } })
  if (!user) {
    return new Response(JSON.stringify({ error: "ไม่พบบัญชีนี้" }), { status: 401 })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return new Response(JSON.stringify({ error: "รหัสผ่านไม่ถูกต้อง" }), { status: 401 })
  }

  // จำลอง session (จริง ๆ ต้องเก็บใน cookie / token)
  return new Response(JSON.stringify({ message: "เข้าสู่ระบบสำเร็จ", user }), { status: 200 })
}
