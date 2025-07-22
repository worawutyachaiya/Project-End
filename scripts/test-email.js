// scripts/test-email-fixed.js - แก้ไขปัญหา createTransport แล้ว
const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')

// ฟังก์ชันหาไฟล์ .env.local
function findEnvFile() {
  const possiblePaths = [
    path.join(__dirname, '..', '.env.local'),
    path.join(__dirname, '..', '.env'),
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env')
  ]

  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      console.log(`✅ Found env file: ${envPath}`)
      return envPath
    }
  }
  return null
}

// อ่าน .env file
function loadEnvFile() {
  const envPath = findEnvFile()
  
  if (!envPath) {
    console.log('❌ No .env file found!')
    return false
  }

  try {
    const envFile = fs.readFileSync(envPath, 'utf8')
    console.log(`📄 Reading ${path.basename(envPath)}...`)
    
    let loadedCount = 0
    envFile.split('\n').forEach(line => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '')
          process.env[key] = value
          loadedCount++
        }
      }
    })
    
    console.log(`✅ Loaded ${loadedCount} environment variables`)
    return true
  } catch (error) {
    console.log('❌ Error reading env file:', error.message)
    return false
  }
}

async function testEmailConfig() {
  console.log('📧 Testing Email Configuration - Fixed Version\n')

  // โหลด environment variables
  if (!loadEnvFile()) {
    return
  }

  console.log('\n🔍 Environment Variables:')
  const envVars = {
    'SMTP_HOST': process.env.SMTP_HOST,
    'SMTP_PORT': process.env.SMTP_PORT,
    'SMTP_SECURE': process.env.SMTP_SECURE,
    'SMTP_USER': process.env.SMTP_USER,
    'SMTP_PASS': process.env.SMTP_PASS ? '***[HIDDEN]***' : 'NOT SET',
    'FROM_NAME': process.env.FROM_NAME,
    'FROM_EMAIL': process.env.FROM_EMAIL
  }

  Object.entries(envVars).forEach(([key, value]) => {
    const status = value && value !== 'NOT SET' ? '✅' : '❌'
    console.log(`${status} ${key}: ${value || 'NOT SET'}`)
  })

  // ตรวจสอบค่าที่จำเป็น
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'FROM_EMAIL']
  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.log('\n❌ Missing required variables:')
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`)
    })
    return
  }

  // ตรวจสอบ SMTP_PASS format
  const smtpPass = process.env.SMTP_PASS
  console.log(`\n🔍 SMTP Password Info:`)
  console.log(`   Length: ${smtpPass.length} characters`)
  console.log(`   Has spaces: ${smtpPass.includes(' ') ? 'YES (will be removed)' : 'NO'}`)
  
  if (smtpPass.includes(' ')) {
    console.log(`   Original: "${smtpPass}"`)
    console.log(`   Cleaned: "${smtpPass.replace(/\s/g, '')}"`)
  }

  console.log('\n🔧 Creating email transport...')
  
  try {
    // แก้ไข: ใช้ createTransport ไม่ใช่ createTransporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: smtpPass.replace(/\s/g, '') // Remove any spaces
      },
      // เพิ่ม debug options
      debug: true,
      logger: false
    })

    console.log('✅ Transport created successfully')

    console.log('\n📡 Testing SMTP connection...')
    await transporter.verify()
    console.log('✅ SMTP connection verified!')

    console.log('\n📤 Sending test email...')
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Learning System'}" <${process.env.FROM_EMAIL}>`,
      to: process.env.SMTP_USER, // ส่งให้ตัวเอง
      subject: '🧪 Email Configuration Test - SUCCESS!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="margin: 0;">🎉 Email Test Successful!</h1>
          </div>
          
          <h2 style="color: #4CAF50;">✅ Your Email Configuration is Working!</h2>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>📊 Test Details:</h3>
            <ul>
              <li><strong>Tested on:</strong> ${new Date().toLocaleString('th-TH')}</li>
              <li><strong>From Email:</strong> ${process.env.FROM_EMAIL}</li>
              <li><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</li>
              <li><strong>SMTP Port:</strong> ${process.env.SMTP_PORT}</li>
            </ul>
          </div>

          <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>🚀 Ready to Use Features:</h3>
            <ol>
              <li><strong>Forgot Password:</strong> <a href="http://localhost:3000/forgot-password">Test Now</a></li>
              <li><strong>User Registration:</strong> <a href="http://localhost:3000/register">Sign Up</a></li>
              <li><strong>Login:</strong> <a href="http://localhost:3000/login">Sign In</a></li>
            </ol>
          </div>

          <div style="background: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4>💡 How to Test Forgot Password:</h4>
            <ol>
              <li>Go to <a href="http://localhost:3000/forgot-password">Forgot Password page</a></li>
              <li>Enter any valid student ID from your database</li>
              <li>Check this email for the reset link</li>
              <li>Click the link to reset password</li>
            </ol>
          </div>

          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            This is an automated test email from your Learning Management System<br>
            Sent at ${new Date().toISOString()}
          </p>
        </div>
      `,
      text: `
Email Configuration Test - SUCCESS!

Your email system is working correctly.

Test Details:
- Tested on: ${new Date().toLocaleString('th-TH')}
- From: ${process.env.FROM_EMAIL}
- SMTP: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}

Ready to use:
1. Forgot Password: http://localhost:3000/forgot-password
2. Registration: http://localhost:3000/register
3. Login: http://localhost:3000/login

This email confirms your SMTP configuration is working properly.
      `
    }

    const info = await transporter.sendMail(mailOptions)
    
    console.log('✅ Test email sent successfully!')
    console.log('📨 Message ID:', info.messageId)
    console.log('📬 Sent to:', process.env.SMTP_USER)
    console.log('📋 Response:', info.response)
    
    console.log('\n🎉 EMAIL SYSTEM IS FULLY OPERATIONAL!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ SMTP Connection: Working')
    console.log('✅ Authentication: Success')  
    console.log('✅ Email Sending: Success')
    console.log('✅ Configuration: Complete')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    console.log('\n🔗 Ready to test features:')
    console.log('• Forgot Password: http://localhost:3000/forgot-password')
    console.log('• Registration: http://localhost:3000/register') 
    console.log('• Login: http://localhost:3000/login')
    
    console.log('\n📧 Check your inbox for the test email!')

  } catch (error) {
    console.error('\n❌ Email test failed:', error.message)
    
    if (error.code) {
      console.log(`📋 Error Code: ${error.code}`)
    }
    
    if (error.message.includes('Authentication failed') || error.code === 'EAUTH') {
      console.log('\n🔧 Authentication Error Solutions:')
      console.log('1. Double-check your Gmail App Password')
      console.log('2. Make sure 2-Factor Authentication is enabled')
      console.log('3. Generate a new App Password: https://myaccount.google.com/apppasswords')
      console.log('4. App Password should be 16 characters without spaces')
      console.log(`5. Current password length: ${smtpPass.length} characters`)
    } else if (error.message.includes('ECONNREFUSED') || error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Connection Error Solutions:')
      console.log('1. Check your internet connection')
      console.log('2. Try using mobile hotspot')
      console.log('3. Check firewall/antivirus settings')
      console.log('4. Verify SMTP settings (Host: smtp.gmail.com, Port: 587)')
    } else if (error.message.includes('ETIMEDOUT') || error.code === 'ETIMEDOUT') {
      console.log('\n🔧 Timeout Error Solutions:')
      console.log('1. Check network connection stability')
      console.log('2. Try again in a few minutes')
      console.log('3. Check if your ISP blocks SMTP')
    }
  }
}

testEmailConfig()