import { AiOutlinePlus, AiOutlineDownload, AiOutlineUpload } from "react-icons/ai";
import { useState } from "react";
import CreateProductPopup from "./CreateProductPopup";
import { useAuth } from "../../../context/AuthContext";
import ProductsDashboard from "./ProductsDashboard";
import { motion } from "framer-motion";
import { BiSolidGrid } from "react-icons/bi";
import { HiOutlineViewList } from "react-icons/hi";

export const AdminProducts = () => {
    const [isShowCreateProduct, setIsShowCreateProduct] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { isAdmin } = useAuth();

    const handleCreateProduct = () => {
        setIsShowCreateProduct(true);
    };

    return (
        <>
            <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
                    <div>
                        <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-2">Manage Products</h3>
                        <p className="text-gray-600 dark:text-gray-400">Add, edit, and organize your product catalog</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
                        {/* View Mode Toggle */}
                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-all ${
                                    viewMode === 'grid'
                                        ? 'bg-white dark:bg-gray-600 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400'
                                }`}
                            >
                                <BiSolidGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-white dark:bg-gray-600 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400'
                                }`}
                            >
                                <HiOutlineViewList className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Bulk Actions */}
                        <motion.button
                            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <AiOutlineDownload className="w-4 h-4 mr-2" />
                            Export
                        </motion.button>

                        <motion.button
                            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <AiOutlineUpload className="w-4 h-4 mr-2" />
                            Import
                        </motion.button>

                        {/* Create Product */}
                        <motion.button
                            id="create-product"
                            onClick={handleCreateProduct}
                            className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <AiOutlinePlus className="w-5 h-5 mr-2" />
                            Create Product
                        </motion.button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl"
                        whileHover={{ y: -2 }}
                    >
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Products</p>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">156</p>
                    </motion.div>
                    <motion.div
                        className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl"
                        whileHover={{ y: -2 }}
                    >
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">Active</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">142</p>
                    </motion.div>
                    <motion.div
                        className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-xl"
                        whileHover={{ y: -2 }}
                    >
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Low Stock</p>
                        <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">8</p>
                    </motion.div>
                    <motion.div
                        className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-xl"
                        whileHover={{ y: -2 }}
                    >
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">Out of Stock</p>
                        <p className="text-2xl font-bold text-red-700 dark:text-red-300">6</p>
                    </motion.div>
                </div>

                {/* Products Dashboard */}
                <ProductsDashboard
                    isAdmin={isAdmin}
                    viewMode={viewMode}
                />
            </motion.div>

            {isShowCreateProduct && (
                <CreateProductPopup setIsShowCreateProduct={setIsShowCreateProduct} />
            )}
        </>
    );
};



