// app/admin/video/page.tsx - Optimized version
"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import RouteGuard from '@/components/routeGuard';

// Types
interface Video {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  image: string;
  courseType: string;
  lesson: number;
  createdAt?: string;
  updatedAt?: string;
}

interface VideoForm {
  title: string;
  description: string;
  youtubeUrl: string;
  courseType: string;
  lesson: number;
  image: File | null;
}

// Skeleton Loading Component
const TableSkeleton = () => (
  <div className="overflow-x-auto">
    <table className="w-full mt-4 border text-sm">
      <thead className="bg-gray-200">
        <tr>
          <th className="border px-2 py-1">ลำดับ</th>
          <th className="border px-2 py-1">ประเภท</th>
          <th className="border px-2 py-1">บทเรียน</th>
          <th className="border px-2 py-1">หัวข้อ</th>
          <th className="border px-2 py-1">รายละเอียด</th>
          <th className="border px-2 py-1">รูปหน้าปก</th>
          <th className="border px-2 py-1">วิดีโอ</th>
          <th className="border px-2 py-1">จัดการ</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, i) => (
          <tr key={i} className="bg-white">
            <td className="border px-2 py-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="border px-2 py-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="border px-2 py-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="border px-2 py-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="border px-2 py-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="border px-2 py-1">
              <div className="w-16 h-10 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </td>
            <td className="border px-2 py-1">
              <div className="w-20 h-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </td>
            <td className="border px-2 py-1">
              <div className="flex gap-1">
                <div className="w-12 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Optimized Video Preview Component
const VideoPreview = ({ youtubeUrl, title }: { youtubeUrl: string; title: string }) => {
  const [showIframe, setShowIframe] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailError, setThumbnailError] = useState(false);

  useEffect(() => {
    const videoId = extractYouTubeId(youtubeUrl);
    if (videoId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`);
    }
  }, [youtubeUrl]);

  const extractYouTubeId = (url: string): string | null => {
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
    return null;
  };

  if (!showIframe) {
    return (
      <div className="relative">
        {thumbnailError || !thumbnailUrl ? (
          <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300"
               onClick={() => setShowIframe(true)}>
            <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        ) : (
          <>
            <img 
              src={thumbnailUrl} 
              alt={title || 'Video thumbnail'}
              className="w-20 h-12 object-cover rounded cursor-pointer hover:opacity-80"
              onClick={() => setShowIframe(true)}
              onError={() => setThumbnailError(true)}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  const videoId = extractYouTubeId(youtubeUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

  return embedUrl ? (
    <iframe
      width="120"
      height="68"
      src={embedUrl}
      title={title || 'YouTube video'}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="rounded mx-auto"
    />
  ) : (
    <span className="text-red-500 text-xs">URL ไม่ถูกต้อง</span>
  );
};

// Helper functions
const extractYouTubeId = (url: string): string | null => {
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
  return null;
};

const isValidYouTubeUrl = (url: string): boolean => {
  return extractYouTubeId(url) !== null;
};

const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};

const getYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`;
};

function AdminVideoContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [form, setForm] = useState<VideoForm>({
    title: "",
    description: "",
    youtubeUrl: "",
    courseType: "HTML",
    lesson: 1,
    image: null,
  });

  // Load videos on component mount
  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/videos');
      if (!response.ok) throw new Error('Failed to fetch videos');
      
      const data = await response.json();
      setVideos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  // Filtered and paginated videos
  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || video.courseType === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [videos, searchTerm, filterType]);

  const paginatedVideos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVideos.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVideos, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image") {
      setForm({ ...form, [name]: files?.[0] || null });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      youtubeUrl: "",
      courseType: "HTML",
      lesson: 1,
      image: null,
    });
    setEditingVideo(null);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.youtubeUrl || !form.courseType || !form.lesson) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (!isValidYouTubeUrl(form.youtubeUrl)) {
      alert("กรุณากรอก YouTube URL ที่ถูกต้อง");
      return;
    }

    if (form.lesson < 1 || form.lesson > 10) {
      alert("บทเรียนต้องอยู่ระหว่าง 1-10");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('youtubeUrl', form.youtubeUrl);
      formData.append('courseType', form.courseType);
      formData.append('lesson', form.lesson.toString());
      
      if (form.image) {
        formData.append('image', form.image);
      }

      const url = editingVideo ? `/api/videos/${editingVideo.id}` : '/api/videos';
      const method = editingVideo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to save video');

      const savedVideo = await response.json();

      if (editingVideo) {
        setVideos(videos.map(v => v.id === editingVideo.id ? savedVideo : v));
        alert("แก้ไขวิดีโอสำเร็จ");
      } else {
        setVideos([...videos, savedVideo]);
        alert("เพิ่มวิดีโอสำเร็จ");
      }

      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setForm({
      title: video.title,
      description: video.description,
      youtubeUrl: video.youtubeUrl,
      courseType: video.courseType || "HTML",
      lesson: video.lesson || 1,
      image: null,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("คุณต้องการลบวิดีโอนี้หรือไม่?")) return;

    try {
      setError(null);
      const response = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete video');

      setVideos(videos.filter(v => v.id !== id));
      alert("ลบวิดีโอสำเร็จ");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const handleLogout = async () => {
    if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
      await logout();
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-black">
      {/* Header */}
      <header className="bg-white/50 backdrop-blur-sm px-6 py-4 flex">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <span className="border px-4 py-1 rounded-full text-black">Admin</span>
            <span className="text-gray-700">
              สวัสดี, {user?.firstName} {user?.lastName}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            ออกจากระบบ
          </button>
        </div>
      </header>

      <div className="flex flex-1">
         {/* Sidebar */}
        <aside className="w-64 bg-white/50 backdrop-blur-sm p-4 shadow text-black">
          <ul className="space-y-2">
            <li className="pl-4">
              <a href="/admin/quiz" className="hover:text-blue-600">จัดการข้อสอบ</a>
            </li>
            <li className="pl-4 font-bold text-blue-600">จัดการวิดีโอ</li>
            <li className="pl-4">
              <a href="/admin/students" className="hover:text-blue-600">ข้อมูลนักเรียน</a>
            </li>
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 bg-white/70 backdrop-blur-sm text-black shadow">
          <h1 className="text-xl font-bold mb-6">
            {editingVideo ? 'แก้ไขข้อมูลวิดีโอ' : 'เพิ่มข้อมูลวิดีโอคอร์สเรียน'}
          </h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4 max-w-md mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ประเภทคอร์ส
              </label>
              <select
                name="courseType"
                value={form.courseType}
                onChange={handleChange}
                disabled={submitting}
                className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100"
              >
                <option value="HTML">HTML</option>
                <option value="CSS">CSS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                บทเรียนที่
              </label>
              <select
                name="lesson"
                value={form.lesson}
                onChange={handleChange}
                disabled={submitting}
                className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>บทเรียนที่ {num}</option>
                ))}
              </select>
            </div>

            <input
              type="text"
              name="title"
              placeholder="หัวข้อหลักสูตร"
              value={form.title}
              onChange={handleChange}
              disabled={submitting}
              className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100"
            />

            <input
              type="text"
              name="description"
              placeholder="รายละเอียด"
              value={form.description}
              onChange={handleChange}
              disabled={submitting}
              className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                name="youtubeUrl"
                placeholder="https://www.youtube.com/watch?v=..."
                value={form.youtubeUrl}
                onChange={handleChange}
                disabled={submitting}
                className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100"
              />
              {form.youtubeUrl && (
                <p className={`text-sm mt-1 ${
                  isValidYouTubeUrl(form.youtubeUrl) ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isValidYouTubeUrl(form.youtubeUrl) ? '✓ URL ถูกต้อง' : '✗ URL ไม่ถูกต้อง'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รูปภาพหน้าปก (ถ้าไม่เลือกจะใช้ thumbnail จาก YouTube)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                disabled={submitting}
                className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-black text-white px-6 py-2 rounded disabled:bg-gray-400 hover:bg-gray-800"
              >
                {submitting ? 'กำลังบันทึก...' : editingVideo ? 'อัปเดต' : 'เพิ่ม'}
              </button>
              {editingVideo && (
                <button
                  onClick={resetForm}
                  disabled={submitting}
                  className="bg-gray-500 text-white px-6 py-2 rounded disabled:bg-gray-400 hover:bg-gray-600"
                >
                  ยกเลิก
                </button>
              )}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex gap-4">
            <input
              type="text"
              placeholder="ค้นหาวิดีโอ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border px-4 py-2 rounded text-black"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border px-4 py-2 rounded text-black"
            >
              <option value="all">ทั้งหมด</option>
              <option value="HTML">HTML</option>
              <option value="CSS">CSS</option>
            </select>
          </div>

          {/* Results count */}
          <div className="mb-4 text-sm text-gray-600">
            แสดง {paginatedVideos.length} จาก {filteredVideos.length} วิดีโอ
          </div>

          {/* Table */}
          <h2 className="text-lg font-bold mb-4">รายการวิดีโอทั้งหมด</h2>
          
          {loading ? (
            <TableSkeleton />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border text-sm text-center text-black">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border px-2 py-1">ลำดับ</th>
                      <th className="border px-2 py-1">ประเภท</th>
                      <th className="border px-2 py-1">บทเรียน</th>
                      <th className="border px-2 py-1">หัวข้อหลักสูตร</th>
                      <th className="border px-2 py-1">รายละเอียด</th>
                      <th className="border px-2 py-1">รูปหน้าปก</th>
                      <th className="border px-2 py-1">YouTube Video</th>
                      <th className="border px-2 py-1">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedVideos.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="border px-2 py-4 text-center text-gray-500">
                          {searchTerm || filterType !== 'all' ? 'ไม่พบวิดีโอที่ค้นหา' : 'ไม่มีข้อมูลวิดีโอ'}
                        </td>
                      </tr>
                    ) : (
                      paginatedVideos.map((video, idx) => {
                        const videoId = extractYouTubeId(video.youtubeUrl);
                        const thumbnailUrl = videoId ? getYouTubeThumbnail(videoId) : '';
                        
                        return (
                          <tr key={video.id} className="bg-white">
                            <td className="border px-2 py-1">
                              {(currentPage - 1) * itemsPerPage + idx + 1}
                            </td>
                            <td className="border px-2 py-1">
                              <span className={`px-2 py-1 rounded text-xs ${
                                video.courseType === 'HTML' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {video.courseType}
                              </span>
                            </td>
                            <td className="border px-2 py-1">
                              <span className="font-medium">{video.lesson}</span>
                            </td>
                            <td className="border px-2 py-1 max-w-xs">
                              <div className="truncate" title={video.title}>
                                {video.title}
                              </div>
                            </td>
                            <td className="border px-2 py-1 max-w-xs">
                              <div className="truncate" title={video.description}>
                                {video.description}
                              </div>
                            </td>
                            <td className="border px-2 py-1">
                              <img 
                                src={video.image || thumbnailUrl} 
                                alt="รูป" 
                                className="w-16 h-10 object-cover mx-auto rounded"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder.png';
                                }}
                              />
                            </td>
                            <td className="border px-2 py-1">
                              <VideoPreview 
                                youtubeUrl={video.youtubeUrl} 
                                title={video.title}
                              />
                            </td>
                            <td className="border px-2 py-1">
                              <div className="flex gap-1 justify-center">
                                <button 
                                  onClick={() => handleEdit(video)}
                                  className="bg-yellow-400 px-2 py-1 rounded text-white hover:bg-yellow-500 text-xs"
                                >
                                  แก้ไข
                                </button>
                                <button 
                                  onClick={() => handleDelete(video.id)}
                                  className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600 text-xs"
                                >
                                  ลบ
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ก่อนหน้า
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ถัดไป
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminVideoPage() {
  return (
    <RouteGuard requireAuth={true} requireAdmin={true}>
      <AdminVideoContent />
    </RouteGuard>
  );
}