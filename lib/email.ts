// lib/email.ts
import nodemailer from 'nodemailer';

// สร้าง transporter (ใช้ Gmail หรือ SMTP service อื่น)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER, // Gmail address หรือ SMTP user
    pass: process.env.SMTP_PASS, // Gmail app password หรือ SMTP password
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'Learning System'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const generatePasswordResetEmail = (name: string, resetUrl: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="th">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>รีเซ็ตรหัสผ่าน</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .button:hover { background: #5a67d8; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 รีเซ็ตรหัสผ่าน</h1>
            </div>
            <div class="content">
                <h2>สวัสดี, ${name}</h2>
                <p>เราได้รับคำขอให้รีเซ็ตรหัสผ่านสำหรับบัญชีของคุณในระบบเรียนรู้ออนไลน์</p>
                
                <p>หากคุณต้องการรีเซ็ตรหัสผ่าน กรุณาคลิกปุ่มด้านล่าง:</p>
                
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">รีเซ็ตรหัสผ่าน</a>
                </div>
                
                <p>หรือคัดลอกลิงก์นี้ไปวางในเบราว์เซอร์:</p>
                <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">
                    ${resetUrl}
                </p>
                
                <div class="warning">
                    <strong>⚠️ ข้อควรระวัง:</strong>
                    <ul>
                        <li>ลิงก์นี้จะหมดอายุใน <strong>1 ชั่วโมง</strong></li>
                        <li>หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยต่ออีเมลนี้</li>
                        <li>อย่าแชร์ลิงก์นี้กับผู้อื่น</li>
                    </ul>
                </div>
                
                <p>หากคุณมีปัญหาหรือข้อสงสัย กรุณาติดต่อแอดมิน</p>
            </div>
            <div class="footer">
                <p>© 2024 ระบบเรียนรู้ออนไลน์ HTML & CSS</p>
                <p><em>อีเมลนี้ถูกส่งโดยอัตโนมัติ กรุณาอย่าตอบกลับ</em></p>
            </div>
        </div>
    </body>
    </html>
  `;
};