import { Link } from "react-router-dom";
import { useState } from "react";
import { MdFavoriteBorder, MdFavorite, MdShoppingCart, MdStar } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { addFavorite, removeFavorite, selectFavorites } from "../favoritesSlice";
import { addToCart } from "../../cart/cartSlice";
import { motion } from "framer-motion";
import { IProduct } from "../../../types/product";
import { toast } from "react-toastify";

export const ProductPreview = (props: IProduct) => {
    const dispatch = useDispatch<AppDispatch>();
    const favorites = useSelector(selectFavorites);

    const [isFavorite, setIsFavorite] = useState<boolean>(favorites.some(favorite => favorite.id === props.id));
    const [isHovered, setIsHovered] = useState(false);

    const handleFavoriteChange = () => {
        isFavorite
            ? dispatch(removeFavorite({ id: props.id }))
            : dispatch(addFavorite(props));
        setIsFavorite((prevFavorite) => !prevFavorite);
    };

    return (
        <motion.div
            className="relative rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
            data-category={`${props.categoryId}`}
            data-created-at={`${props.createdAt}`}
            data-price={`${props.price}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {/* Product Image */}
            <div className="relative overflow-hidden">
                <Link to={`/products/${props.id}`}>
                    <motion.img
                        className="w-full h-[280px] sm:h-[320px] object-cover"
                        src={props.image as string}
                        alt="Product image"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </Link>

                {/* Overlay on hover */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                />

                {/* Favorite Button */}
                <motion.button
                    className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                    onClick={handleFavoriteChange}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        scale: isHovered ? 1 : 0.8
                    }}
                >
                    <motion.div
                        animate={{ scale: isFavorite ? 1.2 : 1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        {isFavorite ? (
                            <MdFavorite className="w-5 h-5 text-red-500" />
                        ) : (
                            <MdFavoriteBorder className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        )}
                    </motion.div>
                </motion.button>

                {/* Quick Actions */}
                <motion.div
                    className="absolute bottom-3 left-3 right-3 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? 0 : 20
                    }}
                >
                    <motion.button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium shadow-lg flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            dispatch(addToCart({ product: props, quantity: 1 }));
                            toast.success("🎉 Product added to cart successfully!", {
                                icon: "🛒",
                                style: {
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    color: 'white',
                                    fontWeight: '600',
                                    borderRadius: '16px',
                                    boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
                                }
                            });
                        }}
                    >
                        <MdShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                    </motion.button>
                </motion.div>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-2">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <MdStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">(4.5)</span>
                </div>

                {/* Product Name */}
                <h5 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight">
                    <Link
                        to={`/products/${props.id}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        {props.name}
                    </Link>
                </h5>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ${props.price}
                        </span>
                        {props.price > 100 && (
                            <span className="text-sm text-gray-500 line-through">
                                ${(props.price * 1.2).toFixed(0)}
                            </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">In Stock</span>
                    </div>
                </div>

                {/* Quick View Link */}
                <Link
                    to={`/products/${props.id}`}
                    className="inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                >
                    Quick View →
                </Link>
            </div>
        </motion.div>
    );
};
