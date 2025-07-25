// app/api/profile/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    // ตรวจสอบ token
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    
    // รับข้อมูลจาก request body
    const { firstName, lastName, email, academicYear } = await request.json();

    // ตรวจสอบว่าอีเมลซ้ำกับผู้ใช้คนอื่นหรือไม่
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        NOT: {
          id: decoded.userId
        }
      }
    });

    

    // อัพเดทข้อมูลผู้ใช้
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        firstName,
        lastName,
        email,
        academicYear,
        updatedAt: new Date()
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentId: true,
        email: true,
        academicYear: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'อัพเดทข้อมูลสำเร็จ'
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล' }, { status: 500 });
  }
}