"use client";

import { useState, useEffect } from "react";

// Types
interface Video {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

interface VideoForm {
  title: string;
  description: string;
  youtubeUrl: string;
  image: File | null;
}

// API functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const videoAPI = {
  // Get all videos
  getVideos: async (): Promise<Video[]> => {
    const response = await fetch(`${API_BASE_URL}/videos`);
    if (!response.ok) throw new Error('Failed to fetch videos');
    return response.json();
  },

  // Create new video
  createVideo: async (formData: FormData): Promise<Video> => {
    const response = await fetch(`${API_BASE_URL}/videos`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create video');
    return response.json();
  },

  // Update video
  updateVideo: async (id: number, formData: FormData): Promise<Video> => {
    const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update video');
    return response.json();
  },

  // Delete video
  deleteVideo: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete video');
  },
};

// Helper function to extract YouTube video ID from URL
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

// Helper function to validate YouTube URL
const isValidYouTubeUrl = (url: string): boolean => {
  return extractYouTubeId(url) !== null;
};

// Helper function to get YouTube thumbnail URL
const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// Helper function to get YouTube embed URL
const getYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`;
};

export default function AdminVideoPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const [form, setForm] = useState<VideoForm>({
    title: "",
    description: "",
    youtubeUrl: "",
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
      const data = await videoAPI.getVideos();
      setVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
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
      image: null,
    });
    setEditingVideo(null);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.youtubeUrl) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // Validate YouTube URL
    if (!isValidYouTubeUrl(form.youtubeUrl)) {
      alert("กรุณากรอก YouTube URL ที่ถูกต้อง");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('youtubeUrl', form.youtubeUrl);
      
      if (form.image) {
        formData.append('image', form.image);
      }

      if (editingVideo) {
        // Update existing video
        const updatedVideo = await videoAPI.updateVideo(editingVideo.id, formData);
        setVideos(videos.map(v => v.id === editingVideo.id ? updatedVideo : v));
        alert("แก้ไขวิดีโอสำเร็จ");
      } else {
        // Create new video
        const newVideo = await videoAPI.createVideo(formData);
        setVideos([...videos, newVideo]);
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
      image: null, // Don't set existing image file
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("คุณต้องการลบวิดีโอนี้หรือไม่?")) return;

    try {
      setError(null);
      await videoAPI.deleteVideo(id);
      setVideos(videos.filter(v => v.id !== id));
      alert("ลบวิดีโอสำเร็จ");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const handleLogout = () => {
    if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
      // Handle logout logic here
      // e.g., clear session, redirect to login
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-black">
      {/* Header */}
      <header className="bg-white/50 backdrop-blur-sm px-6 py-4 flex">
        <div className="w-full flex items-center justify-between gap-4">
          <span className="border px-4 py-1 rounded-full text-black">Admin</span>
          <button 
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            ออกจากระบบ
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white/50 backdrop-blur-sm p-4 shadow text-black">
          <ul className="space-y-2">
            <li className="pl-4">
              <a href="/admin/quiz" className="hover:text-blue-600">จัดการข้อสอบ</a>
            </li>
            <li className="pl-4 font-bold text-blue-600">จัดการวิดีโอ</li>
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
          <div className="space-y-4 max-w-md">
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
              <p className="text-sm text-gray-500 mt-1">
                รองรับ: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
              </p>
              {form.youtubeUrl && isValidYouTubeUrl(form.youtubeUrl) && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">✓ URL ถูกต้อง</p>
                  <div className="mt-2">
                    <iframe
                      width="280"
                      height="158"
                      src={getYouTubeEmbedUrl(extractYouTubeId(form.youtubeUrl)!)}
                      title="YouTube video preview"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded"
                    ></iframe>
                  </div>
                </div>
              )}
              {form.youtubeUrl && !isValidYouTubeUrl(form.youtubeUrl) && (
                <p className="text-sm text-red-600 mt-1">✗ URL ไม่ถูกต้อง</p>
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
              {form.image && (
                <p className="text-sm text-gray-600 mt-1">
                  ไฟล์ที่เลือก: {form.image.name}
                </p>
              )}
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

          {/* Table */}
          <h2 className="text-lg font-bold mt-10">รายการวิดีโอทั้งหมด</h2>
          
          {loading ? (
            <div className="text-center py-8">กำลังโหลด...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full mt-4 border text-sm text-center text-black">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-2 py-1">ลำดับ</th>
                    <th className="border px-2 py-1">หัวข้อหลักสูตร</th>
                    <th className="border px-2 py-1">รายละเอียด</th>
                    <th className="border px-2 py-1">รูปหน้าปก</th>
                    <th className="border px-2 py-1">YouTube Video</th>
                    <th className="border px-2 py-1">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="border px-2 py-4 text-center text-gray-500">
                        ไม่มีข้อมูลวิดีโอ
                      </td>
                    </tr>
                  ) : (
                    videos.map((video, idx) => {
                      const videoId = extractYouTubeId(video.youtubeUrl);
                      const thumbnailUrl = videoId ? getYouTubeThumbnail(videoId) : '';
                      const embedUrl = videoId ? getYouTubeEmbedUrl(videoId) : '';
                      
                      return (
                        <tr key={video.id} className="bg-white">
                          <td className="border px-2 py-1">{idx + 1}</td>
                          <td className="border px-2 py-1">{video.title}</td>
                          <td className="border px-2 py-1 max-w-xs truncate">{video.description}</td>
                          <td className="border px-2 py-1">
                            <img 
                              src={video.image || thumbnailUrl} 
                              alt="รูป" 
                              className="w-16 h-10 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.png';
                              }}
                            />
                          </td>
                          <td className="border px-2 py-1">
                            {embedUrl ? (
                              <iframe
                                width="120"
                                height="68"
                                src={embedUrl}
                                title="YouTube video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded"
                              ></iframe>
                            ) : (
                              <span className="text-red-500">URL ไม่ถูกต้อง</span>
                            )}
                          </td>
                          <td className="border px-2 py-1 space-x-2">
                            <button 
                              onClick={() => handleEdit(video)}
                              className="bg-yellow-400 px-2 py-1 rounded text-white hover:bg-yellow-500"
                            >
                              แก้ไข
                            </button>
                            <button 
                              onClick={() => handleDelete(video.id)}
                              className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
                            >
                              ลบ
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}