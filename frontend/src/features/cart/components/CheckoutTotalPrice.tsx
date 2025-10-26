import { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
    amount: number;
    children?: ReactNode;
}

const CheckoutTotalPrice = (props: Props) => {
    return (
        <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h5 className="font-bold text-xl text-gray-900 dark:text-white mb-6">Order Summary</h5>

                <div className="space-y-4">
                    <motion.div
                        className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="font-semibold text-gray-900 dark:text-white">${props.amount.toFixed(2)}</span>
                    </motion.div>

                    <motion.div
                        className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                        <span className="text-green-600 dark:text-green-400 font-semibold">Free</span>
                    </motion.div>

                    <motion.div
                        className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <span className="text-gray-600 dark:text-gray-400">Tax</span>
                        <span className="font-semibold text-gray-900 dark:text-white">$0.00</span>
                    </motion.div>

                    <motion.div
                        className="flex justify-between items-center py-4 border-t-2 border-gray-200 dark:border-gray-600"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <span className="text-lg font-bold text-gray-900 dark:text-white">Order Total</span>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">${props.amount.toFixed(2)}</span>
                    </motion.div>
                </div>

                {/* Savings indicator */}
                {props.amount > 50 && (
                    <motion.div
                        className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                            🎉 You've qualified for free shipping!
                        </p>
                    </motion.div>
                )}
            </div>

            {props.children && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                >
                    {props.children}
                </motion.div>
            )}
        </motion.div>
    );
};

export default CheckoutTotalPrice;