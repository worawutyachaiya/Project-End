import Card from "@/components/Carditem"
import News from "@/components/News"
import Link from "next/link"

const page = () => {
  return (
    <div>
      <header>
        <div className="container flex justify-center">
          <img src="/img/banner.png" alt="Banner" />
        </div>  
      </header>
      
      <h2 className="text-4xl sm:text-5xl font-bold text-center mt-12">คอร์สเรียน</h2>
      <Card/>
      
      <div className="flex items-center justify-center">
        <Link href="/couse">
          <button className="font-bold text-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-3 rounded-xl 
                           hover:from-teal-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 
                           shadow-lg hover:shadow-xl">
            ดูทั้งหมด
          </button>
        </Link>
      </div>
      
      <News/>
    </div>
  )
}

export default page