// scripts/fix-migration.js - แก้ไข migration อัตโนมัติ
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixMigration() {
  try {
    console.log('🔧 Auto-fixing migration...\n')

    // 1. ตรวจสอบว่า email column มีอยู่หรือไม่
    console.log('1. Checking if email column exists...')
    
    try {
      // ลองดึงข้อมูล email จาก user คนแรก
      await prisma.user.findFirst({
        select: { email: true }
      })
      console.log('✅ Email column already exists!')
    } catch (error) {
      if (error.message.includes('email')) {
        console.log('❌ Email column does not exist')
        console.log('🔧 Adding email column manually...')
        
        // เพิ่ม email column ด้วย raw SQL
        await prisma.$executeRaw`
          DO $$ 
          BEGIN
              IF NOT EXISTS (
                  SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'User' AND column_name = 'email'
              ) THEN
                  ALTER TABLE "User" ADD COLUMN "email" TEXT;
                  UPDATE "User" SET "email" = "studentId" || '@student.temp' WHERE "email" IS NULL;
                  ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;
                  ALTER TABLE "User" ADD CONSTRAINT "User_email_key" UNIQUE ("email");
              END IF;
          END $$;
        `
        
        console.log('✅ Email column added successfully!')
      } else {
        throw error
      }
    }

    // 2. ตรวจสอบข้อมูล users ปัจจุบัน
    console.log('\n2. Checking current users...')
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentId: true,
        email: true
      },
      take: 5
    })

    console.log(`Found ${users.length} users:`)
    users.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.studentId}) - Email: ${user.email}`)
    })

    // 3. อัปเดตอีเมลชั่วคราวให้เป็นรูปแบบที่ดีกว่า
    console.log('\n3. Updating temporary emails...')
    const tempEmailUsers = await prisma.user.findMany({
      where: {
        email: { endsWith: '@student.temp' }
      }
    })

    if (tempEmailUsers.length > 0) {
      console.log(`Found ${tempEmailUsers.length} users with temporary emails`)
      
      for (const user of tempEmailUsers) {
        const newEmail = `${user.studentId}@student.example.com`
        await prisma.user.update({
          where: { id: user.id },
          data: { email: newEmail }
        })
        console.log(`Updated: ${user.firstName} ${user.lastName} -> ${newEmail}`)
      }
    }

    console.log('\n✅ Migration fix completed successfully!')
    console.log('\n💡 Next steps:')
    console.log('1. Run: npx prisma generate')
    console.log('2. Test registration with email field')
    console.log('3. Test forgot password functionality')

  } catch (error) {
    console.error('❌ Error fixing migration:', error)
    
    if (error.message.includes('relation') || error.message.includes('column')) {
      console.log('\n💡 Database structure issue detected.')
      console.log('Consider using: npx prisma migrate reset (WARNING: will delete all data)')
      console.log('Or manually run the SQL commands in your database client')
    }
  } finally {
    await prisma.$disconnect()
  }
}

fixMigration()