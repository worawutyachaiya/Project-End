// app/admin/quiz/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import RouteGuard from '@/components/routeGuard';

type QuizItem = {
  id: number;
  questionType: "HTML" | "CSS";
  question: string;
  choices: string[];
  correct: string;
  score: string;
  phase: "pre" | "post";
  lesson: number;
  createdAt?: string;
  updatedAt?: string;
};

function AdminQuizContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<QuizItem | null>(null);
  
  // Filter states
  const [selectedLesson, setSelectedLesson] = useState<number | 'all'>('all');
  const [selectedPhase, setSelectedPhase] = useState<'all' | 'pre' | 'post'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'HTML' | 'CSS'>('all');

  const [form, setForm] = useState<QuizItem>({
    id: 0,
    questionType: "HTML",
    question: "",
    choices: ["", "", "", ""],
    correct: "1",
    score: "10",
    phase: "pre",
    lesson: 1,
  });

  // Fetch quizzes on component mount
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/quizzes");
      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }

      const data = await response.json();
      setQuizzes(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter quizzes based on selected filters
  const filteredQuizzes = quizzes.filter(quiz => {
    const lessonMatch = selectedLesson === 'all' || quiz.lesson === selectedLesson;
    const phaseMatch = selectedPhase === 'all' || quiz.phase === selectedPhase;
    const typeMatch = selectedType === 'all' || quiz.questionType === selectedType;
    
    return lessonMatch && phaseMatch && typeMatch;
  });

  // Group quizzes by lesson for better display
  const quizzesByLesson = filteredQuizzes.reduce((acc, quiz) => {
    if (!acc[quiz.lesson]) {
      acc[quiz.lesson] = [];
    }
    acc[quiz.lesson].push(quiz);
    return acc;
  }, {} as Record<number, QuizItem[]>);

  // Get unique lessons that have quizzes
  const availableLessons = [...new Set(quizzes.map(q => q.lesson))].sort((a, b) => a - b);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (name === "choice" && index !== undefined) {
      const updatedChoices = [...form.choices];
      updatedChoices[index] = value;
      setForm({ ...form, choices: updatedChoices });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({
      id: 0,
      questionType: "HTML",
      question: "",
      choices: ["", "", "", ""],
      correct: "1",
      score: "10",
      phase: "pre",
      lesson: 1,
    });
    setEditingQuiz(null);
  };

  const handleSubmit = async () => {
    if (
      !form.questionType ||
      !form.question ||
      form.choices.some((c) => !c.trim()) ||
      !form.correct ||
      !form.score ||
      !form.phase ||
      !form.lesson
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (form.lesson < 1 || form.lesson > 10) {
      alert("บทเรียนต้องอยู่ระหว่าง 1-10");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const url = editingQuiz ? `/api/admin/quizzes/${form.id}` : "/api/admin/quizzes";
      const method = editingQuiz ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionType: form.questionType,
          question: form.question,
          choices: form.choices,
          correct: form.correct,
          score: form.score,
          phase: form.phase,
          lesson: parseInt(form.lesson.toString()),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }

      if (editingQuiz) {
        setQuizzes((prev) => prev.map((q) => (q.id === form.id ? data : q)));
        alert("แก้ไขข้อสอบสำเร็จ");
      } else {
        setQuizzes((prev) => [data, ...prev]);
        alert("เพิ่มข้อสอบสำเร็จ");
      }

      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (quiz: QuizItem) => {
    setEditingQuiz(quiz);
    setForm(quiz);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("คุณต้องการลบข้อสอบนี้หรือไม่?")) return;

    try {
      setError(null);

      const response = await fetch(`/api/admin/quizzes/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการลบข้อมูล");
      }

      setQuizzes((prev) => prev.filter((q) => q.id !== id));
      alert("ลบข้อสอบสำเร็จ");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลบข้อมูล"
      );
    }
  };

  const handleDeleteLesson = async (lesson: number) => {
    const quizzesInLesson = quizzes.filter(q => q.lesson === lesson);
    
    if (quizzesInLesson.length === 0) {
      alert("ไม่มีข้อสอบในบทเรียนนี้");
      return;
    }

    const confirmMessage = `คุณต้องการลบข้อสอบทั้งหมดในบทเรียนที่ ${lesson} จำนวน ${quizzesInLesson.length} ข้อหรือไม่?\n\nการดำเนินการนี้ไม่สามารถยกเลิกได้`;
    
    if (!confirm(confirmMessage)) return;

    try {
      setError(null);
      setSubmitting(true);

      // Delete all quizzes in the lesson
      const deletePromises = quizzesInLesson.map(quiz => 
        fetch(`/api/admin/quizzes/${quiz.id}`, { method: "DELETE" })
      );

      const responses = await Promise.all(deletePromises);
      
      // Check if all deletions were successful
      const failedDeletions = responses.filter(response => !response.ok);
      
      if (failedDeletions.length > 0) {
        throw new Error(`ลบไม่สำเร็จ ${failedDeletions.length} ข้อจากทั้งหมด ${quizzesInLesson.length} ข้อ`);
      }

      // Update local state
      setQuizzes((prev) => prev.filter((q) => q.lesson !== lesson));
      alert(`ลบข้อสอบทั้งหมดในบทเรียนที่ ${lesson} สำเร็จ (${quizzesInLesson.length} ข้อ)`);
      
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลบข้อมูล"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
      await logout();
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-black">
      {/* Header */}
      <header className="bg-white/50 backdrop-blur-sm px-6 py-4 flex">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <span className="border px-4 py-1 rounded-full text-black">
              Admin
            </span>
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
            <li className="pl-4 font-bold text-blue-600">จัดการข้อสอบ</li>
            <li className="pl-4">
              <a href="/admin/video" className="hover:text-blue-600">
                จัดการวิดีโอ
              </a>
            </li>
            <li className="pl-4">
              <a href="/admin/students" className="hover:text-blue-600">
                ข้อมูลนักเรียน
              </a>
            </li>
          </ul>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 bg-white/70 backdrop-blur-sm text-black shadow">
          <h1 className="text-xl font-bold mb-6">
            {editingQuiz ? "แก้ไขข้อสอบ" : "เพิ่มข้อสอบใหม่"}
          </h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4 max-w-lg">
            {/* ประเภทคำถาม */}
            <div>
              <label className="block mb-1 font-semibold text-sm text-gray-700">
                ประเภทคำถาม
              </label>
              <select
                name="questionType"
                value={form.questionType}
                onChange={handleChange}
                disabled={submitting}
                className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100"
              >
                <option value="HTML">HTML</option>
                <option value="CSS">CSS</option>
              </select>
            </div>

            {/* ก่อนเรียน/หลังเรียน */}
            <div>
              <label className="block mb-1 font-semibold text-sm text-gray-700">
                แบบทดสอบสำหรับ
              </label>
              <select
                name="phase"
                value={form.phase}
                onChange={handleChange}
                disabled={submitting}
                className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100"
              >
                <option value="pre">ก่อนเรียน</option>
                <option value="post">หลังเรียน</option>
              </select>
            </div>

            {/* บทเรียน */}
            <div>
              <label className="block mb-1 font-semibold text-sm text-gray-700">
                บทเรียนที่
              </label>
              <select
                name="lesson"
                value={form.lesson}
                onChange={handleChange}
                disabled={submitting}
                className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>บทเรียนที่ {num}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-sm text-gray-700">
                คำถาม
              </label>
              <input
                name="question"
                value={form.question}
                onChange={handleChange}
                disabled={submitting}
                placeholder="กรอกคำถาม"
                className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-sm text-gray-700">
                ตัวเลือกคำตอบ
              </label>
              {form.choices.map((choice, idx) => (
                <input
                  key={idx}
                  name="choice"
                  value={choice}
                  placeholder={`ตัวเลือก ${idx + 1}`}
                  onChange={(e) => handleChange(e, idx)}
                  disabled={submitting}
                  className="w-full border px-4 py-2 rounded mb-2 text-black disabled:bg-gray-100"
                />
              ))}
            </div>

            <div>
              <label className="block mb-1 font-semibold text-sm text-gray-700">
                คำตอบที่ถูก
              </label>
              <select
                name="correct"
                value={form.correct}
                onChange={handleChange}
                disabled={submitting}
                className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100"
              >
                <option value="1">ตัวเลือก 1</option>
                <option value="2">ตัวเลือก 2</option>
                <option value="3">ตัวเลือก 3</option>
                <option value="4">ตัวเลือก 4</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-sm text-gray-700">
                คะแนนข้อสอบ
              </label>
              <input
                name="score"
                value={form.score}
                onChange={handleChange}
                disabled={submitting}
                placeholder="กรอกคะแนน"
                className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-black text-white px-6 py-2 rounded disabled:bg-gray-400 hover:bg-gray-800"
              >
                {submitting
                  ? "กำลังบันทึก..."
                  : editingQuiz
                  ? "อัปเดต"
                  : "เพิ่ม"}
              </button>
              {editingQuiz && (
                <button
                  onClick={resetForm}
                  disabled={submitting}
                  className="bg-gray-500 text-white px-6 py-2 rounded disabled:bg-gray-400 hover:bg-gray-600"
                >
                  ยกเลิก
                </button>
              )}
            </div>
          </div>

          {/* Filter Section */}
          <div className="mt-10 mb-6">
            <h2 className="text-lg font-bold mb-4">รายการข้อสอบทั้งหมด</h2>
            
            <div className="bg-gray-50 p-4 rounded mb-4">
              <h3 className="font-semibold mb-3">ตัวกรองข้อมูล</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filter by Lesson */}
                <div>
                  <label className="block mb-1 text-sm font-medium">บทเรียน</label>
                  <select
                    value={selectedLesson}
                    onChange={(e) => setSelectedLesson(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    className="w-full border px-3 py-2 rounded text-black"
                  >
                    <option value="all">ทุกบทเรียน</option>
                    {availableLessons.map(lesson => (
                      <option key={lesson} value={lesson}>บทเรียนที่ {lesson}</option>
                    ))}
                  </select>
                </div>

                {/* Filter by Phase */}
                <div>
                  <label className="block mb-1 text-sm font-medium">ช่วงเวลา</label>
                  <select
                    value={selectedPhase}
                    onChange={(e) => setSelectedPhase(e.target.value as 'all' | 'pre' | 'post')}
                    className="w-full border px-3 py-2 rounded text-black"
                  >
                    <option value="all">ทุกช่วง</option>
                    <option value="pre">ก่อนเรียน</option>
                    <option value="post">หลังเรียน</option>
                  </select>
                </div>

                {/* Filter by Type */}
                <div>
                  <label className="block mb-1 text-sm font-medium">ประเภท</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as 'all' | 'HTML' | 'CSS')}
                    className="w-full border px-3 py-2 rounded text-black"
                  >
                    <option value="all">ทุกประเภท</option>
                    <option value="HTML">HTML</option>
                    <option value="CSS">CSS</option>
                  </select>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                แสดงผล: {filteredQuizzes.length} ข้อจากทั้งหมด {quizzes.length} ข้อ
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">กำลังโหลด...</div>
          ) : (
            <div className="space-y-6">
              {selectedLesson === 'all' ? (
                // Show grouped by lessons
                Object.keys(quizzesByLesson).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    ไม่มีข้อมูลข้อสอบตามเงื่อนไขที่เลือก
                  </div>
                ) : (
                  Object.entries(quizzesByLesson)
                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                    .map(([lesson, quizzesInLesson]) => (
                      <div key={lesson} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold">
                            บทเรียนที่ {lesson} ({quizzesInLesson.length} ข้อ)
                          </h3>
                          <button
                            onClick={() => handleDeleteLesson(parseInt(lesson))}
                            disabled={submitting}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:bg-gray-400"
                          >
                            ลบทั้งบท
                          </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full border text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="border px-2 py-1 text-center">ลำดับ</th>
                                <th className="border px-2 py-1 text-center">ประเภท</th>
                                <th className="border px-2 py-1 text-center">ช่วง</th>
                                <th className="border px-2 py-1 text-center">คำถาม</th>
                                <th className="border px-2 py-1 text-center">คำตอบที่ถูก</th>
                                <th className="border px-2 py-1 text-center">คะแนน</th>
                                <th className="border px-2 py-1 text-center">จัดการ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {quizzesInLesson.map((q, idx) => (
                                <tr key={q.id} className="bg-white">
                                  <td className="border px-2 py-1 text-center">{idx + 1}</td>
                                  <td className="border px-2 py-1 text-center">{q.questionType}</td>
                                  <td className="border px-2 py-1 text-center">
                                    {q.phase === "pre" ? "ก่อนเรียน" : "หลังเรียน"}
                                  </td>
                                  <td className="border px-2 py-1 text-center max-w-xs truncate">
                                    {q.question}
                                  </td>
                                  <td className="border px-2 py-1 text-center">
                                    {q.choices[parseInt(q.correct) - 1]}
                                  </td>
                                  <td className="border px-2 py-1 text-center">{q.score}</td>
                                  <td className="border px-2 py-1 text-center space-x-2">
                                    <button
                                      onClick={() => handleEdit(q)}
                                      className="bg-yellow-400 px-2 py-1 rounded text-white hover:bg-yellow-500"
                                    >
                                      แก้ไข
                                    </button>
                                    <button
                                      onClick={() => handleDelete(q.id)}
                                      className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
                                    >
                                      ลบ
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))
                )
              ) : (
                // Show single lesson
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">
                      บทเรียนที่ {selectedLesson} ({filteredQuizzes.length} ข้อ)
                    </h3>
                    {filteredQuizzes.length > 0 && (
                      <button
                        onClick={() => handleDeleteLesson(selectedLesson as number)}
                        disabled={submitting}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:bg-gray-400"
                      >
                        ลบทั้งบท
                      </button>
                    )}
                  </div>
                  
                  {filteredQuizzes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      ไม่มีข้อมูลข้อสอบในบทเรียนนี้
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border px-2 py-1 text-center">ลำดับ</th>
                            <th className="border px-2 py-1 text-center">ประเภท</th>
                            <th className="border px-2 py-1 text-center">ช่วง</th>
                            <th className="border px-2 py-1 text-center">คำถาม</th>
                            <th className="border px-2 py-1 text-center">คำตอบที่ถูก</th>
                            <th className="border px-2 py-1 text-center">คะแนน</th>
                            <th className="border px-2 py-1 text-center">จัดการ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredQuizzes.map((q, idx) => (
                            <tr key={q.id} className="bg-white">
                              <td className="border px-2 py-1 text-center">{idx + 1}</td>
                              <td className="border px-2 py-1 text-center">{q.questionType}</td>
                              <td className="border px-2 py-1 text-center">
                                {q.phase === "pre" ? "ก่อนเรียน" : "หลังเรียน"}
                              </td>
                              <td className="border px-2 py-1 text-center max-w-xs truncate">
                                {q.question}
                              </td>
                              <td className="border px-2 py-1 text-center">
                                {q.choices[parseInt(q.correct) - 1]}
                              </td>
                              <td className="border px-2 py-1 text-center">{q.score}</td>
                              <td className="border px-2 py-1 text-center space-x-2">
                                <button
                                  onClick={() => handleEdit(q)}
                                  className="bg-yellow-400 px-2 py-1 rounded text-white hover:bg-yellow-500"
                                >
                                  แก้ไข
                                </button>
                                <button
                                  onClick={() => handleDelete(q.id)}
                                  className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
                                >
                                  ลบ
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminQuizPage() {
  return (
    <RouteGuard requireAuth={true} requireAdmin={true}>
      <AdminQuizContent />
    </RouteGuard>
  );
}