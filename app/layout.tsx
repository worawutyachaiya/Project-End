import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navber from "@/components/Navber";
import Footer from "@/components/Footer";

const layout = ({children}) => {
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