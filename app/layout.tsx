// app/layout.tsx
'use client'
import { AuthProvider } from '@/lib/auth-context'
import Navbar from "@/components/Navber";
import Footer from "@/components/Footer";
import "./globals.css";
import { ReactNode } from "react";
import { usePathname } from 'next/navigation';

const RootLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  
  // กำหนด routes ที่ไม่ต้องการ nav และ footer
  const hideNavFooter = ['/login', '/register','/admin/quiz','/admin/video','/admin/students','/reset-password'].includes(pathname);

  return (
    <html>
      <body style={{ 
        backgroundImage: "url('/img/bg-green.jpg')", 
        backgroundSize: "cover", 
        backgroundAttachment: "fixed" 
      }}>
        {!hideNavFooter && <Navbar />}
        <AuthProvider>
          {children}
        </AuthProvider>
        {!hideNavFooter && <Footer />}
      </body>
    </html>
  )
}

export default RootLayout;