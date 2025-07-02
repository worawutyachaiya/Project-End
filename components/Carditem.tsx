const carditem = () => {
    return (

        <section className="container  ">
            <div className=" mt-8  py-10">
                <h2 className="text-4xl sm:text-5xl font-bold text-center">คอร์สเรียน</h2>
            </div>
            <div className="flex gap-8 justify-center">
                    <div className="">
                        <img className="rounded-4xl" src="https://placehold.co/400x400" alt="" />
                        <div className="flex justify-between items-center p-4 mt-4">
                            <p className="text-xl">Html.5</p>
                            <button className="bg-amber-500 p-2 rounded w-20">เรียน</button>
                        </div>
                    </div>

                    <div className="">
                        <img className="rounded-4xl" src="https://placehold.co/400x400" alt="" />
                        <div className="flex justify-between items-center p-4 mt-4">
                            <p className="text-xl">Html.5</p>
                            <button className="bg-amber-500 p-2 rounded w-20">เรียน</button>
                        </div>
                    </div>

                    <div className="">
                        <img className="rounded-4xl" src="https://placehold.co/400x400" alt="" />
                        <div className="flex justify-between items-center p-4 mt-4">
                            <p className="text-xl">Html.5</p>
                            <button className="bg-amber-500 p-2 rounded w-20">เรียน</button>
                        </div>
                    </div>
                </div>
            <div className="m-10  text-center">
                        <a
                        href="#"
                        className="border border-gray-300 px-24 py-4 inline-block rounded-full"
                        >ดูทั้งหมด</a>
                    </div>
        </section>
        
    )
}
export default carditem