export default function HeroSection() {
    return (
        <section className="h-dvh flex flex-col md:flex-row items-center">
            <div className="p-4 md:w-1/2 flex flex-col justify-center">
                <h1 className="text-[5rem] mb-4">Cuisine Analysis</h1>
                <p className="text-[2rem]">
                    Analyze the density of an area's cuisine combination...
                </p>
            </div>
            <div className="md:w-1/2 h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('/restaurant.png')" }} />
        </section>
    )
}
