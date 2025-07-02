import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navber from "@/components/Navber";
import Footer from "@/components/Footer";

import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <html >
      <body >
        <Navber />

        
        

        {children}
    
      <Footer/>
      </body>
    </html>
  )
}
export default layout