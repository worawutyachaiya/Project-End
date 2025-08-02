// components/PretestQuizComponent.tsx - Updated with dark text
"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

type QuizItem = {
  id: number;
  question: string;
  choices: string[];
  correct: string;
  score: string;
  lesson: number;
};

type PretestQuizProps = {
  type: 'HTML' | 'CSS';
  title: string;
};

export default function PretestQuizComponent({ type, title }: PretestQuizProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [currentLesson, setCurrentLesson] = useState(1);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const fetchCompletedLessons = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/pretest-status?courseType=${type}&userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setCompletedLessons(data.completedLessons || []);
        
        // หาบทเรียนแรกที่ยังไม่ทำ
        const nextLesson = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].find(
          lesson => !data.completedLessons.includes(lesson)
        );
        
        if (nextLesson) {
          setCurrentLesson(nextLesson);
        } else {
          // ทำครบทุกบทแล้ว ให้กลับไปหน้าเรียน
          router.push(type === 'HTML' ? '/htmlvideo' : '/cssvideo');
        }
      }
    } catch (error) {
      console.error('Error fetching completed lessons:', error);
    }
  }, [type, user?.id, router]);

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setAnswers({});

      const response = await fetch(`/api/quizzes/by-lesson?type=${type}&phase=pre&lesson=${currentLesson}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }

      const data = await response.json();
      setQuizzes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  }, [type, currentLesson]);

  useEffect(() => {
    if (user) {
      fetchCompletedLessons();
    }
  }, [user, fetchCompletedLessons]);

  useEffect(() => {
    if (currentLesson) {
      fetchQuizzes();
    }
  }, [currentLesson, fetchQuizzes]);

  const handleChange = (questionIndex: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  const calculateScore = () => {
    let totalScore = 0;

    quizzes.forEach((quiz, index) => {
      const userAnswer = answers[index];
      const correctAnswer = quiz.choices[parseInt(quiz.correct) - 1];
      
      if (userAnswer === correctAnswer) {
        totalScore += parseInt(quiz.score);
      }
    });

    const maxScore = quizzes.reduce((sum, quiz) => sum + parseInt(quiz.score), 0);
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    return {
      score: totalScore,
      totalScore: maxScore,
      percentage: Math.round(percentage * 100) / 100,
      passed: percentage >= 80 // กำหนดเกณฑ์ผ่าน 80%
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(answers).length !== quizzes.length) {
      alert('กรุณาตอบให้ครบทุกข้อ');
      return;
    }

    setSubmitting(true);
    
    try {
      const scoreResult = calculateScore();
      
      // บันทึกผลสอบ
      const response = await fetch('/api/quiz-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          studentId: user?.studentId,
          quizType: type,
          phase: 'pre',
          lesson: currentLesson,
          score: scoreResult.score,
          totalScore: scoreResult.totalScore,
          percentage: scoreResult.percentage,
          passed: scoreResult.passed,
          answers: JSON.stringify(answers)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save quiz result');
      }

      // ถ้าผ่าน ให้ข้ามบทเรียนนี้
      if (scoreResult.passed) {
        await fetch('/api/user-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            courseType: type,
            lesson: currentLesson,
            skipped: true
          })
        });
      }

      // ไปบทเรียนถัดไป
      const nextLesson = currentLesson + 1;
      if (nextLesson <= 10) {
        setCurrentLesson(nextLesson);
        setCompletedLessons(prev => [...prev, currentLesson]);
      } else {
        // ทำครบทุกบทแล้ว
        alert('ทำข้อสอบก่อนเรียนครบทุกบทแล้ว!');
        router.push(type === 'HTML' ? '/htmlvideo' : '/cssvideo');
      }
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('เกิดข้อผิดพลาดในการส่งคำตอบ');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-800">กำลังโหลดข้อสอบ...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">เกิดข้อผิดพลาด: {error}</div>
          <button
            onClick={fetchQuizzes}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gray-100">
      {/* Progress bar */}
      <div className="w-full max-w-3xl mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <span className="text-sm text-gray-700">
            บทเรียนที่ {currentLesson} / 10
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedLessons.length / 10) * 100}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-700 mt-2">
          ความคืบหน้า: {completedLessons.length}/10 บทเรียน
        </p>
      </div>

      {/* Quiz form */}
      <main className="flex-1 w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            ข้อสอบก่อนเรียน {type} - บทเรียนที่ {currentLesson}
          </h2>
          <p className="text-gray-700">
            จำนวนข้อสอบ: {quizzes.length} ข้อ | 
            เกณฑ์ผ่าน: 80% | 
            ถ้าผ่านจะข้ามบทเรียนนี้
          </p>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">ไม่มีข้อสอบสำหรับบทเรียนนี้</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {quizzes.map((quiz, index) => (
              <div key={quiz.id} className="border-b border-gray-200 pb-6">
                <p className="mb-4 font-medium text-gray-800">
                  {index + 1}) {quiz.question}
                </p>
                <div className="space-y-2 pl-4">
                  {quiz.choices.map((choice, i) => (
                    <label key={i} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={choice}
                        checked={answers[index] === choice}
                        onChange={() => handleChange(index, choice)}
                        className="mr-3"
                        disabled={submitting}
                      />
                      <span className="text-gray-700">{choice}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={submitting || Object.keys(answers).length !== quizzes.length}
                className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'กำลังส่งคำตอบ...' : 'ส่งคำตอบ'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}