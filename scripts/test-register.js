// scripts/test-register.js - ทดสอบการสมัครสมาชิก
async function testRegistration() {
  const currentYearAD = new Date().getFullYear()
  const currentYearBE = currentYearAD + 543

  console.log('🧪 Testing Registration System...\n')
  console.log('Current year information:')
  console.log(`- AD (Christian Era): ${currentYearAD}`)
  console.log(`- BE (Buddhist Era): ${currentYearBE}`)
  console.log('')

  // Test data
  const testData = {
    firstName: 'ทดสอบ',
    lastName: 'ระบบ',
    studentId: '123456789999', // 12 digits
    password: 'password123',
    confirmPassword: 'password123',
    academicYear: currentYearBE // ส่งเป็นปี พ.ศ.
  }

  console.log('📝 Test registration data:')
  console.log(JSON.stringify(testData, null, 2))
  console.log('')

  try {
    console.log('📤 Sending registration request...')
    
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    const responseData = await response.json()

    console.log(`📨 Response status: ${response.status}`)
    console.log('📨 Response data:')
    console.log(JSON.stringify(responseData, null, 2))

    if (response.ok) {
      console.log('\n✅ Registration test PASSED')
    } else {
      console.log('\n❌ Registration test FAILED')
      console.log('Error:', responseData.error)
    }

  } catch (error) {
    console.error('❌ Network error:', error.message)
    console.log('\n💡 Make sure development server is running:')
    console.log('   npm run dev')
  }
}

// Test different academic years
async function testAcademicYears() {
  const currentYearAD = new Date().getFullYear()
  const currentYearBE = currentYearAD + 543

  console.log('\n🔍 Testing different academic years...\n')

  const testYears = [
    { year: currentYearBE - 1, label: 'Previous year (BE)' },
    { year: currentYearBE, label: 'Current year (BE)' },
    { year: currentYearBE + 1, label: 'Next year (BE)' },
    { year: currentYearAD, label: 'Current year (AD) - should fail' },
    { year: 2025, label: 'AD year - should fail' },
    { year: 3000, label: 'Invalid year - should fail' }
  ]

  for (const test of testYears) {
    console.log(`Testing ${test.label}: ${test.year}`)
    
    const testData = {
      firstName: 'ทดสอบ',
      lastName: 'ปี' + test.year,
      studentId: `12345678${String(test.year).slice(-4)}`, // Unique student ID
      password: 'password123',
      confirmPassword: 'password123',
      academicYear: test.year
    }

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })

      const responseData = await response.json()
      
      if (response.ok) {
        console.log(`  ✅ PASSED`)
      } else {
        console.log(`  ❌ FAILED: ${responseData.error}`)
      }
    } catch (error) {
      console.log(`  ❌ ERROR: ${error.message}`)
    }

    console.log('')
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Registration Tests...\n')
  
  await testRegistration()
  await testAcademicYears()
  
  console.log('🏁 Tests completed!')
}

main()