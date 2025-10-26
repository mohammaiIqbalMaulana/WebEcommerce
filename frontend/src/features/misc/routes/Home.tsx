import { motion } from "framer-motion";
import { CaterogyBox } from "../components/CaterogyBox";
import Showcase from "../components/Showcase";
import Footer from "../components/Footer";
import Carousel from "../../../components/Elements/Carousel";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import Stats from "../components/Stats";
import categoryElectronics from "../../../assets/images/Home/categoryElectronics.webp";
import categoryFashion from "../../../assets/images/Home/categoryFashion.webp";
import categoryHome from "../../../assets/images/Home/categoryHome.webp";
import categoryFurniture from "../../../assets/images/Home/categoryFurniture.webp";
import categoryBooks from "../../../assets/images/Home/categoryBooks.webp";
import starter1 from "../../../assets/images/Home/starter1.webp";
import starter2 from "../../../assets/images/Home/starter2.webp";
import starter3 from "../../../assets/images/Home/starter3.webp";
import starter4 from "../../../assets/images/Home/starter4.webp";
import { FaArrowRightLong, FaStar, FaPercent } from "react-icons/fa6";
import { FaShippingFast, FaShieldAlt } from "react-icons/fa";
import { HiGift } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export const Home = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Countdown timer for discounts
    useEffect(() => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 7); // 7 days from now

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const carouselImages = [starter1, starter2, starter3, starter4];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <Showcase />

            {/* Stats Section */}
            <Stats />

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Features Section */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20 lg:mb-24 mt-8 sm:mt-10"
                    variants={containerVariants}
                >
                    <motion.div
                        className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl group hover:shadow-2xl transition-all duration-300"
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="bg-blue-500 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:animate-pulse-glow">
                            <FaShippingFast className="text-xl sm:text-2xl lg:text-3xl text-white" />
                        </div>
                        <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900 dark:text-white">Free Shipping</h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">Free shipping on orders over $50 with fast, reliable delivery worldwide.</p>
                    </motion.div>
                    <motion.div
                        className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl group hover:shadow-2xl transition-all duration-300"
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="bg-green-500 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:animate-pulse-glow">
                            <FaShieldAlt className="text-xl sm:text-2xl lg:text-3xl text-white" />
                        </div>
                        <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900 dark:text-white">Secure Payment</h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">100% secure payment processing with multiple payment options available.</p>
                    </motion.div>
                    <motion.div
                        className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl group hover:shadow-2xl transition-all duration-300"
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="bg-yellow-500 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:animate-pulse-glow">
                            <FaStar className="text-xl sm:text-2xl lg:text-3xl text-white" />
                        </div>
                        <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900 dark:text-white">Quality Guarantee</h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">30-day return policy with premium quality assurance on all products.</p>
                    </motion.div>
                </motion.div>

                {/* Homepage Categories Section */}
                <motion.div
                    className="mb-16 sm:mb-20 lg:mb-24"
                    variants={itemVariants}
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
                        <div className="mb-4 sm:mb-0">
                            <h3 className="font-semibold text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:to-gray-300 bg-clip-text text-transparent">
                                Shop by Category
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Discover our curated collections</p>
                        </div>
                        <div className="hidden sm:flex cursor-pointer font-medium hover:underline items-center text-sm sm:text-base text-blue-600 hover:text-blue-700 transition-colors">
                            <Link to="/products/shop" className="block mr-2">
                                Browse all categories
                            </Link>
                            <FaArrowRightLong />
                        </div>
                    </div>
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <CaterogyBox title="Electronics" img={categoryElectronics} />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <CaterogyBox title="Fashion" img={categoryFashion} />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <CaterogyBox title="Home" img={categoryHome} />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <CaterogyBox title="Furniture" img={categoryFurniture} />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <CaterogyBox title="Books" img={categoryBooks} />
                        </motion.div>
                    </motion.div>
                </motion.div>
                {/* End Homepage Categories Section */}

                {/* Homepage New Arrivals Section */}
                <motion.div
                    className="mb-16 sm:mb-20 lg:mb-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-center text-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
                    variants={itemVariants}
                >
                    <motion.div
                        className="bg-black/20 w-full h-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-12 sm:py-16 lg:py-20 rounded-2xl sm:rounded-3xl backdrop-blur-sm"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="flex justify-center mb-4 sm:mb-6">
                            <span className="bg-yellow-400 text-black px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-xs sm:text-sm">NEW ARRIVALS</span>
                        </div>
                        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                            Discover the Latest
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg xl:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
                            Explore our newest collection featuring trending styles, innovative designs, and unbeatable quality.
                        </p>
                        <Link
                            to="/products/shop"
                            className="inline-flex items-center font-semibold text-sm sm:text-base lg:text-lg bg-white text-purple-600 hover:bg-yellow-400 hover:text-purple-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Explore Now
                            <FaArrowRightLong className="ml-2" />
                        </Link>
                    </motion.div>
                </motion.div>
                {/* End Homepage New Arrivals Section */}

                {/* Homepage Basic Starter Section */}
                <motion.div
                    className="flex flex-col lg:flex-row mb-16 sm:mb-20 lg:mb-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl"
                    variants={itemVariants}
                >
                    <motion.div
                        className="w-full lg:w-1/2 shrink-0 mb-6 sm:mb-8 mr-0 lg:mr-8"
                        variants={itemVariants}
                    >
                        <div className="flex items-center mb-3 sm:mb-4">
                            <HiGift className="text-2xl sm:text-3xl text-purple-500 mr-2 sm:mr-3" />
                            <h3 className="font-semibold text-xl sm:text-2xl lg:text-3xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Basic Starter Pack
                            </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed">
                            The Basic Starter Pack allows you to fully express your vibrant personality with four grayscale options. Feeling adventurous? Put on a heather gray shirt. Want to be a trendsetter? Try our exclusive colorway: `Orange`. Need to add an extra pop of color to your outfit? Our white shirt has you covered.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                            <div className="bg-white dark:bg-gray-700 p-4 sm:p-6 rounded-xl shadow-lg">
                                <h6 className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-sm sm:text-base">Origin</h6>
                                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Designed by Good Goods, Inc.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-4 sm:p-6 rounded-xl shadow-lg">
                                <h6 className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-sm sm:text-base">Material</h6>
                                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Solid walnut base with rare earth magnets and powder coated steel card cover</p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-4 sm:p-6 rounded-xl shadow-lg">
                                <h6 className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-sm sm:text-base">Dimensions</h6>
                                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">6.25" x 3.55" x 1.15"</p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-4 sm:p-6 rounded-xl shadow-lg">
                                <h6 className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-sm sm:text-base">Finish</h6>
                                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Hand sanded and finished with natural oil</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        className="w-full lg:w-1/2"
                        variants={itemVariants}
                    >
                        <Carousel images={carouselImages} autoPlay={true} interval={3000} />
                    </motion.div>
                </motion.div>
                {/* End Homepage Basic Starter Section */}

                {/* Homepage Discounts Section */}
                <motion.div
                    className="border-2 border-dashed border-purple-300 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900 px-4 sm:px-6 md:px-10 lg:px-20 pt-12 sm:pt-16 lg:pt-20 xl:pt-32 pb-8 sm:pb-10 lg:pb-12 mb-16 sm:mb-20 lg:mb-24 shadow-2xl"
                    variants={itemVariants}
                >
                    <motion.div
                        className="py-6 sm:py-8 px-4 sm:px-6 md:px-10 lg:px-16 text-center bg-white/80 dark:bg-gray-800/80 shadow-2xl backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="flex justify-center items-center mb-4 sm:mb-6">
                            <FaPercent className="text-2xl sm:text-3xl lg:text-4xl text-purple-500 mr-2 sm:mr-3" />
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold text-lg sm:text-xl lg:text-2xl">
                                EXCLUSIVE OFFER
                            </span>
                        </div>

                        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">
                            Exclusive discounts for members
                        </h2>

                        <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                            Join our membership program and get exclusive discounts on all products. Limited time offer!
                        </p>

                        {/* Countdown Timer */}
                        <div className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-3 sm:p-4 rounded-xl shadow-lg min-w-[60px] sm:min-w-[80px]">
                                <div className="text-lg sm:text-xl lg:text-2xl font-bold">{timeLeft.days}</div>
                                <div className="text-xs opacity-90">Days</div>
                            </div>
                            <div className="bg-gradient-to-br from-pink-500 to-yellow-500 text-white p-3 sm:p-4 rounded-xl shadow-lg min-w-[60px] sm:min-w-[80px]">
                                <div className="text-lg sm:text-xl lg:text-2xl font-bold">{timeLeft.hours}</div>
                                <div className="text-xs opacity-90">Hours</div>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-3 sm:p-4 rounded-xl shadow-lg min-w-[60px] sm:min-w-[80px]">
                                <div className="text-lg sm:text-xl lg:text-2xl font-bold">{timeLeft.minutes}</div>
                                <div className="text-xs opacity-90">Min</div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-3 sm:p-4 rounded-xl shadow-lg min-w-[60px] sm:min-w-[80px]">
                                <div className="text-lg sm:text-xl lg:text-2xl font-bold">{timeLeft.seconds}</div>
                                <div className="text-xs opacity-90">Sec</div>
                            </div>
                        </div>

                        <Link
                            to="/products/shop"
                            className="inline-flex items-center font-semibold text-sm sm:text-base lg:text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <HiGift className="mr-2 sm:mr-3 text-lg sm:text-xl" />
                            Get Your Code
                        </Link>
                    </motion.div>
                </motion.div>
                {/* End Homepage Discounts Section */}

                {/* Testimonials Section */}
                <Testimonials />

                {/* Newsletter Section */}
                <Newsletter />
            </div>

            <Footer />
        </motion.div>
    );
};
