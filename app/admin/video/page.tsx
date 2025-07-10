"use client";

import { useState } from "react";

export default function AdminVideoPage() {
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: "HTML คืออะไร",
      description: "แนะนำพื้นฐาน HTML",
      uri: "https://example.com/html-intro",
      image: "/placeholder.png",
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    uri: "",
    image: null as File | null,
  });

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddVideo = () => {
    if (!form.title || !form.description || !form.uri) return alert("กรุณากรอกข้อมูลให้ครบ");

    const newVideo = {
      id: videos.length + 1,
      title: form.title,
      description: form.description,
      uri: form.uri,
      image: URL.createObjectURL(form.image!),
    };

    setVideos([...videos, newVideo]);

    setForm({
      title: "",
      description: "",
      uri: "",
      image: null,
    });
  };

  return (
    <div className="min-h-screen flex flex-col text-black">
      {/* Header */}
      <header className="bg-white/50 backdrop-blur-sm px-6 py-4 flex">
        <div className="w-full flex items-center justify-between gap-4">
          <span className="border px-4 py-1 rounded-full text-black">Admin</span>
          <button className="bg-black text-white px-4 py-2 rounded">ออกจากระบบ</button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white/50 backdrop-blur-sm p-4 shadow text-black">
          <ul className="space-y-2">
            <li className="pl-4">
              <a href="/admin/quiz">จัดการข้อสอบ</a>
            </li>
            <li className="pl-4 font-bold text-blue-600">จัดการวิดีโอ</li>
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 bg-white/70 backdrop-blur-sm text-black shadow">
          <h1 className="text-xl font-bold mb-6">เพิ่มข้อมูลวิดีโอคอร์สเรียน</h1>

          <div className="space-y-4 max-w-md">
            <input
              type="text"
              name="title"
              placeholder="หัวข้อหลักสูตร"
              value={form.title}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded text-black"
            />
            <input
              type="text"
              name="description"
              placeholder="รายละเอียด"
              value={form.description}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded text-black"
            />
            <input
              type="text"
              name="uri"
              placeholder="URI วิดีโอ"
              value={form.uri}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded text-black"
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded text-black"
            />
            <button
              onClick={handleAddVideo}
              className="bg-black text-white px-6 py-2 rounded"
            >
              เพิ่ม
            </button>
          </div>

          {/* ตารางรายการ */}
          <h2 className="text-lg font-bold mt-10">รายละเอียดการเพิ่ม</h2>
          <table className="w-full mt-4 border text-sm text-left text-black">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-1">ลำดับ</th>
                <th className="border px-2 py-1">หัวข้อหลักสูตร</th>
                <th className="border px-2 py-1">รูปหลักสูตร</th>
                <th className="border px-2 py-1">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video, idx) => (
                <tr key={video.id} className="bg-white">
                  <td className="border px-2 py-1">{idx + 1}</td>
                  <td className="border px-2 py-1">{video.title}</td>
                  <td className="border px-2 py-1">
                    <img src={video.image} alt="รูป" className="w-16 h-10 object-cover" />
                  </td>
                  <td className="border px-2 py-1 space-x-2">
                    <button className="bg-yellow-400 px-2 py-1 rounded text-white hover:cursor-pointer">แก้ไข</button>
                    <button className="bg-red-500 px-2 py-1 rounded text-white hover:cursor-pointer">ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>

    </div>
  );
}
