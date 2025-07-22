// scripts/check-users.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    console.log('Checking users after migration...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        academicYear: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
    
    console.log(`Total users: ${users.length}`)
    console.log('\nUsers list:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    users.forEach((user, index) => {
      const createdDate = new Date(user.createdAt).toLocaleDateString('th-TH')
      const academicYearBE = user.academicYear + 543 // Convert to Buddhist Era for display
      console.log(`${index + 1}. ${user.studentId} | ${user.firstName} ${user.lastName}`)
      console.log(`   ปีการศึกษา: ${academicYearBE} | สร้าง: ${createdDate} | สถานะ: ${user.role}`)
      console.log('')
    })
    
    // สถิติปีการศึกษา
    const yearStats = users.reduce((stats, user) => {
      const yearBE = user.academicYear + 543 // Convert to Buddhist Era for display
      stats[yearBE] = (stats[yearBE] || 0) + 1
      return stats
    }, {})
    
    console.log('สถิติตามปีการศึกษา:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    Object.entries(yearStats).forEach(([year, count]) => {
      console.log(`ปี ${year}: ${count} คน`)
    })
    
  } catch (error) {
    console.error('Error checking users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()