// app/htmlvideo/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import RouteGuard from '@/components/routeGuard'
import PretestChecker from '@/components/PretestChecker'

interface Video {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  image: string;
  lesson: number;
}

export default function HTMLVideoPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [videoSrc, setVideoSrc] = useState("");
  const [videoTitle, setVideoTitle] = useState("แนะนำเนื้อหา");
  const [videoDescription, setVideoDescription] = useState("คำอธิบายบทเรียนโดยสรุปของเนื้อหานี้");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [skippedLessons, setSkippedLessons] = useState<number[]>([]);

  useEffect(() => {
    if (user) {
      fetchSkippedLessons();
      fetchVideos();
    }
  }, [user]);

  const fetchSkippedLessons = async () => {
    try {
      const response = await fetch(`/api/user-progress?userId=${user?.id}&courseType=HTML`);
      if (response.ok) {
        const data = await response.json();
        const skipped = data.filter((progress: any) => progress.skipped).map((progress: any) => progress.lesson);
        setSkippedLessons(skipped);
      }
    } catch (error) {
      console.error('Error fetching skipped lessons:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        // กรองเฉพาะวิดีโอที่เกี่ยวกับ HTML
        const htmlVideos = data.filter((video: Video) => 
          video.title.toLowerCase().includes('html') || 
          video.description.toLowerCase().includes('html')
        );
        // เรียงลำดับตามบทเรียน
        htmlVideos.sort((a: Video, b: Video) => (a.lesson || 0) - (b.lesson || 0));
        setVideos(htmlVideos);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // กรองวิดีโอที่ไม่ใช่บทเรียนที่ข้าม
    const filtered = videos.filter(video => !skippedLessons.includes(video.lesson));
    setFilteredVideos(filtered);
    
    if (filtered.length > 0) {
      setVideoSrc(getYouTubeEmbedUrl(filtered[0].youtubeUrl));
      setVideoTitle(filtered[0].title);
      setVideoDescription(filtered[0].description);
      setCurrentVideoIndex(0);
    }
  }, [videos, skippedLessons]);

  const getYouTubeEmbedUrl = (url: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    return url;
  };

  const handleVideoSelect = (video: Video, index: number) => {
    setVideoSrc(getYouTubeEmbedUrl(video.youtubeUrl));
    setVideoTitle(video.title);
    setVideoDescription(video.description);
    setCurrentVideoIndex(index);
  };

  const getDuration = (index: number) => {
    // Mock duration - ในการใช้งานจริงอาจต้องดึงจาก API
    const durations = ['15:30', '12:45', '18:20', '9:15', '14:35'];
    return durations[index % durations.length];
  };

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const markLessonComplete = async (lesson: number) => {
    try {
      await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          courseType: 'HTML',
          lesson: lesson,
          completed: true
        })
      });
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">กำลังโหลดเนื้อหา...</div>
      </div>
    );
  }

  return (
    <RouteGuard requireAuth={true}>
      <PretestChecker courseType="HTML">
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col md:flex-row gap-4" style={{ backgroundImage: "url('/img/bg-green.jpg')" }}>
          <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
            <div className="aspect-video w-full bg-black">
              <iframe
                src={videoSrc}
                title={videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            <div className="p-4 text-gray-700 text-center border-t bg-blue-50">
              <h2 className="text-lg font-semibold">{videoTitle}</h2>
              <p className="text-sm mt-1">{videoDescription}</p>
            </div>
          </div>

          <div className="w-full md:w-80 bg-white rounded-xl shadow-lg flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl">
              <div>
                <h3 className="text-lg font-bold">เนื้อหา HTML</h3>
                <p className="text-blue-100 text-sm">
                  {currentVideoIndex + 1} จาก {filteredVideos.length} บทเรียน
                </p>
                {skippedLessons.length > 0 && (
                  <p className="text-blue-100 text-xs mt-1">
                    ข้าม {skippedLessons.length} บทเรียน (ผ่าน pretest)
                  </p>
                )}
              </div>
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-xl font-bold text-white hover:text-red-300 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredVideos.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>ไม่มีเนื้อหาวิดีโอ HTML ที่ต้องเรียน</p>
                  <p className="text-sm mt-2">
                    {skippedLessons.length > 0 ? 
                      `คุณได้ข้าม ${skippedLessons.length} บทเรียนจาก pretest` : 
                      'กำลังโหลดเนื้อหา...'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredVideos.map((video, index) => (
                    <button
                      key={video.id}
                      className={`w-full text-left p-4 transition-all duration-200 hover:bg-gray-50 ${
                        index === currentVideoIndex 
                          ? 'bg-blue-50 border-r-4 border-blue-500' 
                          : 'border-r-4 border-transparent'
                      }`}
                      onClick={() => handleVideoSelect(video, index)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                          {index === currentVideoIndex ? (
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                          ) : (
                            <span className="text-gray-600">
                              {video.lesson || index + 1}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm mb-1 ${
                            index === currentVideoIndex ? 'text-blue-700' : 'text-gray-800'
                          }`}>
                            {video.title}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-2 mb-2">
                            {video.description}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">
                                ⏱️ {getDuration(index)}
                              </span>
                              {index === currentVideoIndex && (
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                  กำลังเรียน
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400">
                              {index < currentVideoIndex ? '✓' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>ความคืบหน้า</span>
                  <span>
                    {filteredVideos.length > 0 ? 
                      Math.round(((currentVideoIndex + 1) / filteredVideos.length) * 100) : 0
                    }%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${filteredVideos.length > 0 ? 
                        ((currentVideoIndex + 1) / filteredVideos.length) * 100 : 0
                      }%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <button 
                onClick={() => router.push('/posttest-html')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                ทำข้อสอบหลังเรียน
              </button>
            </div>
          </div>
        </div>
      </PretestChecker>
    </RouteGuard>
  );
}