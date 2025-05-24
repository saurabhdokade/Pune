import { useState } from "react";
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
  FaBars
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden p-4">
        <button onClick={toggleSidebar}>
          <FaBars size={24} className="text-purple-600" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-50 
                      ${isOpen ? "w-64" : "w-0"} 
                      md:w-64 md:relative md:translate-x-0 overflow-hidden`}>
        <div className="p-4 border-b flex items-center justify-start">
          <div className="font-bold text-sm text-purple-600 leading-tight">
            <p className="text-xl font-bold">🎯</p>
            <p>CITY CENTER</p>
            <p>MALL</p>
          </div>
        </div>
        <ul className="p-4 space-y-4 text-sm text-purple-600">
          <li className="flex items-center space-x-2 font-bold">
            <FaTachometerAlt /> <span>Dashboard</span>
          </li>
          <li className="flex items-center space-x-2">
            <FaUsers /> <span>Customer</span>
          </li>
          <li className="flex items-center space-x-2">
            <FaStore /> <span>Branch</span>
          </li>
          <li className="flex items-center space-x-2">
            <FaMotorcycle /> <span>Delivery Boy</span>
          </li>
          <li className="flex items-center space-x-2">
            <FaShoppingCart /> <span>Orders</span>
          </li>
          <li className="flex items-center space-x-2">
            <FaBell /> <span>Notification</span>
          </li>
          <li className="flex items-center space-x-2">
            <FaCreditCard /> <span>Payments</span>
          </li>
          <li className="flex items-center space-x-2">
            <FaCog /> <span>Settings</span>
          </li>
        </ul>
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-purple-600">
          <FaSignOutAlt />
          <span>Logout</span>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
