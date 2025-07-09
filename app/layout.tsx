// app/layout.tsx

import Navbar from "@/components/Navber";
import Footer from "@/components/Footer";
import "./globals.css"; // ตรวจสอบให้แน่ใจว่า path ถูกต้อง

import { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html>
      {/* กำหนด Background Image ให้กับ <body> ตรงนี้ */}
      <body style={{ backgroundImage: "url('/img/bg-green.jpg')", backgroundSize: "cover", backgroundAttachment: "fixed" }}>
      <Navbar/>
        {children}
      <Footer/>
      </body>
    </html>
  )
}

export default RootLayout;