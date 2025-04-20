import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="min-h-dvh flex flex-col md:flex-row items-stretch">
            {/* Text Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="p-6 md:p-8 lg:p-12 w-full md:w-1/2 flex flex-col justify-center text-center md:text-left order-2 md:order-1"
            >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 font-bold">
                    Cuisine Analysis
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl">
                    Analyze the density of an area's cuisine combination...
                </p>
            </motion.div>

            {/* Image Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
                className="w-full aspect-video md:aspect-auto md:w-1/2 md:min-h-dvh bg-cover bg-center order-1 md:order-2"
                style={{ backgroundImage: "url('/restaurant.png')" }}
                role="img"
                aria-label="Restaurant interior with tables and chairs"
            />
        </section>
    );
}
