// app/api/quiz-results/route.ts - Fixed version without unique constraint
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      userId,
      studentId, 
      quizType, 
      phase, 
      lesson,
      score, 
      totalScore, 
      percentage,
      passed,
      answers 
    } = body

    // Validate required fields
    if (!userId || !studentId || !quizType || !phase || lesson === undefined || score === undefined || !totalScore || percentage === undefined) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Validate lesson number
    if (lesson < 1 || lesson > 10) {
      return NextResponse.json(
        { error: 'บทเรียนต้องอยู่ระหว่าง 1-10' },
        { status: 400 }
      )
    }

    // Validate phase
    if (!['pre', 'post'].includes(phase)) {
      return NextResponse.json(
        { error: 'phase ต้องเป็น pre หรือ post' },
        { status: 400 }
      )
    }

    // สำหรับ pretest - ตรวจสอบว่ามีการทำไปแล้วหรือไม่
    if (phase === 'pre') {
      const existingResult = await prisma.quizResult.findFirst({
        where: {
          userId: parseInt(userId),
          quizType: quizType,
          phase: 'pre',
          lesson: parseInt(lesson)
        }
      })

      if (existingResult) {
        // Update existing result
        const quizResult = await prisma.quizResult.update({
          where: { id: existingResult.id },
          data: {
            score: parseInt(score),
            totalScore: parseInt(totalScore),
            percentage: parseFloat(percentage),
            passed: passed || false,
            answers: JSON.stringify(answers),
            completedAt: new Date()
          }
        })

        return NextResponse.json({
          message: 'อัพเดทผลสอบก่อนเรียนสำเร็จ',
          id: quizResult.id,
          passed: quizResult.passed,
          percentage: quizResult.percentage,
          phase: 'pre',
          isUpdate: true
        })
      } else {
        // Create new result
        const quizResult = await prisma.quizResult.create({
          data: {
            userId: parseInt(userId),
            studentId: studentId,
            quizType: quizType,
            phase: phase,
            lesson: parseInt(lesson),
            score: parseInt(score),
            totalScore: parseInt(totalScore),
            percentage: parseFloat(percentage),
            passed: passed || false,
            answers: JSON.stringify(answers),
            completedAt: new Date()
          }
        })

        return NextResponse.json({
          message: 'บันทึกผลสอบก่อนเรียนสำเร็จ',
          id: quizResult.id,
          passed: quizResult.passed,
          percentage: quizResult.percentage,
          phase: 'pre',
          isUpdate: false
        })
      }
    } else {
      // สำหรับ posttest - create ใหม่ทุกครั้ง (unlimited attempts)
      // คำนวณ attempt number จากจำนวนครั้งที่ทำไปแล้ว
      const existingAttempts = await prisma.quizResult.count({
        where: {
          userId: parseInt(userId),
          quizType: quizType,
          phase: 'post',
          lesson: parseInt(lesson)
        }
      })

      const attemptNumber = existingAttempts + 1

      const quizResult = await prisma.quizResult.create({
        data: {
          userId: parseInt(userId),
          studentId: studentId,
          quizType: quizType,
          phase: phase,
          lesson: parseInt(lesson),
          score: parseInt(score),
          totalScore: parseInt(totalScore),
          percentage: parseFloat(percentage),
          passed: passed || false,
          answers: JSON.stringify(answers),
          completedAt: new Date()
        }
      })

      return NextResponse.json({
        message: 'บันทึกผลสอบหลังเรียนสำเร็จ',
        id: quizResult.id,
        passed: quizResult.passed,
        percentage: quizResult.percentage,
        attempt: attemptNumber,
        phase: 'post'
      })
    }
  } catch (error) {
    console.error('Error saving quiz result:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกผลสอบ' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const studentId = searchParams.get('studentId')
    const quizType = searchParams.get('quizType')
    const phase = searchParams.get('phase')
    const lesson = searchParams.get('lesson')
    const latest = searchParams.get('latest') // ดึงเฉพาะครั้งล่าสุด

    let whereClause: any = {}
    
    if (userId) whereClause.userId = parseInt(userId)
    if (studentId) whereClause.studentId = studentId
    if (quizType) whereClause.quizType = quizType
    if (phase) whereClause.phase = phase
    if (lesson) whereClause.lesson = parseInt(lesson)

    // ถ้าต้องการเฉพาะครั้งล่าสุดของแต่ละบทเรียน
    if (latest === 'true') {
      const results = await prisma.quizResult.findMany({
        where: whereClause,
        orderBy: [
          { lesson: 'asc' },
          { completedAt: 'desc' }
        ],
        select: {
          id: true,
          lesson: true,
          score: true,
          totalScore: true,
          percentage: true,
          passed: true,
          completedAt: true,
          phase: true,
          quizType: true,
          userId: true,
          studentId: true
        }
      })

      // Group by lesson และเอาเฉพาะครั้งล่าสุด
      const latestResults = results.reduce((acc: any[], current) => {
        const existing = acc.find(item => item.lesson === current.lesson)
        if (!existing) {
          acc.push(current)
        }
        return acc
      }, [])

      return NextResponse.json(latestResults)
    }

    // ดึงผลทั้งหมด
    const results = await prisma.quizResult.findMany({
      where: whereClause,
      orderBy: [
        { lesson: 'asc' },
        { completedAt: 'desc' }
      ],
      select: {
        id: true,
        lesson: true,
        score: true,
        totalScore: true,
        percentage: true,
        passed: true,
        completedAt: true,
        phase: true,
        quizType: true,
        userId: true,
        studentId: true,
        answers: true
      }
    })

    // เพิ่ม attempt number สำหรับ posttest
    const resultsWithAttempt = []
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      let attempt = 1
      
      if (result.phase === 'post') {
        // หา attempt number โดยนับจากผลที่มี completedAt >= ผลปัจจุบัน
        const sameOrNewerResults = results.filter(r => 
          r.lesson === result.lesson && 
          r.phase === 'post' && 
          r.userId === result.userId &&
          r.quizType === result.quizType &&
          r.completedAt >= result.completedAt
        )
        attempt = sameOrNewerResults.length
      }
      
      resultsWithAttempt.push({
        ...result,
        attempt
      })
    }

    return NextResponse.json(resultsWithAttempt)
  } catch (error) {
    console.error('Error fetching quiz results:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงผลสอบ' },
      { status: 500 }
    )
  }
}

// DELETE method สำหรับลบผลสอบ posttest
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'กรุณาระบุ id และ userId' },
        { status: 400 }
      )
    }

    // ตรวจสอบว่าผลสอบนี้เป็นของ user นี้
    const quizResult = await prisma.quizResult.findFirst({
      where: {
        id: parseInt(id),
        userId: parseInt(userId)
      }
    })

    if (!quizResult) {
      return NextResponse.json(
        { error: 'ไม่พบผลสอบหรือไม่มีสิทธิ์ลบ' },
        { status: 404 }
      )
    }

    // ลบได้เฉพาะ posttest (ป้องกันการลบ pretest)
    if (quizResult.phase === 'pre') {
      return NextResponse.json(
        { error: 'ไม่สามารถลบผลสอบก่อนเรียนได้' },
        { status: 403 }
      )
    }

    await prisma.quizResult.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({
      message: 'ลบผลสอบสำเร็จ'
    })
  } catch (error) {
    console.error('Error deleting quiz result:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบผลสอบ' },
      { status: 500 }
    )
  }
}