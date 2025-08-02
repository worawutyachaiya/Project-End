// app/cssvideo/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
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
  duration?: string;
}

interface UserProgress {
  lesson: number;
  skipped: boolean;
  completed: boolean;
}

export default function CSSVideoPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [videoSrc, setVideoSrc] = useState("");
  const [videoTitle, setVideoTitle] = useState("แนะนำเนื้อหา");
  const [videoDescription, setVideoDescription] = useState("คำอธิบายบทเรียนโดยสรุปของเนื้อหานี้");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [skippedLessons, setSkippedLessons] = useState<number[]>([]);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const fetchSkippedLessons = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/user-progress?userId=${user.id}&courseType=CSS`);
      if (response.ok) {
        const data: UserProgress[] = await response.json();
        const skipped = data.filter((progress) => progress.skipped).map((progress) => progress.lesson);
        const completed = data.filter((progress) => progress.completed).map((progress) => progress.lesson);
        setSkippedLessons(skipped);
        setCompletedLessons(completed);
      }
    } catch (error) {
      console.error('Error fetching skipped lessons:', error);
    }
  }, [user?.id]);

  // ฟังก์ชันดึงระยะเวลาจริงจาก YouTube
  const getYouTubeDuration = async (videoId: string): Promise<string> => {
    try {
      // ในการใช้งานจริง ควรใช้ YouTube Data API
      // const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      // const response = await fetch(
      //   `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${API_KEY}`
      // );
      // const data = await response.json();
      // return formatDuration(data.items[0]?.contentDetails?.duration);
      
      // สำหรับตอนนี้ใช้ fallback duration
      return await getFallbackDuration();
    } catch (error) {
      console.error('Error fetching YouTube duration:', error);
      return '00:00';
    }
  };

  // ฟังก์ชัน fallback สำหรับระยะเวลา
  const getFallbackDuration = async (): Promise<string> => {
    const durations: { [key: string]: string } = {
      'default1': '18:45',
      'default2': '22:30',
      'default3': '15:20',
      'default4': '25:15',
      'default5': '19:35',
      'default6': '12:50',
      'default7': '16:40'
    };
    
    // สุ่มเลือกระยะเวลา (ในการใช้งานจริงควรเก็บในฐานข้อมูล)
    const keys = Object.keys(durations);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return durations[randomKey];
  };

  const extractVideoId = useCallback((url: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return '';
  }, []);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data: Video[] = await response.json();
        // กรองเฉพาะวิดีโอที่เกี่ยวกับ CSS
        const cssVideos = data.filter((video: Video) => 
          video.title.toLowerCase().includes('css') || 
          video.description.toLowerCase().includes('css')
        );
        
        // เรียงลำดับตามบทเรียนและเพิ่มระยะเวลา
        cssVideos.sort((a: Video, b: Video) => (a.lesson || 0) - (b.lesson || 0));
        
        // ดึงระยะเวลาสำหรับแต่ละวิดีโอ
        const videosWithDuration = await Promise.all(
          cssVideos.map(async (video: Video) => {
            const videoId = extractVideoId(video.youtubeUrl);
            const duration = await getYouTubeDuration(videoId);
            return { ...video, duration };
          })
        );
        
        setVideos(videosWithDuration);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  }, [extractVideoId]);

  const getYouTubeEmbedUrl = useCallback((url: string): string => {
    const videoId = extractVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : url;
  }, [extractVideoId]);

  useEffect(() => {
    if (user) {
      fetchSkippedLessons();
      fetchVideos();
    }
  }, [user, fetchSkippedLessons, fetchVideos]);

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
  }, [videos, skippedLessons, getYouTubeEmbedUrl]);

  const handleVideoSelect = (video: Video, index: number) => {
    setVideoSrc(getYouTubeEmbedUrl(video.youtubeUrl));
    setVideoTitle(video.title);
    setVideoDescription(video.description);
    setCurrentVideoIndex(index);
    setIsVideoPlaying(true);
    
    // Mark as completed when video is selected
    if (!completedLessons.includes(video.lesson)) {
      markLessonComplete(video.lesson);
    }
  };

  const markLessonComplete = async (lesson: number) => {
    if (!user?.id) return;
    
    try {
      await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseType: 'CSS',
          lesson: lesson,
          completed: true
        })
      });
      
      // Update local state
      setCompletedLessons(prev => [...prev, lesson]);
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const getVideoStatus = (video: Video, index: number) => {
    if (completedLessons.includes(video.lesson)) return 'completed';
    if (index === currentVideoIndex) return 'current';
    if (index < currentVideoIndex) return 'completed';
    return 'pending';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-700 font-medium">กำลังโหลดเนื้อหา...</div>
        </div>
      </div>
    );
  }

  return (
    <RouteGuard requireAuth={true}>
      <PretestChecker courseType="CSS">
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 flex flex-col lg:flex-row gap-6">
          {/* Video Player Section */}
          <div className="flex-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="aspect-video w-full bg-black relative">
                <iframe
                  src={videoSrc}
                  title={videoTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
                {!isVideoPlaying && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium">เลือกวิดีโอเพื่อเริ่มเรียน</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{videoTitle}</h2>
                <p className="text-gray-600 leading-relaxed">{videoDescription}</p>
                
                {filteredVideos.length > 0 && (
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L10 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {filteredVideos[currentVideoIndex]?.duration || '00:00'}
                      </span>
                      <span className="text-sm text-gray-500">
                        บทเรียนที่ {filteredVideos[currentVideoIndex]?.lesson || currentVideoIndex + 1}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96 bg-white rounded-2xl shadow-xl flex flex-col max-h-screen">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">เนื้อหา CSS</h3>
                  <p className="text-purple-100 text-sm mb-2">
                    {currentVideoIndex + 1} จาก {filteredVideos.length} บทเรียน
                  </p>
                  {skippedLessons.length > 0 && (
                    <div className="bg-purple-500 bg-opacity-50 rounded-lg px-3 py-1">
                      <p className="text-purple-100 text-xs">
                        ข้าม {skippedLessons.length} บทเรียน (ผ่าน pretest)
                      </p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="text-2xl font-bold text-white hover:text-red-200 transition-colors ml-4 p-1"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="font-medium">ความคืบหน้า</span>
                <span className="font-bold">
                  {filteredVideos.length > 0 ? 
                    Math.round(((currentVideoIndex + 1) / filteredVideos.length) * 100) : 0
                  }%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${filteredVideos.length > 0 ? 
                      ((currentVideoIndex + 1) / filteredVideos.length) * 100 : 0
                    }%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Video List */}
            <div className="flex-1 overflow-y-auto">
              {filteredVideos.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>
                  <p className="font-medium mb-2">ไม่มีเนื้อหาวิดีโอ CSS ที่ต้องเรียน</p>
                  <p className="text-sm">
                    {skippedLessons.length > 0 ? 
                      `คุณได้ข้าม ${skippedLessons.length} บทเรียนจาก pretest` : 
                      'กำลังโหลดเนื้อหา...'
                    }
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  {filteredVideos.map((video, index) => {
                    const status = getVideoStatus(video, index);
                    const isActive = index === currentVideoIndex;
                    
                    return (
                      <button
                        key={video.id}
                        className={`w-full text-left p-4 rounded-xl mb-2 transition-all duration-200 hover:shadow-md ${
                          isActive 
                            ? 'bg-purple-50 border-2 border-purple-200 shadow-md' 
                            : 'bg-white border border-gray-100 hover:bg-gray-50'
                        }`}
                        onClick={() => handleVideoSelect(video, index)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {status === 'completed' ? (
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            ) : status === 'current' ? (
                              <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                            ) : (
                              <span className="text-gray-600 text-sm font-medium">
                                {video.lesson || index + 1}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium text-sm mb-1 line-clamp-2 ${
                              isActive ? 'text-purple-700' : 'text-gray-800'
                            }`}>
                              {video.title}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-2 mb-3">
                              {video.description}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-400 flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L10 9.586V6z" clipRule="evenodd" />
                                  </svg>
                                  {video.duration || '00:00'}
                                </span>
                                {isActive && (
                                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
                                    กำลังเรียน
                                  </span>
                                )}
                                {status === 'completed' && !isActive && (
                                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                                    เรียนแล้ว
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
              <button 
                onClick={() => router.push('/posttest-css')}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
                ทำข้อสอบหลังเรียน
              </button>
            </div>
          </div>
        </div>
      </PretestChecker>
    </RouteGuard>
  );
}