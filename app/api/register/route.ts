import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { firstName, lastName, studentId, password, confirmPassword } = body;

  if (password !== confirmPassword) {
    return new Response(JSON.stringify({ error: "รหัสผ่านไม่ตรงกัน" }), { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { studentId } });
  if (existingUser) {
    return new Response(JSON.stringify({ error: "มีรหัสนักศึกษาในระบบแล้ว" }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      studentId,
      password: hashedPassword
    }
  });

  return new Response(JSON.stringify({ message: "ลงทะเบียนสำเร็จ", user }), { status: 200 });
}
