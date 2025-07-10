"use client";

import { useState, useEffect } from "react";

// Types
interface Video {
  id: number;
  title: string;
  description: string;
  videoFile: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

interface VideoForm {
  title: string;
  description: string;
  videoFile: File | null;
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

export default function AdminVideoPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const [form, setForm] = useState<VideoForm>({
    title: "",
    description: "",
    videoFile: null,
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
    if (name === "image" || name === "videoFile") {
      setForm({ ...form, [name]: files?.[0] || null });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      videoFile: null,
      image: null,
    });
    setEditingVideo(null);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.videoFile) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน รวมทั้งเลือกไฟล์วิดีโอ");
      return;
    }

    // Check file size (e.g., max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (form.videoFile.size > maxSize) {
      alert("ไฟล์วิดีโอมีขนาดใหญ่เกินไป (สูงสุด 500MB)");
      return;
    }

    // Check file type
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'];
    if (!allowedTypes.includes(form.videoFile.type)) {
      alert("รองรับเฉพาะไฟล์วิดีโอ: MP4, AVI, MOV, WMV, FLV");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('videoFile', form.videoFile);
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
      videoFile: null, // Don't set existing video file
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
                ไฟล์วิดีโอ (สูงสุด 500MB)
              </label>
              <input
                type="file"
                name="videoFile"
                accept="video/mp4,video/avi,video/mov,video/wmv,video/flv"
                onChange={handleChange}
                disabled={submitting}
                className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100"
              />
              {form.videoFile && (
                <p className="text-sm text-gray-600 mt-1">
                  ไฟล์ที่เลือก: {form.videoFile.name} ({(form.videoFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รูปภาพหน้าปก
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
              <table className="w-full mt-4 border text-sm text-left text-black">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-2 py-1">ลำดับ</th>
                    <th className="border px-2 py-1">หัวข้อหลักสูตร</th>
                    <th className="border px-2 py-1">รายละเอียด</th>
                    <th className="border px-2 py-1">รูปหน้าปก</th>
                    <th className="border px-2 py-1">ไฟล์วิดีโอ</th>
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
                    videos.map((video, idx) => (
                      <tr key={video.id} className="bg-white">
                        <td className="border px-2 py-1">{idx + 1}</td>
                        <td className="border px-2 py-1">{video.title}</td>
                        <td className="border px-2 py-1 max-w-xs truncate">{video.description}</td>
                        <td className="border px-2 py-1">
                          <img 
                            src={video.image} 
                            alt="รูป" 
                            className="w-16 h-10 object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.png';
                            }}
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <video 
                            src={video.videoFile} 
                            className="w-20 h-12 object-cover"
                            controls
                            preload="metadata"
                          />
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
                    ))
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