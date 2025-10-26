import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CarouselItem {
    id: string | number;
    image: string;
    title?: string;
    description?: string;
    link?: string;
}

interface CarouselProps {
    items: CarouselItem[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showDots?: boolean;
    showArrows?: boolean;
}

export const Carousel: React.FC<CarouselProps> = ({
    items,
    autoPlay = true,
    autoPlayInterval = 5000,
    showDots = true,
    showArrows = true,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? items.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (autoPlay) {
            const interval = setInterval(nextSlide, autoPlayInterval);
            return () => clearInterval(interval);
        }
    }, [currentIndex, autoPlay, autoPlayInterval]);

    return (
        <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <img
                        src={items[currentIndex].image}
                        alt={items[currentIndex].title || "Carousel image"}
                        className="w-full h-full object-cover"
                    />
                    {(items[currentIndex].title || items[currentIndex].description) && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <div className="text-center text-white px-4">
                                {items[currentIndex].title && (
                                    <h2 className="text-2xl md:text-4xl font-bold mb-2">
                                        {items[currentIndex].title}
                                    </h2>
                                )}
                                {items[currentIndex].description && (
                                    <p className="text-lg md:text-xl">
                                        {items[currentIndex].description}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {showArrows && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-2 transition-all duration-200"
                    >
                        <FaChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-2 transition-all duration-200"
                    >
                        <FaChevronRight className="w-6 h-6 text-white" />
                    </button>
                </>
            )}

            {showDots && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                index === currentIndex
                                    ? "bg-white"
                                    : "bg-white bg-opacity-50 hover:bg-opacity-75"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
