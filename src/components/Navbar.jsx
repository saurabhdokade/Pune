import React from 'react';
import { FaBell, FaMoon } from 'react-icons/fa';

const Navbar = () => {
  return (
    <div
      className="flex items-center justify-end p-4 shadow-md fixed top-0 right-0 z-50 w-full md:left-64 md:w-[calc(100%-256px)]"
      style={{
        backgroundColor: '#fff',
        borderBottom: '3px solid #6C63FF',
      }}
    >
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
          <FaBell className="text-gray-700 text-lg" />
        </div>
        {/* Dark Mode Icon */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
          <FaMoon className="text-gray-700 text-lg" />
        </div>
        {/* Profile Image */}
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        {/* User Name */}
        <span className="text-gray-500 font-medium">John Doe</span>
      </div>
    </div>
  );
};

export default Navbar;