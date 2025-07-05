// app/quiz/page.tsx
"use client";
import { useState } from "react";

export default function QuizPage() {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const handleChange = (questionIndex: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("คำตอบที่ส่ง:", answers);
    // TODO: ส่งไปยัง backend หรือแสดงผล
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">

      {/* แบบสอบถาม */}
      <main className="flex-1 w-full max-w-2xl bg-white p-8 mt-8 border rounded-xl text-amber-500">
        <h2 className="text-center text-xl font-semibold mb-6 ">ข้อสอบก่อนเรียน</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {[1, 2, 3].map((q) => (
            <div key={q}>
              <p className="mb-2">{q}) ...............</p>
              <div className="space-y-2 pl-4">
                {["ตัวเลือก1", "ตัวเลือก2", "ตัวเลือก3", "ตัวเลือก4"].map((choice, i) => (
                  <label key={i} className="block">
                    <input
                      type="radio"
                      name={`question-${q}`}
                      value={choice}
                      checked={answers[q] === choice}
                      onChange={() => handleChange(q, choice)}
                      className="mr-2"
                    />
                    {choice}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded-full hover:opacity-80 cursor-pointer">
              ส่งคำตอบ
            </button>
          </div>
        </form>
      </main>

    </div>
  );
}
