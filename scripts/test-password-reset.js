// scripts/test-password-reset.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testPasswordReset() {
  try {
    console.log('🧪 Testing Password Reset System...\n')

    // 1. ดูผู้ใช้ในระบบ
    const users = await prisma.user.findMany({
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        resetToken: true,
        resetTokenExpiry: true
      },
      take: 5
    })

    console.log('📋 Users in system:')
    console.log('─'.repeat(50))
    users.forEach(user => {
      const hasResetToken = user.resetToken ? '🔑' : '❌'
      const tokenExpiry = user.resetTokenExpiry 
        ? new Date(user.resetTokenExpiry).toLocaleString('th-TH')
        : 'ไม่มี'
      
      console.log(`${hasResetToken} ${user.studentId} - ${user.firstName} ${user.lastName}`)
      console.log(`   Reset Token: ${user.resetToken ? 'มี' : 'ไม่มี'}`)
      console.log(`   หมดอายุ: ${tokenExpiry}`)
      console.log('')
    })

    // 2. ดู active reset tokens
    const activeTokens = await prisma.user.findMany({
      where: {
        resetToken: {
          not: null
        },
        resetTokenExpiry: {
          gt: new Date()
        }
      },
      select: {
        studentId: true,
        firstName: true,
        lastName: true,
        resetToken: true,
        resetTokenExpiry: true
      }
    })

    console.log('\n🔐 Active Reset Tokens:')
    console.log('─'.repeat(50))
    if (activeTokens.length === 0) {
      console.log('ไม่มี reset token ที่ active อยู่')
    } else {
      activeTokens.forEach(user => {
        console.log(`👤 ${user.firstName} ${user.lastName} (${user.studentId})`)
        console.log(`🔑 Token: ${user.resetToken.substring(0, 8)}...`)
        console.log(`⏰ หมดอายุ: ${new Date(user.resetTokenExpiry).toLocaleString('th-TH')}`)
        console.log(`🔗 Reset URL: http://localhost:3000/reset-password?token=${user.resetToken}`)
        console.log('')
      })
    }

    // 3. ทำความสะอาด expired tokens
    const cleanupResult = await prisma.user.updateMany({
      where: {
        resetTokenExpiry: {
          lt: new Date()
        }
      },
      data: {
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    if (cleanupResult.count > 0) {
      console.log(`🧹 Cleaned up ${cleanupResult.count} expired reset tokens`)
    }

  } catch (error) {
    console.error('❌ Error testing password reset:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPasswordReset()