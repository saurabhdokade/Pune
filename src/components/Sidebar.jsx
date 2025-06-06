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
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if a route is active
  const isActive = (path) => location.pathname === path;

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
        <li
          className={`flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer 
            ${isActive("/dashboard") ? "font-bold bg-white/20" : "hover:bg-white/10"}`}
          onClick={() => navigate("/dashboard")}
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </li>

        <li
          className={`flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer 
            ${isActive("/customers") ? "font-bold bg-white/20" : "hover:bg-white/10"}`}
          onClick={() => navigate("/customers")}
        >
          <FaUsers />
          <span>Customer</span>
        </li>

        <li
          className={`flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer 
            ${isActive("/branchlist") ? "font-bold bg-white/20" : "hover:bg-white/10"}`}
          onClick={() => navigate("/branchlist")}
        >
          <FaStore />
          <span>Branch</span>
        </li>

        <li
          className={`flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer 
            ${isActive("/deliveryboys") ? "font-bold bg-white/20" : "hover:bg-white/10"}`}
          onClick={() => navigate("/deliveryboys")}
        >
          <FaMotorcycle />
          <span>Delivery Boy</span>
        </li>

        <li
          className={`flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer 
            ${isActive("/orders") ? "font-bold bg-white/20" : "hover:bg-white/10"}`}
          onClick={() => navigate("/orders")}
        >
          <FaShoppingCart />
          <span>Orders</span>
        </li>

        <li
          className={`flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer 
            ${isActive("/notifications") ? "font-bold bg-white/20" : "hover:bg-white/10"}`}
          onClick={() => navigate("/notifications")}
        >
          <FaBell />
          <span>Notification</span>
        </li>

        <li
          className={`flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer 
            ${isActive("/payments") ? "font-bold bg-white/20" : "hover:bg-white/10"}`}
          onClick={() => navigate("/payments")}
        >
          <FaCreditCard />
          <span>Payments</span>
        </li>

        <li
          className={`flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer 
            ${isActive("/settings") ? "font-bold bg-white/20" : "hover:bg-white/10"}`}
          onClick={() => navigate("/settings")}
        >
          <FaCog />
          <span>Settings</span>
        </li>
      </ul>

      {/* Logout */}
      <div
        className="absolute bottom-4 left-4 flex items-center space-x-2 text-white hover:text-gray-300 cursor-pointer"
        onClick={() => {
          // Clear token and redirect to login
          localStorage.removeItem("access_token"); 
          navigate("/login");
        }}
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
