import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaStore,
  FaMotorcycle,
  FaShoppingCart,
  FaBell,
  FaCreditCard,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-[#2F5383] shadow-lg transition-all duration-300 z-50 
                  ${isOpen ? "w-64" : "w-0"} 
                  md:w-64 md:relative md:translate-x-0 overflow-hidden`}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-white/20 flex items-center justify-start">
        <div className="font-bold text-sm text-white leading-tight">
          <p className="text-xl font-bold">🎯</p>
          <p>CITY CENTER</p>
          <p>MALL</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <ul className="p-4 space-y-3 text-sm text-white">
        <li className="flex items-center space-x-2 font-bold bg-white/20 px-3 py-2 rounded-md">
          <FaTachometerAlt />
          <span>Dashboard</span>
        </li>

        <li className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded-md cursor-pointer">
          <FaUsers />
          <span>Customer</span>
        </li>

        <li className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded-md cursor-pointer">
          <FaStore />
          <span>Branch</span>
        </li>

        <li className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded-md cursor-pointer">
          <FaMotorcycle />
          <span>Delivery Boy</span>
        </li>

        <li className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded-md cursor-pointer">
          <FaShoppingCart />
          <span>Orders</span>
        </li>

        <li className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded-md cursor-pointer">
          <FaBell />
          <span>Notification</span>
        </li>

        <li className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded-md cursor-pointer">
          <FaCreditCard />
          <span>Payments</span>
        </li>

        <li className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded-md cursor-pointer">
          <FaCog />
          <span>Settings</span>
        </li>
      </ul>

      {/* Logout */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white hover:text-gray-300 cursor-pointer">
        <FaSignOutAlt />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
