// app/cssvideo/page.tsx
"use client";
import { useState, useEffect } from "react";

interface Video {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  image: string;
}

export default function CSSVideoPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoSrc, setVideoSrc] = useState("");
  const [videoTitle, setVideoTitle] = useState("แนะนําเนื้อหา");
  const [videoDescription, setVideoDescription] = useState("คำอธิบายบทเรียนโดยสรุปของเนื้อหานี้");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        // กรองเฉพาะวิดีโอที่เกี่ยวกับ CSS
        const cssVideos = data.filter((video: Video) => 
          video.title.toLowerCase().includes('css') || 
          video.description.toLowerCase().includes('css')
        );
        // เรียงลำดับให้คลิปที่เพิ่มมาก่อนอยู่ด้านบนสุด (เรียงตาม id จากน้อยไปมาก)
        cssVideos.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
        setVideos(cssVideos);
        
        if (cssVideos.length > 0) {
          setVideoSrc(getYouTubeEmbedUrl(cssVideos[0].youtubeUrl));
          setVideoTitle(cssVideos[0].title);
          setVideoDescription(cssVideos[0].description);
          setCurrentVideoIndex(0);
        }
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

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
    const durations = ['18:45', '22:30', '15:20', '25:15', '19:35'];
    return durations[index % durations.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">กำลังโหลดเนื้อหา...</div>
      </div>
    );
  }

  return (
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
        <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-xl">
          <div>
            <h3 className="text-lg font-bold">เนื้อหา CSS</h3>
            <p className="text-purple-100 text-sm">
              {currentVideoIndex + 1} จาก {videos.length} บทเรียน
            </p>
          </div>
          <button className="text-xl font-bold text-white hover:text-red-300 transition-colors">×</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {videos.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              ไม่มีเนื้อหาวิดีโอ CSS
            </div>
          ) : (
            <div className="space-y-1">
              {videos.map((video, index) => (
                <button
                  key={video.id}
                  className={`w-full text-left p-4 transition-all duration-200 hover:bg-gray-50 ${
                    index === currentVideoIndex 
                      ? 'bg-purple-50 border-r-4 border-purple-500' 
                      : 'border-r-4 border-transparent'
                  }`}
                  onClick={() => handleVideoSelect(video, index)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                      {index === currentVideoIndex ? (
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                      ) : (
                        <span className="text-gray-600">{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm mb-1 ${
                        index === currentVideoIndex ? 'text-purple-700' : 'text-gray-800'
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
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
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
              <span>{Math.round(((currentVideoIndex + 1) / videos.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentVideoIndex + 1) / videos.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
            ทำข้อสอบหลังเรียน
          </button>
        </div>
      </div>
    </div>
  );
}