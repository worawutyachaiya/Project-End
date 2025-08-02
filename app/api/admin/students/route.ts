// app/api/admin/students/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Types
interface WhereClause {
  role: string;
  academicYear?: number;
  OR?: Array<{
    firstName?: { contains: string; mode: 'insensitive' };
    lastName?: { contains: string; mode: 'insensitive' };
    studentId?: { contains: string };
  }>;
}

interface QuizResult {
  id: number;
  quizType: string;
  phase: string;
  lesson: number;
  score: number;
  totalScore: number;
  percentage: number;
  passed: boolean;
  completedAt: Date;
  answers?: unknown;
}

interface CourseStats {
  totalLessons: number;
  completedPosttests: number;
  avgPretest: number;
  avgPosttest: number;
  improvement: number;
  posttestAttempts: number;
}

interface GroupedResult {
  quizType: string;
  lesson: number;
  pretest: QuizResult | null;
  posttests: QuizResult[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const academicYear = searchParams.get('academicYear')
    const search = searchParams.get('search')
    const courseType = searchParams.get('courseType') // HTML or CSS
    
    // Build where clause
    const whereClause: WhereClause = {
      role: 'student'
    }
    
    if (academicYear && academicYear !== 'all') {
      whereClause.academicYear = parseInt(academicYear)
    }
    
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { studentId: { contains: search } }
      ]
    }

    // Get students with their quiz results
    const students = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentId: true,
        academicYear: true,
        createdAt: true,
        quizResults: {
          where: courseType ? { quizType: courseType } : {},
          select: {
            id: true,
            quizType: true,
            phase: true,
            lesson: true,
            score: true,
            totalScore: true,
            percentage: true,
            passed: true,
            completedAt: true
          },
          orderBy: [
            { lesson: 'asc' },
            { completedAt: 'desc' }
          ]
        }
      },
      orderBy: [
        { academicYear: 'desc' },
        { firstName: 'asc' },
        { lastName: 'asc' }
      ]
    })

    // Process data to include statistics
    const studentsWithStats = students.map(student => {
      const htmlResults = student.quizResults.filter(r => r.quizType === 'HTML')
      const cssResults = student.quizResults.filter(r => r.quizType === 'CSS')
      
      const getStatsForType = (results: QuizResult[]): CourseStats => {
        const pretests = results.filter(r => r.phase === 'pre')
        const posttests = results.filter(r => r.phase === 'post')
        
        // Get latest posttest for each lesson
        const latestPosttests = pretests.map(pretest => {
          const lessonPosttests = posttests.filter(p => p.lesson === pretest.lesson)
          return lessonPosttests.length > 0 ? lessonPosttests[0] : null
        }).filter((test): test is QuizResult => test !== null)

        const avgPretest = pretests.length > 0 
          ? pretests.reduce((sum, r) => sum + r.percentage, 0) / pretests.length 
          : 0
        
        const avgPosttest = latestPosttests.length > 0 
          ? latestPosttests.reduce((sum, r) => sum + r.percentage, 0) / latestPosttests.length 
          : 0

        const improvement = avgPosttest - avgPretest

        return {
          totalLessons: pretests.length,
          completedPosttests: latestPosttests.length,
          avgPretest: Math.round(avgPretest * 100) / 100,
          avgPosttest: Math.round(avgPosttest * 100) / 100,
          improvement: Math.round(improvement * 100) / 100,
          posttestAttempts: posttests.length
        }
      }

      return {
        ...student,
        stats: {
          html: getStatsForType(htmlResults),
          css: getStatsForType(cssResults)
        }
      }
    })

    // Get available academic years for filter
    const academicYears = await prisma.user.groupBy({
      by: ['academicYear'],
      where: { role: 'student' },
      orderBy: { academicYear: 'desc' }
    })

    return NextResponse.json({
      students: studentsWithStats,
      academicYears: academicYears.map(ay => ay.academicYear)
    })
  } catch (error) {
    console.error('Error fetching students data:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลนักเรียน' },
      { status: 500 }
    )
  }
}

// Get detailed data for specific student
export async function POST(request: NextRequest) {
  try {
    const { studentId, courseType } = await request.json()
    
    if (!studentId) {
      return NextResponse.json(
        { error: 'กรุณาระบุรหัสนักเรียน' },
        { status: 400 }
      )
    }

    const student = await prisma.user.findUnique({
      where: { studentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentId: true,
        academicYear: true,
        quizResults: {
          where: courseType ? { quizType: courseType } : {},
          select: {
            id: true,
            quizType: true,
            phase: true,
            lesson: true,
            score: true,
            totalScore: true,
            percentage: true,
            passed: true,
            completedAt: true,
            answers: true
          },
          orderBy: [
            { quizType: 'asc' },
            { lesson: 'asc' },
            { phase: 'asc' },
            { completedAt: 'desc' }
          ]
        }
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลนักเรียน' },
        { status: 404 }
      )
    }

    // Group results by course type and lesson
    const groupedResults = student.quizResults.reduce((acc: Record<string, GroupedResult>, result) => {
      const key = `${result.quizType}-${result.lesson}`
      if (!acc[key]) {
        acc[key] = {
          quizType: result.quizType,
          lesson: result.lesson,
          pretest: null,
          posttests: []
        }
      }
      
      if (result.phase === 'pre') {
        acc[key].pretest = result
      } else {
        acc[key].posttests.push(result)
      }
      
      return acc
    }, {})

    return NextResponse.json({
      ...student,
      detailedResults: Object.values(groupedResults)
    })
  } catch (error) {
    console.error('Error fetching student details:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายละเอียด' },
      { status: 500 }
    )
  }
}