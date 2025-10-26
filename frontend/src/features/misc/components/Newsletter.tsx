import { motion } from "framer-motion";
import { useState } from "react";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // Simulate API call
            setTimeout(() => {
                setIsSubscribed(true);
                toast.success("🎉 Welcome aboard! You're now subscribed to our newsletter!", {
                    icon: "📧",
                    style: {
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        color: 'white',
                        fontWeight: '600',
                        borderRadius: '16px',
                        boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)',
                    }
                });
                setEmail("");
            }, 1000);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            <div className="container text-center">
                <motion.div
                    className="max-w-2xl mx-auto"
                    variants={containerVariants}
                >
                    <FaEnvelope className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
                    <h2 className="text-4xl font-bold mb-4">
                        Stay Updated with Latest Deals
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Subscribe to our newsletter and get exclusive access to special offers,
                        new arrivals, and insider tips.
                    </p>

                    {!isSubscribed ? (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                required
                            />
                            <motion.button
                                type="submit"
                                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-lg flex items-center justify-center transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaPaperPlane className="mr-2" />
                                Subscribe
                            </motion.button>
                        </form>
                    ) : (
                        <motion.div
                            className="bg-green-500 text-white px-6 py-4 rounded-lg inline-block"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                        >
                            <FaPaperPlane className="inline mr-2" />
                            Thanks for subscribing! Check your email for confirmation.
                        </motion.div>
                    )}

                    <p className="text-sm mt-4 opacity-75">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Newsletter;
