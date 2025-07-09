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
      question: "1) CSS ย่อมาจากอะไร?",
      choices: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
    },
    {
      question: "2) Selectors ใน CSS ใช้สำหรับอะไร?",
      choices: ["กำหนดโครงสร้าง HTML", "เลือกองค์ประกอบ HTML เพื่อกำหนดสไตล์", "สร้างฟังก์ชัน JavaScript", "จัดการฐานข้อมูล"],
    },
    {
      question: "3) วิธีการประกาศใช้ CSS แบบ External ถูกต้องตามข้อใด?",
      choices: ["<style>...</style>", "<link rel='stylesheet' href='style.css'>", "<css>...</css>", "<script src='style.css'></script>"],
    },
    {
      question: "4) วิธีการเขียน Comment ใน CSS ที่ถูกต้องคือข้อใด?",
      choices: ["<!-- นี่คือ Comment -->", "// นี่คือ Comment", "/* นี่คือ Comment */", "# นี่คือ Comment"],
    },
    {
      question: "5) หน่วยใดใน CSS ที่ใช้สำหรับกำหนดขนาดแบบสัมพัทธ์?",
      choices: ["px", "em", "cm", "in"],
    },
    {
      question: "6) Selector ใดที่ใช้สำหรับเลือกทุกองค์ประกอบใน HTML?",
      choices: ["*", ".class", "#id", "element"],
    },
    {
      question: "7) Property ใดใช้สำหรับกำหนดชนิดฟอนต์ใน CSS?",
      choices: ["font-family", "font-size", "font-weight", "font-style"],
    },
    {
      question: "8) วิธีการใช้งาน Google Fonts ใน CSS ถูกต้องตามข้อใด?",
      choices: ['<link href="https://fonts.googleapis.com/css?family=FontName" rel="stylesheet">', '<style>@import url("https://fonts.googleapis.com/css?family=FontName");</style>', '<script src="https://fonts.googleapis.com/css?family=FontName"></script>', "<css>@font-face { src: url('https://fonts.googleapis.com/css?family=FontName'); }</css>"],
    },
    {
      question: "9) Property ใดใช้สำหรับกำหนดขนาดฟอนต์ใน CSS?",
      choices: ["font-family", "font-size", "font-weight", "font-style"],
    },
    {
      question: "10) Property ใดใช้สำหรับกำหนดสีพื้นหลังใน CSS?",
      choices: ["background-color", "color", "border-color", "text-color"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <main className="flex-1 w-full max-w-3xl bg-white p-8 mt-8 border rounded-xl text-black">
        <h2 className="text-center text-xl font-semibold mb-6">ข้อสอบก่อนเรียน-CSS</h2>
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
