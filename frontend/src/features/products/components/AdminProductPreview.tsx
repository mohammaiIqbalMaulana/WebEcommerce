import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { useDeleteProductMutation } from "../api/deleteProduct";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import EditProductPopup from "./EditProductPopup";
import ConfirmDialog from "../../../components/Elements/ConfirmDialog";
import { motion } from "framer-motion";
import { IProduct } from "../../../types/product";

export const AdminProductPreview = (props: IProduct) => {
    const { token } = useAuth();
    const [isShowEditProduct, setIsShowEditProduct] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const deleteMutation = useDeleteProductMutation(token);

    const handleDeleteButtonClick = () => setShowDeleteConfirm(true);
    const handleConfirmDelete = () => deleteMutation.mutate(props.id);
    const handleEditButtonClick = () => {
        console.log('Edit button clicked, setting isShowEditProduct to true');
        setIsShowEditProduct(true);
    };
    const handleVisibilityToggle = () => setIsVisible(!isVisible);

    return (
        <motion.div
            className="rounded-2xl shadow-lg bg-white dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            {isShowEditProduct && (
                <EditProductPopup
                    {...props}
                    setIsShowEditProduct={setIsShowEditProduct}
                />
            )}

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                setIsOpen={setShowDeleteConfirm}
                title="Delete Product"
                message={`Are you sure you want to delete "${props.name}"? This action cannot be undone and will remove the product from all carts and favorites.`}
                confirmText="Delete Product"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                type="danger"
            />

            {/* Status Badge */}
            <div className="flex justify-between items-center mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isVisible
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                    {isVisible ? 'Active' : 'Hidden'}
                </span>
                <div className="flex space-x-1">
                    <motion.button
                        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        onClick={handleVisibilityToggle}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title={isVisible ? "Hide product" : "Show product"}
                    >
                        {isVisible ? <FaEye className="w-3 h-3" /> : <FaEyeSlash className="w-3 h-3" />}
                    </motion.button>
                </div>
            </div>

            <Link to={`/products/${props.id}`} className="block">
                <motion.div
                    className="relative overflow-hidden rounded-xl mb-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <img
                        className="w-full h-[200px] sm:h-[250px] object-cover group-hover:scale-110 transition-transform duration-300"
                        src={props.image as string}
                        alt="Product image"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </motion.div>
            </Link>

            <div className="space-y-3">
                <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 line-clamp-2">
                        <Link to={`/products/${props.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {props.name}
                        </Link>
                    </h5>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ${props.price}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {props.id}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <motion.button
                        id="editProductButton"
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium"
                        onClick={handleEditButtonClick}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <MdEdit className="w-4 h-4 mr-2" />
                        Edit
                    </motion.button>
                    <motion.button
                        id="deleteProductButton"
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium"
                        onClick={handleDeleteButtonClick}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <MdDelete className="w-4 h-4 mr-2" />
                        Delete
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};
