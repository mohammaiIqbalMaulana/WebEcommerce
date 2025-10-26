import { Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdWarning, MdClose } from "react-icons/md";

interface ConfirmDialogProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    type?: "danger" | "warning" | "info";
}

const ConfirmDialog = ({
    isOpen,
    setIsOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    type = "danger"
}: ConfirmDialogProps) => {
    const handleConfirm = () => {
        onConfirm();
        setIsOpen(false);
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        setIsOpen(false);
    };

    const getTypeStyles = () => {
        switch (type) {
            case "danger":
                return {
                    icon: <MdWarning className="w-6 h-6 text-red-500" />,
                    confirmButton: "bg-red-500 hover:bg-red-600 focus:ring-red-500/50",
                    iconBg: "bg-red-50 dark:bg-red-900/20"
                };
            case "warning":
                return {
                    icon: <MdWarning className="w-6 h-6 text-yellow-500" />,
                    confirmButton: "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500/50",
                    iconBg: "bg-yellow-50 dark:bg-yellow-900/20"
                };
            case "info":
            default:
                return {
                    icon: <MdWarning className="w-6 h-6 text-blue-500" />,
                    confirmButton: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500/50",
                    iconBg: "bg-blue-50 dark:bg-blue-900/20"
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                >
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-full ${styles.iconBg}`}>
                                    {styles.icon}
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {title}
                                </h2>
                            </div>
                            <motion.button
                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                onClick={() => setIsOpen(false)}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <MdClose className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <motion.button
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-colors"
                                onClick={handleCancel}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {cancelText}
                            </motion.button>
                            <motion.button
                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 transition-colors ${styles.confirmButton}`}
                                onClick={handleConfirm}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {confirmText}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDialog;
