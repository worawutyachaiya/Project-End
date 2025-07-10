"use client";

import { useState } from "react";

type QuizItem = {
  id: number;
  questionType: "HTML" | "CSS";
  question: string;
  choices: string[];
  correct: string;
  score: string;
};

export default function AdminQuizPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [form, setForm] = useState<QuizItem>({
    id: 0,
    questionType: "HTML",
    question: "",
    choices: ["", "", "", ""],
    correct: "1",
    score: "",
  });
  const [editMode, setEditMode] = useState(false);

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

  const handleSubmit = () => {
    if (
      !form.questionType ||
      !form.question ||
      form.choices.some((c) => !c) ||
      !form.correct ||
      !form.score
    ) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (editMode) {
      setQuizzes((prev) =>
        prev.map((q) => (q.id === form.id ? form : q))
      );
      setEditMode(false);
    } else {
      const newQuiz: QuizItem = {
        ...form,
        id: Date.now(),
      };
      setQuizzes([...quizzes, newQuiz]);
    }

    // reset
    setForm({
      id: 0,
      questionType: "HTML",
      question: "",
      choices: ["", "", "", ""],
      correct: "1",
      score: "",
    });
  };

  const handleEdit = (quiz: QuizItem) => {
    setForm(quiz);
    setEditMode(true);
  };

  const handleDelete = (id: number) => {
    const confirmed = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อสอบนี้?");
    if (confirmed) {
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-black">
      {/* Header */}
      <header className="bg-white/50 backdrop-blur-sm px-6 py-4 flex">
        <div className="w-full flex items-center justify-between gap-4">
          <span className="border px-4 py-1 rounded-full text-black">Admin</span>
          <button className="bg-black text-white px-4 py-2 rounded">ออกจากระบบ</button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white/50 backdrop-blur-sm p-4 shadow">
          <ul className="space-y-2">
            <li className="pl-4 font-bold text-blue-600">จัดการข้อสอบ</li>
            <li className="pl-4">
              <a href="/admin/video">จัดการวิดีโอ</a>
            </li>
          </ul>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 bg-white/70 backdrop-blur-sm text-black shadow">
          <h1 className="text-xl font-bold mb-6">
            {editMode ? "แก้ไขข้อสอบ" : "เพิ่มข้อสอบใหม่"}
          </h1>

          <div className="space-y-4 max-w-lg">
            {/* ประเภทคำถาม */}
            <div>
              <label className="block mb-1 font-semibold">ประเภทคำถาม</label>
              <select
                name="questionType"
                value={form.questionType}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="HTML">HTML</option>
                <option value="CSS">CSS</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold">คำถาม</label>
              <input
                name="question"
                value={form.question}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">ตัวเลือกคำตอบ</label>
              {form.choices.map((choice, idx) => (
                <input
                  key={idx}
                  name="choice"
                  value={choice}
                  placeholder={`ตัวเลือก ${idx + 1}`}
                  onChange={(e) => handleChange(e, idx)}
                  className="w-full border px-4 py-2 rounded mb-2"
                />
              ))}
            </div>

            <div>
              <label className="block mb-1 font-semibold">คำตอบที่ถูก</label>
              <select
                name="correct"
                value={form.correct}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold">คะแนนข้อสอบ</label>
              <input
                name="score"
                value={form.score}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="bg-black text-white px-6 py-2 rounded"
            >
              {editMode ? "อัปเดต" : "ยืนยัน"}
            </button>
          </div>

          {/* ตารางแสดงรายการข้อสอบ */}
          <h2 className="text-lg font-bold mt-10 mb-4">รายการข้อสอบที่เพิ่ม</h2>
          <table className="w-full border text-sm text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-1">ประเภท</th>
                <th className="border px-2 py-1">คำถาม</th>
                <th className="border px-2 py-1">คำตอบที่ถูก</th>
                <th className="border px-2 py-1">คะแนน</th>
                <th className="border px-2 py-1">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((q) => (
                <tr key={q.id} className="bg-white">
                  <td className="border px-2 py-1">{q.questionType}</td>
                  <td className="border px-2 py-1">{q.question}</td>
                  <td className="border px-2 py-1">
                    {q.choices[parseInt(q.correct) - 1]}
                  </td>
                  <td className="border px-2 py-1">{q.score}</td>
                  <td className="border px-2 py-1 space-x-2">
                    <button
                      onClick={() => handleEdit(q)}
                      className="bg-yellow-400 px-2 py-1 rounded text-white"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="bg-red-500 px-2 py-1 rounded text-white"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
