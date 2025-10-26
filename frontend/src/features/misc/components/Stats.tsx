import { motion } from "framer-motion";
import { FaUsers, FaShoppingCart, FaStar, FaGlobe } from "react-icons/fa";

const stats = [
    {
        icon: FaUsers,
        value: "50K+",
        label: "Happy Customers",
        description: "Trusted by customers worldwide"
    },
    {
        icon: FaShoppingCart,
        value: "100K+",
        label: "Products Sold",
        description: "Quality products delivered"
    },
    {
        icon: FaStar,
        value: "4.9",
        label: "Average Rating",
        description: "Customer satisfaction score"
    },
    {
        icon: FaGlobe,
        value: "25+",
        label: "Countries",
        description: "Global shipping available"
    }
];

const Stats = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <motion.div
            className="py-16 bg-white dark:bg-gray-900"
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
                        Our Impact in Numbers
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Making a difference, one customer at a time
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    variants={containerVariants}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="text-center group"
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                        >
                            <motion.div
                                className="bg-gradient-to-br from-blue-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <stat.icon className="w-8 h-8" />
                            </motion.div>
                            <motion.h3
                                className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {stat.value}
                            </motion.h3>
                            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                {stat.label}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {stat.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Stats;
