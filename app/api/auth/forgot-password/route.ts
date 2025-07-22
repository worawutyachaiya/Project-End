// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendEmail, generatePasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json(
        { error: 'กรุณากรอกรหัสนักเรียน' },
        { status: 400 }
      );
    }

    // หาผู้ใช้จากรหัสนักเรียน
    const user = await prisma.user.findUnique({
      where: { studentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentId: true,
        email: true,  // เพิ่มการดึงอีเมล
        role: true
      }
    });

    if (!user) {
      // ส่ง response แบบเดียวกันไม่ว่าจะมีผู้ใช้หรือไม่ เพื่อป้องกัน user enumeration
      return NextResponse.json({
        message: 'หากรหัสนักเรียนถูกต้อง คุณจะได้รับอีเมลสำหรับรีเซ็ตรหัสผ่าน'
      });
    }

    // สร้าง reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // อัปเดท user ด้วย reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // สร้าง reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // สำหรับ demo - ถ้าไม่มีการตั้งค่า email ให้แสดง URL ใน console
    if (!process.env.SMTP_USER) {
      console.log('🔐 Password Reset URL (Email not configured):');
      console.log(resetUrl);
      console.log('─'.repeat(50));
      
      return NextResponse.json({
        message: 'ลิงก์รีเซ็ตรหัสผ่านได้แสดงใน console (สำหรับการทดสอบ)',
        resetUrl: resetUrl // ส่งกลับใน development mode
      });
    }

    // ส่งอีเมล (ใช้อีเมลจริงของผู้ใช้)
    const emailSent = await sendEmail({
      to: user.email, // ใช้อีเมลจริงของผู้ใช้
      subject: '🔐 รีเซ็ตรหัสผ่าน - ระบบเรียนรู้ออนไลน์',
      html: generatePasswordResetEmail(`${user.firstName} ${user.lastName}`, resetUrl),
      text: `สวัสดี ${user.firstName} ${user.lastName},\n\nกรุณาคลิกลิงก์นี้เพื่อรีเซ็ตรหัสผ่าน: ${resetUrl}\n\nลิงก์จะหมดอายุใน 1 ชั่วโมง`
    });

    if (!emailSent) {
      console.error('Failed to send email, but token is created');
    }

    return NextResponse.json({
      message: 'หากรหัสนักเรียนถูกต้อง คุณจะได้รับอีเมลสำหรับรีเซ็ตรหัสผ่าน'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    );
  }
}