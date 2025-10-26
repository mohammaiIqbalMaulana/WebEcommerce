import Navbar from "../../../components/Elements/Navbar";
import { ProductPreview } from "../components/ProductPreview";
import { useSelector } from "react-redux";
import { selectFavorites } from "../favoritesSlice";
import { useMemo } from "react";
import { MdHeartBroken, MdFavorite } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Favorites = () => {
    const favorites = useSelector(selectFavorites);
    const favoritesView = useMemo(() => {
        return favorites.map(favorite => (
            <ProductPreview 
                key={favorite.id}
                {...favorite}
            />
        ));
    }, [favorites]);
    
    return (
        <motion.div
            className="min-h-screen bg-gray-50 dark:bg-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Navbar />
            <div className="container py-8">
                {/* Header Section */}
                <motion.div
                    className="flex items-center justify-between mb-8"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center space-x-4">
                        <motion.div
                            className="p-3 bg-red-100 dark:bg-red-900 rounded-2xl"
                            whileHover={{ scale: 1.05 }}
                        >
                            <MdFavorite className="w-8 h-8 text-red-500" />
                        </motion.div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">My Favorites</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {favorites.length} {favorites.length === 1 ? 'favorite' : 'favorites'} saved
                            </p>
                        </div>
                    </div>
                </motion.div>

                {favorites.length > 0 ? (
                    <>
                        {/* Favorites Grid */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {favoritesView}
                        </motion.div>

                        {/* Call to Action */}
                        <motion.div
                            className="mt-12 text-center"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    Discover More Amazing Products
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                    Explore our full collection and find your next favorite item
                                </p>
                                <Link
                                    to="/products/shop"
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <span>Browse Products</span>
                                    <FaArrowRightLong className="ml-2 w-5 h-5" />
                                </Link>
                            </div>
                        </motion.div>
                    </>
                ) : (
                    /* Empty Favorites State */
                    <motion.div
                        className="text-center py-20"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.div
                            className="w-32 h-32 mx-auto mb-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                        >
                            <MdHeartBroken className="w-16 h-16 text-red-400" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            No favorites yet
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-md mx-auto">
                            Start exploring our products and save your favorites for easy access later!
                        </p>
                        <Link
                            to="/products/shop"
                            className="inline-flex items-center px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <span>Explore Products</span>
                            <FaArrowRightLong className="ml-2 w-5 h-5" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Favorites;
