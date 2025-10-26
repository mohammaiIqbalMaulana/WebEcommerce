import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CarouselProps {
    images: string[];
    autoPlay?: boolean;
    interval?: number;
}

const Carousel = ({ images, autoPlay = true, interval = 5000 }: CarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Preload images
        const preloadImages = images.map((src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = src;
            });
        });

        Promise.all(preloadImages).then(() => {
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false); // Continue even if some images fail
        });
    }, [images]);

    useEffect(() => {
        if (!autoPlay || isLoading) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, interval);

        return () => clearInterval(timer);
    }, [currentIndex, images.length, autoPlay, interval, isLoading]);

    const goToPrevious = () => {
        setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    };

    const goToNext = () => {
        setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    if (isLoading) {
        return (
            <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-200 animate-pulse" style={{ aspectRatio: '4/3' }}>
                <div className="absolute inset-0 bg-gray-300"></div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden rounded-lg" style={{ aspectRatio: '4/3' }}>
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    className="w-full h-full object-cover absolute inset-0"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                />
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200"
            >
                <FaChevronLeft size={20} />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200"
            >
                <FaChevronRight size={20} />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
