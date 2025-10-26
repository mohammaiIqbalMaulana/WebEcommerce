import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
    showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    showCloseButton = true,
}) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.8, y: 50 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div
                        className={`w-full ${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden`}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                {title && (
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {title}
                                    </h3>
                                )}
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    >
                                        <FaTimes className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="p-6">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
