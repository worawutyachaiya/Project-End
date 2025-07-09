"use client";
import { useState } from "react";

type Question = {
  question: string;
  choices: string[];
};

export default function QuizPage() {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const handleChange = (questionIndex: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("คำตอบที่ส่ง:", answers);
    // TODO: ส่งไป backend หรือประมวลผล
  };

  // 🔹 กำหนดคำถามและตัวเลือกที่นี่
  const questions: Question[] = [
    {
      question: "1) HTML คืออะไร?",
      choices: ["ภาษาที่ใช้สำหรับสร้างและออกแบบเว็บไซต์", "ภาษาที่ใช้สำหรับเขียนโปรแกรมบนเซิร์ฟเวอร์", "ภาษาที่ใช้สำหรับจัดการฐานข้อมูลวย", "ภาษาที่ใช้สำหรับสร้างแอปพลิเคชันมือถือ"],

    },
    {
      question: "2) โครงสร้างพื้นฐานของ HTML ประกอบด้วยแท็กใดบ้าง?",
      choices: ["<html>, <head>, <body>", "<header>, <main>, <footer>", "<div>, <span>, <p>", "<title>, <meta>, <link>"],
    },
    {
      question: "3) Meta Tags ใน HTML ใช้สำหรับอะไร?",
      choices: ["กำหนดรูปแบบสีของเว็บไซต์", "กำหนดข้อมูลเกี่ยวกับเว็บไซต์ให้กับเบราว์เซอร์และเสิร์ชเอนจิน", "กำหนดโครงสร้างของตาราง", "กำหนดการเล่นวิดีโอ"],
    },
    {
      question: "4) วิธีการเขียน Comment ใน HTML ที่ถูกต้องคือข้อใด??",
      choices: ["<!-- นี่คือ Comment -->", "// นี่คือ Comment", "/* นี่คือ Comment */", "# นี่คือ Comment"],
    },
    {
      question: "5) แท็กใดใช้สำหรับสร้าง Heading ที่ใหญ่ที่สุด?",
      choices: ["<h1>", "<h2>", "<h3>", "<h4>"],
    },
    {
      question: "6) แท็กใดใช้สำหรับสร้างเส้นขั้นใน HTML?",
      choices: ["<br>", "<hr>", "<line>", "<div>"],
    },
    {
      question: "7) แท็กใดใช้สำหรับกำหนดลิงก์ในหน้าเว็บ?",
      choices: ["<a>", "<link>", "<href>", "<url>"],
    },
    {
      question: "8) แท็กใดใช้สำหรับแทรกรูปภาพใน HTML?",
      choices: ["<img>", "<picture>", "<image>", "<photo>"],
    },
    {
      question: "9) แท็กใดใช้สำหรับสร้างรายการแบบมีลำดับ (Ordered List)?",
      choices: ["<ul>", "<ol>", "<li>", "<list>"],
    },
    {
      question: "10) แท็กใดใช้สำหรับสร้างตารางใน HTML?",
      choices: ["<table>", "<tr>", "<td>", "<th>"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <main className="flex-1 w-full max-w-3xl bg-white p-8 mt-8 border rounded-xl text-black">
        <h2 className="text-center text-xl font-semibold mb-6">ข้อสอบหลังเรียน-HTML</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((q, index) => (
            <div key={index}>
              <p className="mb-2">{q.question}</p>
              <div className="space-y-2 pl-4">
                {q.choices.map((choice, i) => (
                  <label key={i} className="block">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={choice}
                      checked={answers[index] === choice}
                      onChange={() => handleChange(index, choice)}
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
              className="bg-black text-white px-6 py-2 rounded-full hover:opacity-80 cursor-pointer"
            >
              ส่งคำตอบ
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
