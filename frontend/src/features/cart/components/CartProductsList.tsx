import { useSelector } from "react-redux";
import { selectCartItems } from "../cartSlice";
import { ProductQuantitySelectBox } from "../../../components/Form";
import { Link } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { BsCartX } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { ChangeEvent } from "react";
import { FcCheckmark } from "react-icons/fc";
import { addToCart, removeFromCart } from "../cartSlice";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { IProduct } from "../../../types/product";

type Props = {
    context?: "cart" | "checkout";
}

const CartProductsList = (props: Props) => {
    const cartItems = useSelector(selectCartItems);

    return (
        <motion.div
            className={`flex flex-col space-y-6 w-full ${
                props.context === "cart" ? "mr-0 md:mr-5" : "max-h-[400px]"
            } overflow-y-auto`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {cartItems.length > 0 ? cartItems.map((cartItem, index) => (
                <motion.div
                    key={cartItem.product.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <CartProductView {...cartItem} {...props} />
                </motion.div>
            )) : (
                <motion.div
                    className="text-center py-12"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <BsCartX className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h4 className="font-semibold text-xl text-gray-600 dark:text-gray-400">Your cart is empty</h4>
                    <p className="text-gray-500 dark:text-gray-500 mt-2">Add some products to get started!</p>
                </motion.div>
            )}
        </motion.div>
    );
};


type CartItemProp = {
  product: IProduct;
  quantity: number;
  context?: "cart" | "checkout";
};

const CartProductView = (props: CartItemProp) => {
    const dispatch = useDispatch<AppDispatch>();
    const handleQuantityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newQuantity = Number(e.target.value);
        dispatch(addToCart({ product: props.product, quantity: newQuantity }));
    };

    const handleProductRemove = () => {
        dispatch(removeFromCart({ id: props.product.id }));
    };

    return (
        <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            whileHover={{ y: -2 }}
            layout
        >
            <div className="flex items-start space-x-4">
                <Link
                    className={`shrink-0 ${
                        props.context === "cart" ? "w-24 h-24 sm:w-32 sm:h-32" : "w-20 h-20"
                    }`}
                    to={`/products/${props.product.id}`}
                >
                    <motion.img
                        className="w-full h-full rounded-xl object-cover shadow-md"
                        src={props.product.image as string}
                        alt="Product image"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    />
                </Link>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                        <Link
                            to={`/products/${props.product.id}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <h5 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
                                {props.product.name}
                            </h5>
                        </Link>
                        {props.context === "cart" && (
                            <motion.button
                                onClick={handleProductRemove}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <MdDelete className="w-5 h-5" />
                            </motion.button>
                        )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ${props.product.price}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            × {props.quantity}
                        </span>
                    </div>

                    {props.context === "cart" && (
                        <div className="mb-3">
                            <ProductQuantitySelectBox
                                quantity={props.quantity}
                                handleQuantityChange={handleQuantityChange}
                                stockQuantity={props.product.stockQuantity}
                            />
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            {props.product.stockQuantity > 0 ? (
                                <span className="flex items-center text-green-600 dark:text-green-400">
                                    <FcCheckmark className="mr-1 w-4 h-4" />
                                    In Stock
                                </span>
                            ) : (
                                <span className="flex items-center text-red-500">
                                    <RxCross1 className="mr-1 w-4 h-4" />
                                    Out of Stock
                                </span>
                            )}
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                            ${(props.product.price * props.quantity).toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


export default CartProductsList;