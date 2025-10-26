import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            E-CommerceShop
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your premier destination for quality products. Discover amazing deals
                            and exceptional customer service.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <FaFacebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <FaTwitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <FaInstagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <FaYoutube className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <FaLinkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/products/shop" className="text-gray-400 hover:text-white transition-colors">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link to="/products/favorites" className="text-gray-400 hover:text-white transition-colors">
                                    Favorites
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="text-gray-400 hover:text-white transition-colors">
                                    Cart
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Track Order
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Customer Service</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Shipping Info
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Returns & Exchanges
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Size Guide
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Stay Updated</h4>
                        <p className="text-gray-400 text-sm">
                            Subscribe to get special offers and updates.
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            />
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-800 my-8" />

                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>© {currentYear} E-CommerceShop. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
