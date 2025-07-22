// app/admin/students/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import RouteGuard from '@/components/routeGuard';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  studentId: string;
  academicYear: number;
  createdAt: string;
  stats: {
    html: CourseStats;
    css: CourseStats;
  };
}

interface CourseStats {
  totalLessons: number;
  completedPosttests: number;
  avgPretest: number;
  avgPosttest: number;
  improvement: number;
  posttestAttempts: number;
}

interface StudentDetail {
  id: number;
  firstName: string;
  lastName: string;
  studentId: string;
  academicYear: number;
  detailedResults: any[];
}

function AdminStudentsContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [academicYears, setAcademicYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  
  // Detail modal
  const [showDetail, setShowDetail] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [selectedYear, searchTerm, selectedCourse]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedYear !== 'all') params.append('academicYear', selectedYear);
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCourse !== 'all') params.append('courseType', selectedCourse);

      const response = await fetch(`/api/admin/students?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch students');

      const data = await response.json();
      setStudents(data.students);
      setAcademicYears(data.academicYears);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetail = async (studentId: string) => {
    try {
      setDetailLoading(true);
      
      const response = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          studentId,
          courseType: selectedCourse === 'all' ? null : selectedCourse
        })
      });

      if (!response.ok) throw new Error('Failed to fetch student details');

      const data = await response.json();
      setSelectedStudent(data);
      setShowDetail(true);
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการโหลดรายละเอียด');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
      await logout();
      router.push('/login');
    }
  };

  const getCompletionRate = (stats: CourseStats) => {
    if (stats.totalLessons === 0) return 0;
    return Math.round((stats.completedPosttests / stats.totalLessons) * 100);
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 10) return 'text-green-600';
    if (improvement > 0) return 'text-green-500';
    if (improvement === 0) return 'text-gray-600';
    return 'text-red-600';
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return '↗';
    if (improvement === 0) return '→';
    return '↘';
  };

  return (
    <div className="min-h-screen flex flex-col text-black">
      {/* Header */}
      <header className="bg-white/50 backdrop-blur-sm px-6 py-4 flex">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <span className="border px-4 py-1 rounded-full text-black">Admin</span>
            <span className="text-gray-700">
              สวัสดี, {user?.firstName} {user?.lastName}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            ออกจากระบบ
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white/50 backdrop-blur-sm p-4 shadow text-black">
          <ul className="space-y-2">
            <li className="pl-4">
              <a href="/admin/quiz" className="hover:text-blue-600">จัดการข้อสอบ</a>
            </li>
            <li className="pl-4">
              <a href="/admin/video" className="hover:text-blue-600">จัดการวิดีโอ</a>
            </li>
            <li className="pl-4 font-bold text-blue-600">ข้อมูลนักเรียน</li>
          </ul>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 bg-white/70 backdrop-blur-sm text-black shadow">
          <h1 className="text-2xl font-bold mb-6">ข้อมูลนักเรียนและผลการเรียน</h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-3">ตัวกรองข้อมูล</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Academic Year Filter */}
              <div>
                <label className="block mb-1 text-sm font-medium">ปีการศึกษา</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full border px-3 py-2 rounded text-black"
                >
                  <option value="all">ทุกปีการศึกษา</option>
                  {academicYears.map(year => (
                    <option key={year} value={year.toString()}>{year + 543}</option>
                  ))}
                </select>
              </div>

              {/* Course Type Filter */}
              <div>
                <label className="block mb-1 text-sm font-medium">ประเภทคอร์ส</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full border px-3 py-2 rounded text-black"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="HTML">HTML</option>
                  <option value="CSS">CSS</option>
                </select>
              </div>

              {/* Search */}
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium">ค้นหา (ชื่อ หรือรหัสนักเรียน)</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="กรอกชื่อหรือรหัสนักเรียน..."
                  className="w-full border px-3 py-2 rounded text-black"
                />
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              แสดงผล: {students.length} คน
            </div>
          </div>

          {/* Students Table */}
          {loading ? (
            <div className="text-center py-8">กำลังโหลด...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">รหัสนักเรียน</th>
                    <th className="border px-3 py-2 text-left">ชื่อ-สกุล</th>
                    <th className="border px-3 py-2 text-center">ปีการศึกษา</th>
                    <th className="border px-3 py-2 text-center">HTML เฉลี่ย</th>
                    <th className="border px-3 py-2 text-center">CSS เฉลี่ย</th>
                    <th className="border px-3 py-2 text-center">การพัฒนา HTML</th>
                    <th className="border px-3 py-2 text-center">การพัฒนา CSS</th>
                    <th className="border px-3 py-2 text-center">ความสมบูรณ์</th>
                    <th className="border px-3 py-2 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="border px-3 py-8 text-center text-gray-500">
                        ไม่มีข้อมูลนักเรียนที่ตรงตามเงื่อนไข
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="border px-3 py-2 font-mono">{student.studentId}</td>
                        <td className="border px-3 py-2">
                          {student.firstName} {student.lastName}
                        </td>
                        <td className="border px-3 py-2 text-center">{student.academicYear + 543}</td>
                        <td className="border px-3 py-2 text-center">
                          <div className="text-sm">
                            <div>ก่อน: {student.stats.html.avgPretest}%</div>
                            <div className="font-semibold">หลัง: {student.stats.html.avgPosttest}%</div>
                          </div>
                        </td>
                        <td className="border px-3 py-2 text-center">
                          <div className="text-sm">
                            <div>ก่อน: {student.stats.css.avgPretest}%</div>
                            <div className="font-semibold">หลัง: {student.stats.css.avgPosttest}%</div>
                          </div>
                        </td>
                        <td className="border px-3 py-2 text-center">
                          <span className={`font-semibold ${getImprovementColor(student.stats.html.improvement)}`}>
                            {getImprovementIcon(student.stats.html.improvement)}
                            {Math.abs(student.stats.html.improvement)}%
                          </span>
                        </td>
                        <td className="border px-3 py-2 text-center">
                          <span className={`font-semibold ${getImprovementColor(student.stats.css.improvement)}`}>
                            {getImprovementIcon(student.stats.css.improvement)}
                            {Math.abs(student.stats.css.improvement)}%
                          </span>
                        </td>
                        <td className="border px-3 py-2 text-center">
                          <div className="text-xs">
                            <div>HTML: {getCompletionRate(student.stats.html)}%</div>
                            <div>CSS: {getCompletionRate(student.stats.css)}%</div>
                          </div>
                        </td>
                        <td className="border px-3 py-2 text-center">
                          <button
                            onClick={() => fetchStudentDetail(student.studentId)}
                            disabled={detailLoading}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 disabled:bg-gray-400"
                          >
                            รายละเอียด
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Detail Modal */}
      {showDetail && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  รายละเอียดการเรียน - {selectedStudent.firstName} {selectedStudent.lastName}
                </h2>
                <button
                  onClick={() => setShowDetail(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  ปิด
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded">
                <p><strong>รหัสนักเรียน:</strong> {selectedStudent.studentId}</p>
                <p><strong>ปีการศึกษา:</strong> {selectedStudent.academicYear + 543}</p>
              </div>

              <div className="grid gap-6">
                {selectedStudent.detailedResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">
                      {result.quizType} - บทเรียนที่ {result.lesson}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Pretest */}
                      <div className="bg-blue-50 p-4 rounded">
                        <h4 className="font-semibold text-blue-800 mb-2">ก่อนเรียน</h4>
                        {result.pretest ? (
                          <div>
                            <p>คะแนน: {result.pretest.score}/{result.pretest.totalScore}</p>
                            <p>เปอร์เซ็นต์: {result.pretest.percentage}%</p>
                            <p className="text-sm text-gray-600">
                              วันที่: {new Date(result.pretest.completedAt).toLocaleDateString('th-TH')}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-500">ยังไม่ได้ทำข้อสอบ</p>
                        )}
                      </div>

                      {/* Posttests */}
                      <div className="bg-green-50 p-4 rounded">
                        <h4 className="font-semibold text-green-800 mb-2">
                          หลังเรียน ({result.posttests.length} ครั้ง)
                        </h4>
                        {result.posttests.length > 0 ? (
                          <div className="space-y-2">
                            {result.posttests.slice(0, 3).map((posttest: any, idx: number) => (
                              <div key={idx} className="text-sm">
                                <p>ครั้งที่ {result.posttests.length - idx}: {posttest.score}/{posttest.totalScore} ({posttest.percentage}%)</p>
                                <p className="text-xs text-gray-600">
                                  {new Date(posttest.completedAt).toLocaleDateString('th-TH')}
                                </p>
                              </div>
                            ))}
                            {result.posttests.length > 3 && (
                              <p className="text-xs text-gray-500">
                                และอีก {result.posttests.length - 3} ครั้ง...
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500">ยังไม่ได้ทำข้อสอบ</p>
                        )}
                      </div>
                    </div>

                    {/* Improvement indicator */}
                    {result.pretest && result.posttests.length > 0 && (
                      <div className="mt-4 p-3 bg-gray-100 rounded">
                        <div className="flex justify-between items-center">
                          <span>การพัฒนา:</span>
                          <span className={`font-bold ${getImprovementColor(result.posttests[0].percentage - result.pretest.percentage)}`}>
                            {getImprovementIcon(result.posttests[0].percentage - result.pretest.percentage)}
                            {Math.abs(result.posttests[0].percentage - result.pretest.percentage).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminStudentsPage() {
  return (
    <RouteGuard requireAuth={true} requireAdmin={true}>
      <AdminStudentsContent />
    </RouteGuard>
  );
}