
import React from 'react';
import { FaSearch, FaBell, FaUserCircle, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Add this import

const Navbar = ({ screenName, toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div
      className="flex items-center justify-between p-4 shadow-md"
      style={{
        backgroundColor: '#2F5383',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      {/* Left: Hamburger on mobile */}
      <div className="flex items-center space-x-4">
        <div className="md:hidden">
<FaBars className="text-white text-2xl cursor-pointer" onClick={toggleSidebar} /></div>
        <h1 className="text-white text-2xl font-semibold hidden md:block">{screenName}</h1>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <FaSearch className="text-white text-xl absolute left-2 pointer-events-none" />
          <input
            type="text"
            className="bg-transparent text-white border-b border-white px-10 py-1 focus:outline-none w-48 md:w-72"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
        </div>

        {/* Notification */}
        <FaBell className="text-white text-xl cursor-pointer" />

        {/* Profile */}
        <FaUserCircle
          className="text-white text-2xl cursor-pointer"
          onClick={() => navigate('/adminprofile')} // Navigate to adminprofile
        />
      </div>
    </div>
  );
};

export default Navbar;