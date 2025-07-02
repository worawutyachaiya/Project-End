"use client";
import { useState } from "react";

export default function Home() {
    const [videoSrc, setVideoSrc] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ");
    const [videoTitle, setVideoTitle] = useState("บทที่ 1: บทนำ");

    const lessons = [
        {
        title: "บทที่ 1: บทนำ",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        },
        {
        title: "บทที่ 2: แนวคิดสำคัญ",
        url: "https://www.youtube.com/embed/tgbNymZ7vqY",
        },
        {
        title: "บทที่ 3: ตัวอย่างการใช้งาน",
        url: "https://www.youtube.com/embed/xvFZjo5PgG0",
        },
        {
        title: "บทที่ 4: สรุปบทเรียน",
        url: "https://www.youtube.com/embed/kJQP7kiw5Fk",
        },
        {
        title: "บทที่ 5: แบบทดสอบ",
        url: "https://www.youtube.com/embed/9bZkp7q19f0",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col md:flex-row gap-4">
        {/* Main Content */}
        <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
            {/* Video */}
            <div className="aspect-video w-full bg-black">
            <iframe
                src={videoSrc}
                title={videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
            />
            </div>

            {/* Video Description */}
            <div className="p-4 text-gray-700 text-center border-t bg-blue-50">
            <h2 className="text-lg font-semibold">{videoTitle}</h2>
            <p className="text-sm mt-1">คำอธิบายบทเรียนโดยสรุปของเนื้อหานี้</p>
            </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 bg-white rounded-xl shadow-lg flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-blue-100 rounded-t-xl">
            <h3 className="text-lg font-bold text-blue-800">เนื้อหาคอร์ส</h3>
            <button className="text-xl font-bold text-gray-600 hover:text-red-500">×</button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y">
            {lessons.map((lesson, index) => (
                <button
                key={index}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition"
                onClick={() => {
                    setVideoSrc(lesson.url);
                    setVideoTitle(lesson.title);
                }}
                >
                {lesson.title}
                </button>
            ))}
            </div>

            <div className="p-4 border-t">
            <button className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition">
                ทำข้อสอบหลังเรียน
            </button>
            </div>
        </div>
        </div>
    );
}
