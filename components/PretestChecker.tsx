// components/PretestChecker.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface PretestCheckerProps {
  courseType: 'HTML' | 'CSS';
  children: React.ReactNode;
}

interface PretestStatus {
  completed: boolean;
  loading: boolean;
  error: string | null;
}

export default function PretestChecker({ courseType, children }: PretestCheckerProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [pretestStatus, setPretestStatus] = useState<PretestStatus>({
    completed: false,
    loading: true,
    error: null
  });

  const checkPretestStatus = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setPretestStatus(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(`/api/pretest-status?courseType=${courseType}&userId=${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to check pretest status');
      }
      
      const data = await response.json();
      
      setPretestStatus({
        completed: data.completed,
        loading: false,
        error: null
      });
      
      // ถ้ายังไม่ทำ pretest ให้เด้งไปทำ
      if (!data.completed) {
        const pretestUrl = courseType === 'HTML' ? '/pretest-html' : '/pretest-css';
        router.push(pretestUrl);
      }
      
    } catch (error) {
      setPretestStatus({
        completed: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, [courseType, user?.id, router]);

  useEffect(() => {
    if (user) {
      checkPretestStatus();
    }
  }, [user, checkPretestStatus]);

  // Loading state
  if (pretestStatus.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังตรวจสอบข้อมูล...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (pretestStatus.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">เกิดข้อผิดพลาด: {pretestStatus.error}</p>
          <button
            onClick={checkPretestStatus}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  // ถ้าทำ pretest แล้วให้แสดงเนื้อหา
  if (pretestStatus.completed) {
    return <>{children}</>;
  }

  // ถ้ายังไม่ทำ pretest (จะ redirect ไปทำ pretest อยู่แล้ว)
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">กำลังนำคุณไปยังหน้าข้อสอบก่อนเรียน...</p>
      </div>
    </div>
  );
}