"use client";

import { useState, useEffect } from "react";

type QuizItem = {
  id: number;
  questionType: "HTML" | "CSS";
  question: string;
  choices: string[];
  correct: string;
  score: string;
  phase: "pre" | "post";
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminQuizPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<QuizItem | null>(null);

  const [form, setForm] = useState<QuizItem>({
    id: 0,
    questionType: "HTML",
    question: "",
    choices: ["", "", "", ""],
    correct: "1",
    score: "",
    phase: "pre",
  });

  // Fetch quizzes on component mount
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/quizzes");
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
      score: "",
      phase: "pre",
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
      !form.phase
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const url = editingQuiz ? `/api/quizzes/${form.id}` : "/api/quizzes";

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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }

      if (editingQuiz) {
        // Update existing quiz in state
        setQuizzes((prev) => prev.map((q) => (q.id === form.id ? data : q)));
        alert("แก้ไขข้อสอบสำเร็จ");
      } else {
        // Add new quiz to state
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

      const response = await fetch(`/api/quizzes/${id}`, {
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

  const handleLogout = () => {
    if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
      // Handle logout logic here
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-black">
      {/* Header */}
      <header className="bg-white/50 backdrop-blur-sm px-6 py-4 flex">
        <div className="w-full flex items-center justify-between gap-4">
          <span className="border px-4 py-1 rounded-full text-black">
            Admin
          </span>
          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
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

          {/* ตารางแสดงรายการข้อสอบ */}
          <h2 className="text-lg font-bold mt-10">รายการข้อสอบทั้งหมด</h2>

          {loading ? (
            <div className="text-center py-8">กำลังโหลด...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full mt-4 border text-sm text-black">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-2 py-1 text-center">ลำดับ</th>
                    <th className="border px-2 py-1 text-center">ประเภท</th>
                    <th className="border px-2 py-1 text-center">ช่วง</th>
                    <th className="border px-2 py-1 text-center">คำถาม</th>
                    <th className="border px-2 py-1 text-center">
                      คำตอบที่ถูก
                    </th>
                    <th className="border px-2 py-1 text-center">คะแนน</th>
                    <th className="border px-2 py-1 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="border px-2 py-4 text-center text-gray-500"
                      >
                        ไม่มีข้อมูลข้อสอบ
                      </td>
                    </tr>
                  ) : (
                    quizzes.map((q, idx) => (
                      <tr key={q.id} className="bg-white">
                        <td className="border px-2 py-1 text-center">
                          {idx + 1}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {q.questionType}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {q.phase === "pre" ? "ก่อนเรียน" : "หลังเรียน"}
                        </td>
                        <td className="border px-2 py-1 text-center max-w-xs truncate">
                          {q.question}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {q.choices[parseInt(q.correct) - 1]}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {q.score}
                        </td>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
