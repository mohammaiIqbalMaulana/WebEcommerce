import Navbar from "../../../components/Elements/Navbar";
import { useState } from "react";
import { BiSolidShoppingBags, BiSolidUser, BiSolidDashboard, BiSolidBarChartAlt2 } from "react-icons/bi";
import { TbTruckDelivery } from "react-icons/tb";
import { AdminProducts } from "../../products/components/AdminProducts";
import Profile from "../../users/components/Profile";
import { useAuth } from "../../../context/AuthContext";
import { Orders } from "../../orders/components/Orders";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export const Dashboard = () => {
    const { isAdmin } = useAuth();
    const location = useLocation();
    const [selectedTab, setSelectedTab] = useState<number>(location.state?.destination === "profile" ? 2 : (isAdmin ? 0 : 1));

    const tabs = [
        { id: 0, label: "Dashboard", icon: BiSolidDashboard, adminOnly: true },
        { id: 1, label: "Products", icon: BiSolidShoppingBags, adminOnly: true },
        { id: 2, label: "Orders", icon: TbTruckDelivery, adminOnly: false },
        { id: 3, label: "Analytics", icon: BiSolidBarChartAlt2, adminOnly: true },
        { id: 4, label: "Profile", icon: BiSolidUser, adminOnly: false }
    ];

    const filteredTabs = tabs.filter(tab => !tab.adminOnly || isAdmin);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <Navbar />
            <div className="container py-8">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your {isAdmin ? "store" : "account"} and track your activities
                    </p>
                </motion.div>

                {/* Navigation Tabs */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="flex flex-wrap gap-4 justify-center">
                        {filteredTabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <motion.button
                                    key={tab.id}
                                    className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                                        selectedTab === tab.id
                                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md"
                                    }`}
                                    onClick={() => setSelectedTab(tab.id)}
                                    whileHover={{ scale: selectedTab === tab.id ? 1.05 : 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Icon className="w-5 h-5 mr-2" />
                                    {tab.label}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    key={selectedTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {isAdmin && selectedTab === 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Stats Cards */}
                            <motion.div
                                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl"
                                whileHover={{ y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100">Total Products</p>
                                        <p className="text-2xl font-bold">156</p>
                                    </div>
                                    <BiSolidShoppingBags className="w-8 h-8 text-blue-200" />
                                </div>
                            </motion.div>
                            <motion.div
                                className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-xl"
                                whileHover={{ y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100">Total Orders</p>
                                        <p className="text-2xl font-bold">89</p>
                                    </div>
                                    <TbTruckDelivery className="w-8 h-8 text-green-200" />
                                </div>
                            </motion.div>
                            <motion.div
                                className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl"
                                whileHover={{ y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div>
                                    <p className="text-purple-100">Revenue</p>
                                    <p className="text-2xl font-bold">$12,450</p>
                                </div>
                            </motion.div>
                            <motion.div
                                className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-xl"
                                whileHover={{ y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div>
                                    <p className="text-orange-100">Customers</p>
                                    <p className="text-2xl font-bold">234</p>
                                </div>
                            </motion.div>
                        </div>
                    )}
                    {isAdmin && selectedTab === 1 && <AdminProducts />}
                    {selectedTab === 2 && <Orders />}
                    {selectedTab === 3 && isAdmin && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Analytics</h2>
                            <p className="text-gray-600 dark:text-gray-400">Analytics dashboard coming soon...</p>
                        </div>
                    )}
                    {selectedTab === 4 && <Profile />}
                </motion.div>
            </div>
        </div>
    );
};
