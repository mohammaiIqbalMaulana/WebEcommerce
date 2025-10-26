import Navbar from "../../../components/Elements/Navbar";
import { useSelector } from "react-redux";
import { selectCartItems } from "../cartSlice";
import { useMemo } from "react";
import { FaShoppingCart, FaCreditCard } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdLocalShipping, MdSecurity } from "react-icons/md";
import CheckoutTotalPrice from "../components/CheckoutTotalPrice";
import CartProductsList from "../components/CartProductsList";
import { getStripe } from "../../../utils/getStripe";
import { useCreateCheckoutSessionMutation } from "../../checkout/api/createCheckoutSession";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Cart = () => {
    const { currentUser, token } = useAuth();
    const cartItems = useSelector(selectCartItems);
    const cartTotalPrice = useMemo(() => {
        return Number(
            cartItems
                .reduce((accumulator, currentValue) => {
                    return (
                        accumulator + currentValue.quantity * currentValue.product.price
                    );
                }, 0)
                .toFixed(2)
        );
    }, [cartItems]);

    const { mutateAsync: createCheckout } = useCreateCheckoutSessionMutation(token);
    const handleCheckout = async () => {
        try {
            // Validate cart items
            if (!cartItems.length) {
                throw new Error("Your cart is empty");
            }

            // Initialize Stripe first
            console.log("Initializing Stripe...");
            const stripe = await getStripe();
            if (!stripe) {
                throw new Error("Could not initialize Stripe");
            }

            // Prepare line items
            console.log("Preparing checkout data...");
            const lineItems = cartItems.map((cartItem) => {
                if (!cartItem.product.priceId) {
                    throw new Error(`Missing price ID for product: ${cartItem.product.name}`);
                }
                return {
                    price: cartItem.product.priceId,
                    quantity: cartItem.quantity,
                };
            });

            const sessionData = {
                lineItems,
                userId: currentUser?.uid || "",
            };

            // Create checkout session
            console.log("Creating checkout session...");
            const { sessionId } = await createCheckout(sessionData);
            if (!sessionId) {
                throw new Error("No session ID received from server");
            }
            console.log("Session created with ID:", sessionId);

            // Redirect to checkout
            console.log("Redirecting to checkout...");
            const { error } = await stripe.redirectToCheckout({
                sessionId: sessionId
            });
            
            if (error) {
                console.error("Redirect error:", error);
                throw new Error(error.message);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Failed to redirect to checkout. Please try again.");
        }
    };

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
                            className="p-3 bg-blue-100 dark:bg-blue-900 rounded-2xl"
                            whileHover={{ scale: 1.05 }}
                        >
                            <FaShoppingCart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                            </p>
                        </div>
                    </div>
                </motion.div>

                {cartItems.length === 0 ? (
                    /* Empty Cart State */
                    <motion.div
                        className="text-center py-20"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.div
                            className="w-32 h-32 mx-auto mb-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                        >
                            <FaShoppingCart className="w-16 h-16 text-gray-400" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Add some products to get started!</p>
                        <Link
                            to="/products/shop"
                            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <span>Start Shopping</span>
                            <FaArrowRightLong className="ml-2 w-5 h-5" />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <motion.div
                            className="lg:col-span-2"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
                                <CartProductsList context="cart" />
                            </div>
                        </motion.div>

                        {/* Order Summary */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sticky top-6">
                                <CheckoutTotalPrice amount={cartTotalPrice}>
                                    <div className="space-y-4">
                                        <motion.button
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-3"
                                            onClick={handleCheckout}
                                            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <FaCreditCard className="w-5 h-5" />
                                            <span>Proceed to Checkout</span>
                                        </motion.button>

                                        <Link
                                            to="/products/shop"
                                            className="flex items-center justify-center w-full py-3 px-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                                        >
                                            <span>Continue Shopping</span>
                                            <FaArrowRightLong className="ml-2 w-4 h-4" />
                                        </Link>
                                    </div>
                                </CheckoutTotalPrice>

                                {/* Trust Badges */}
                                <motion.div
                                    className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                            <MdLocalShipping className="w-5 h-5 text-green-500" />
                                            <span>Free Shipping</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                            <MdSecurity className="w-5 h-5 text-blue-500" />
                                            <span>Secure Payment</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Cart;
