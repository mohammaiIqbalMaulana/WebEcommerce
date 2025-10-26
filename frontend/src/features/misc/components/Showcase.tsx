import { motion } from "framer-motion";
import Navbar from "../../../components/Elements/Navbar";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const Showcase = () => {
    return (
        <div className="relative bg-showcase bg-cover bg-center bg-no-repeat mb-8 overflow-hidden">
            {/* Animated background overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/60 to-blue-900/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            />

            {/* Floating particles effect */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [-20, -40, -20],
                            opacity: [0.2, 0.8, 0.2],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                <div className="container text-white pt-4 -mt-4">
                    <Navbar />
                    <div className="flex flex-col items-center text-center pb-40 pt-36 xs:pb-44 xs:pt-40 md:pb-60 md:pt-56">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mb-6"
                        >
                            <span className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                <HiSparkles className="mr-2" />
                                NEW SEASON
                            </span>
                        </motion.div>

                        <motion.h1
                            className="font-bold text-5xl md:text-7xl mb-8 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent leading-tight"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Autumn Collection
                            <br />
                            <span className="text-4xl md:text-5xl">is here</span>
                        </motion.h1>

                        <motion.p
                            className="text-lg md:text-xl mb-8 max-w-2xl leading-relaxed opacity-90"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            The time is now for it to be okay to be great. People in this
                            world shun people for being great. For being a bright color. For
                            standing out. But the time is now to be okay to be the greatest
                            you.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link
                                to="/products/shop"
                                className="group inline-flex items-center font-semibold text-lg bg-gradient-to-r from-white to-gray-100 text-black hover:from-yellow-400 hover:to-orange-500 hover:text-black px-8 py-4 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
                            >
                                Explore Collection
                                <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                to="/products/shop?category=fashion"
                                className="inline-flex items-center font-semibold text-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-4 rounded-2xl border border-white/30 transition-all duration-300"
                            >
                                <HiSparkles className="mr-2" />
                                Shop Fashion
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Showcase;
