import { Routes, Route } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import React from 'react';
export default function App() {
  return (
    
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          {/* Add other routes like dashboard later */}
        </Routes>
      </main>
    </div>
  );
}
