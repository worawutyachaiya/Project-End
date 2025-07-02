import Card from "@/components/Carditem"
import Footer from "@/components/Footer"

const page = () => {
  return (
    <>
    <header className="">
      <div className="flex justify-center ">
        <img src="https://placehold.co/2000x600"  alt="" />
      </div>
    </header>

    <section className="bg-black ">
      <div className="container py-10">
        <div className="flex flex-wrap gap-4 justify-center">
          <img src="https://placehold.co/150x50" alt="" />
          <img src="https://placehold.co/150x50" alt="" />
          <img src="https://placehold.co/150x50" alt="" />

        </div>
      </div>
    </section>

    <Card/>
    
    

    

    </>
  )
}
export default page