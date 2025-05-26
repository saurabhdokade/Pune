import React from 'react';
import { FaBell, FaMoon } from 'react-icons/fa';

const Navbar = () => {
  return (
    <div
      className="flex items-center justify-between p-4 shadow-md fixed top-0 right-0 z-50 w-full md:left-64 md:w-[calc(100%-256px)]"
      style={{
        backgroundColor: '#2F5383',
        borderBottom: '3px solid #24446b',
      }}
    >
      {/* Search Bar */}
      <div className="flex items-center w-full max-w-md">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-lg bg-[#3b5a89] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
        />
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-4 ml-4">
        {/* Notification Icon */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#3b5a89]">
          <FaBell className="text-white text-lg" />
        </div>

        {/* Dark Mode Icon */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#3b5a89]">
          <FaMoon className="text-white text-lg" />
        </div>

        {/* Profile Image */}
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-white"
        />

        {/* User Name */}
        <span className="text-white font-medium">John Doe</span>
      </div>
    </div>
  );
};

export default Navbar;
