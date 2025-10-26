import Navbar from "../../../components/Elements/Navbar";
import { MdFavoriteBorder, MdFavorite, MdShoppingCart, MdStar } from "react-icons/md";
import { ProductQuantitySelectBox } from "../../../components/Form";
import { useParams } from "react-router-dom";
import { useGetSingleProductQuery } from "../api/getSingleProduct";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { addToCart } from "../../cart/cartSlice";
import { ChangeEvent, useState } from "react";
import {
    removeFavorite,
    addFavorite,
    selectFavorites,
} from "../favoritesSlice";
import { FcCheckmark } from "react-icons/fc";
import { RxCross1 } from "react-icons/rx";
import { Spinner } from "../../../components/Elements/Spinner";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Product = () => {
    const { productId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const [productQuantity, setProductQuantity] = useState<number>(1);
    const favorites = useSelector(selectFavorites);
    const [isFavorite, setIsFavorite] = useState<boolean>(
        favorites.some((favorite) => favorite.id === productId)
    );

    const {
        data: product,
        isSuccess,
        isLoading,
    } = useGetSingleProductQuery(productId as string);
    if (!isSuccess) {
        return null;
    }

    const handleAddToCart = () => {
        dispatch(addToCart({ product, quantity: productQuantity }));
        toast.success("🚀 Product added to cart! Ready to checkout?", {
            icon: "🛒",
            style: {
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                fontWeight: '600',
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)',
            }
        });
    };

    const handleFavoriteChange = () => {
        isFavorite
            ? dispatch(removeFavorite({ id: productId || "" }))
            : dispatch(addFavorite(product));
        setIsFavorite((prevFavorite) => !prevFavorite);
    };

    const handleQuantityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newQuantity = Number(e.target.value);
        setProductQuantity(newQuantity);
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <motion.div
            className="min-h-screen bg-gray-50 dark:bg-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Navbar />
            <div className="container py-8">
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Product Image Section */}
                        <motion.div
                            className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-8 flex items-center justify-center"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <motion.img
                                className="w-full max-w-md h-[500px] object-cover rounded-2xl shadow-xl"
                                src={product.image as string}
                                alt="Product image"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                whileHover={{ scale: 1.05, rotate: 2 }}
                            />
                            {/* Floating badges */}
                            <motion.div
                                className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                New Arrival
                            </motion.div>
                            <motion.div
                                className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                -20%
                            </motion.div>
                        </motion.div>

                        {/* Product Details Section */}
                        <motion.div
                            className="p-8 lg:p-12 space-y-6"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            {/* Product Title */}
                            <div>
                                <motion.h1
                                    className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    {product.name}
                                </motion.h1>
                                <motion.div
                                    className="flex items-center space-x-2 mb-4"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <MdStar key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <span className="text-gray-600 dark:text-gray-400">(4.8) • 127 reviews</span>
                                </motion.div>
                            </div>

                            {/* Price */}
                            <motion.div
                                className="flex items-center space-x-4"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                                    ${product.price}
                                </span>
                                <span className="text-xl text-gray-500 line-through">
                                    ${(product.price * 1.25).toFixed(0)}
                                </span>
                                <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
                                    Save 20%
                                </span>
                            </motion.div>

                            {/* Description */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {product.description}
                                </p>
                            </motion.div>

                            {/* Stock Status */}
                            <motion.div
                                className="flex items-center space-x-2"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.9 }}
                            >
                                {product.stockQuantity > 0 ? (
                                    <>
                                        <FcCheckmark className="w-5 h-5" />
                                        <span className="text-green-600 dark:text-green-400 font-medium">
                                            In Stock ({product.stockQuantity} available)
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <RxCross1 className="w-5 h-5 text-red-500" />
                                        <span className="text-red-600 dark:text-red-400 font-medium">
                                            Out of Stock
                                        </span>
                                    </>
                                )}
                            </motion.div>

                            {/* Quantity Selector */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.0 }}
                            >
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Quantity
                                </label>
                                <ProductQuantitySelectBox
                                    quantity={productQuantity}
                                    handleQuantityChange={handleQuantityChange}
                                    stockQuantity={product.stockQuantity}
                                />
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 pt-6"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.1 }}
                            >
                                <motion.button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-3"
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={product.stockQuantity === 0}
                                >
                                    <MdShoppingCart className="w-6 h-6" />
                                    <span>Add to Cart</span>
                                </motion.button>

                                <motion.button
                                    onClick={handleFavoriteChange}
                                    className="p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        animate={{ scale: isFavorite ? 1.2 : 1 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        {isFavorite ? (
                                            <MdFavorite className="w-6 h-6 text-red-500" />
                                        ) : (
                                            <MdFavoriteBorder className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                        )}
                                    </motion.div>
                                </motion.button>
                            </motion.div>

                            {/* Additional Info */}
                            <motion.div
                                className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.2 }}
                            >
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">Free</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Shipping</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">30 Days</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Return</div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Product;
