import { BsFillBasket3Fill } from "react-icons/bs";
import { ImSearch } from "react-icons/im";
import { MdFavorite } from "react-icons/md";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import defaultAvatar from "../../assets/images/default-avatar.webp";

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const { theme, toggleTheme } = useTheme();

    const { signOut, currentUser } = useAuth();
    const navigate = useNavigate();
    const handleNavClick = () => {
        setDropdownOpen(prevState => !prevState);
    };

    const handleSignOut = () => {
        signOut();
        navigate("/auth/login");
    };

    return (
        <motion.div
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md px-2 xs:px-6 py-5 justify-between rounded-2xl items-center my-4 shadow-2xl border border-white/20 dark:border-gray-700/50 relative z-30 transition-all duration-300"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <ul className="flex items-center text-sm justify-between">
                <motion.li
                    className="font-bold text-dark dark:text-white text-xl"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            E-Commerce
                        </span>
                        <span className="text-purple-600">Shop</span>
                    </Link>
                </motion.li>
                <div className="flex text-secondary dark:text-gray-300 text-lg items-center">
                    <motion.li
                        className="transition-colors hover:text-dark dark:hover:text-white ml-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/products/shop">
                            <ImSearch />
                        </Link>
                    </motion.li>
                    <motion.li
                        className="transition-colors hover:text-dark dark:hover:text-white ml-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/cart">
                            <BsFillBasket3Fill />
                        </Link>
                        {/* Cart badge - you can add cart count here */}
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            0
                        </span>
                    </motion.li>
                    <motion.li
                        className="transition-colors hover:text-dark dark:hover:text-white ml-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/products/favorites">
                            <MdFavorite />
                        </Link>
                    </motion.li>
                    <motion.li
                        className="transition-colors hover:text-dark dark:hover:text-white ml-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <button onClick={toggleTheme} className="p-1">
                            {theme === 'light' ? <FaMoon /> : <FaSun />}
                        </button>
                    </motion.li>
                    <motion.li
                        className="font-medium text-sm text-dark dark:text-white relative ml-5"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <button className="flex items-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={handleNavClick}>
                            <span className="sr-only">Account</span>
                            <img className="w-8 h-8 rounded-full ring-2 ring-gray-200 dark:ring-gray-600" src={currentUser?.photoURL || defaultAvatar} alt="User avatar" />
                            <FaChevronDown className="ml-1 text-secondary dark:text-gray-300" />
                        </button>

                        {dropdownOpen && (
                            <motion.div
                                className="z-10 origin-top-right absolute mb-10 mt-4 right-0 bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-48 overflow-hidden"
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            >
                                {currentUser &&
                                <div className="px-4 py-4 text-sm text-dark dark:text-white bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
                                    <div className="font-semibold">{currentUser?.displayName}</div>
                                    <div className="text-gray-600 dark:text-gray-400 truncate">
                                        {currentUser?.email}
                                    </div>
                                </div>
                                }
                                <ul className="py-2 text-sm text-dark dark:text-white">
                                    <li>
                                        <Link
                                            to="/dashboard"
                                            className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/dashboard"
                                            state={{ destination: "profile" }}
                                            className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Settings
                                        </Link>
                                    </li>
                                </ul>
                                <div className="py-2">
                                    <button
                                        onClick={handleSignOut}
                                        className="px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-sm text-red-600 dark:text-red-400 transition-colors"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.li>
                </div>
            </ul>
        </motion.div>
    );
};

export default Navbar;
