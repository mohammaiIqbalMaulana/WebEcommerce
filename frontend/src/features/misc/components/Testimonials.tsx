import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Fashion Enthusiast",
        content: "Amazing quality and fast shipping! The products exceeded my expectations.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
        name: "Mike Chen",
        role: "Tech Reviewer",
        content: "The electronics section has everything I need. Great prices and reliable service.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
        name: "Emma Davis",
        role: "Home Decor Lover",
        content: "Found the perfect furniture pieces for my home. Professional and stylish!",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
];

const Testimonials = () => {
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

    return (
        <motion.div
            className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            <div className="container">
                <motion.div
                    className="text-center mb-12"
                    variants={itemVariants}
                >
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Join thousands of satisfied customers worldwide
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={containerVariants}
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                        >
                            <div className="flex items-center mb-4">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                            <div className="flex mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FaStar key={i} className="text-yellow-400 w-5 h-5" />
                                ))}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 italic">
                                "{testimonial.content}"
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Testimonials;
