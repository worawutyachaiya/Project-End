import Card from "@/components/Carditem"
import News from "@/components/News"
import Link from "next/link"
const page = () => {
  return (
    <div  >
    <header >
      <div className="container flex justify-center ">
        <img src="/img/banner.png" alt="Banner" />
      </div>  
    </header>
    <h2 className="text-4xl sm:text-5xl font-bold text-center mt-12">คอร์สเรียน</h2>
    <Card/>
    <div className=" flex items-center justify-center">
      <div className="flex max-w-sm rounded-xl bg-gradient-to-tr from-green-300 to-pink-300 p-0.5 shadow-lg">
          <button className="flex-1 font-bold text-xl bg-white px-4 py-3 rounded-xl">< Link href="/couse" >ดูทั้งหมด</Link></button>
      </div>
    </div>
    <News/>
    </div>
  )
}
export default page