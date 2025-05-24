import React, { useState } from "react";
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
  FaBars
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden p-4 bg-white shadow-sm">
        <button onClick={toggleSidebar}>
          <FaBars size={24} className="text-purple-600" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-50 
                      ${isOpen ? "w-64" : "w-0"} 
                      md:w-64 md:relative md:translate-x-0 overflow-hidden`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b flex items-center justify-start">
          <div className="font-bold text-sm text-purple-600 leading-tight">
            <p className="text-xl font-bold">🎯</p>
            <p>CITY CENTER</p>
            <p>MALL</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <ul className="p-4 space-y-3 text-sm text-purple-600">
          {/* Active Item: Dashboard */}
          <li className="flex items-center space-x-2 font-bold bg-purple-100 px-3 py-2 rounded-md text-purple-700">
            <FaTachometerAlt />
            <span>Dashboard</span>
          </li>

          {/* Other Items */}
          <li className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer">
            <FaUsers />
            <span>Customer</span>
          </li>

          <li className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer">
            <FaStore />
            <span>Branch</span>
          </li>

          <li className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer">
            <FaMotorcycle />
            <span>Delivery Boy</span>
          </li>

          <li className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer">
            <FaShoppingCart />
            <span>Orders</span>
          </li>

          <li className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer">
            <FaBell />
            <span>Notification</span>
          </li>

          <li className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer">
            <FaCreditCard />
            <span>Payments</span>
          </li>

          <li className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer">
            <FaCog />
            <span>Settings</span>
          </li>
        </ul>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-purple-600 hover:text-purple-800 cursor-pointer">
          <FaSignOutAlt />
          <span>Logout</span>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
