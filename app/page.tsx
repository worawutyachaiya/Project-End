import Card from "@/components/Carditem"
import News from "@/components/News"
const page = () => {
  return (
    <>
    <header className="">
      <div className="flex justify-center ">
        <img src="https://placehold.co/2000x600"  alt="" />
      </div>
    </header>
    <h2 className="text-4xl sm:text-5xl font-bold text-center mt-12">คอร์สเรียน</h2>
    <Card/>
    <News/>
    </>
  )
}
export default page