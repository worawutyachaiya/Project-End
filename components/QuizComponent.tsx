// components/QuizComponent.tsx
"use client";
import { useState, useEffect } from "react";

type QuizItem = {
  id: number;
  question: string;
  choices: string[];
  correct: string;
  score: string;
};

type QuizComponentProps = {
  type: 'HTML' | 'CSS';
  phase: 'pre' | 'post';
  title: string;
};

export default function QuizComponent({ type, phase, title }: QuizComponentProps) {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    totalScore: number;
    percentage: number;
  } | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/quizzes/by-type?type=${type}&phase=${phase}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }

      const data = await response.json();
      setQuizzes(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (questionIndex: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    let totalScore = 0;

    quizzes.forEach((quiz, index) => {
      const userAnswer = answers[index];
      const correctAnswer = quiz.choices[parseInt(quiz.correct) - 1];
      
      if (userAnswer === correctAnswer) {
        correctCount++;
        totalScore += parseInt(quiz.score);
      }
    });

    const maxScore = quizzes.reduce((sum, quiz) => sum + parseInt(quiz.score), 0);
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    return {
      score: totalScore,
      totalScore: maxScore,
      percentage: Math.round(percentage * 100) / 100
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ตรวจสอบว่าตอบครบทุกข้อ
    if (Object.keys(answers).length !== quizzes.length) {
      alert('กรุณาตอบให้ครบทุกข้อ');
      return;
    }

    setSubmitting(true);
    
    try {
      // คำนวณคะแนน
      const scoreResult = calculateScore();
      setResult(scoreResult);
      
      // TODO: สามารถส่งผลไปยัง backend เพื่อบันทึกผลสอบ
      console.log('คำตอบที่ส่ง:', answers);
      console.log('ผลคะแนน:', scoreResult);
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('เกิดข้อผิดพลาดในการส่งคำตอบ');
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setResult(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl text-gray-600">กำลังโหลดข้อสอบ...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl text-red-600 mb-4">เกิดข้อผิดพลาด: {error}</div>
        <button
          onClick={fetchQuizzes}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl text-gray-600">ไม่มีข้อสอบในระบบ</div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">ผลคะแนน</h2>
          
          <div className="mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {result.score}/{result.totalScore}
            </div>
            <div className="text-lg text-gray-600">
              คะแนนร้อยละ {result.percentage}%
            </div>
          </div>

          <div className="mb-6">
            <div className={`text-lg font-semibold ${
              result.percentage >= 70 ? 'text-green-600' : 'text-red-600'
            }`}>
              {result.percentage >= 70 ? 'ผ่าน' : 'ไม่ผ่าน'}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              (เกณฑ์ผ่าน 70%)
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetQuiz}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              ทำแบบทดสอบใหม่
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <main className="flex-1 w-full max-w-3xl bg-white p-8 mt-8 border rounded-xl text-black">
        <h2 className="text-center text-xl font-semibold mb-6">{title}</h2>
        
        <div className="mb-6 text-center text-gray-600">
          จำนวนข้อสอบ: {quizzes.length} ข้อ
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {quizzes.map((quiz, index) => (
            <div key={quiz.id} className="border-b pb-6">
              <p className="mb-4 font-medium">
                {index + 1}) {quiz.question}
              </p>
              <div className="space-y-2 pl-4">
                {quiz.choices.map((choice, i) => (
                  <label key={i} className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={choice}
                      checked={answers[index] === choice}
                      onChange={() => handleChange(index, choice)}
                      className="mr-3"
                      disabled={submitting}
                    />
                    <span className="text-sm">{choice}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={submitting || Object.keys(answers).length !== quizzes.length}
              className="bg-black text-white px-8 py-3 rounded-full hover:opacity-80 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'กำลังส่งคำตอบ...' : 'ส่งคำตอบ'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}