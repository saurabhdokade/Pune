import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import Login from './pages/Login';
import { AuthProvider } from './components/AuthContext';
import Signup from './pages/signup';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Hide sidebar and navbar on login and signup pages
  const hideSidebarAndNavbar = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/dashboard' || location.pathname === '/addstore' || location.pathname === '/register' || location.pathname === '/';

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      {!hideSidebarAndNavbar && (
        <div className={`hidden md:flex fixed top-0 left-0 h-full w-64 bg-[#2F5383] text-white z-50`}>
          <Sidebar isOpen={sidebarOpen} toggleSidebar={setSidebarOpen} />
        </div>
      )}

      {/* Mobile Sidebar Overlay & Sidebar */}
      {!hideSidebarAndNavbar && (
        <div className="md:hidden">
          <div
            className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
              }`}
            onClick={() => setSidebarOpen(false)}
          />
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-[#2F5383] text-white z-50 overflow-hidden
              transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar isOpen={sidebarOpen} toggleSidebar={setSidebarOpen} />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {!hideSidebarAndNavbar && (
          <Navbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        )}
        <div className="flex-1 p-4 overflow-y-auto">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path='/dashboard' element={<Dashboard />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

//

export default App;