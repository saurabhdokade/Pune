// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

// Create the context
export const AuthContext = createContext();

// Helper function to get the user from localStorage
function getInitialUser() {
  try {
    const stored = localStorage.getItem("user");
    if (!stored || stored === "undefined") return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
}

// AuthProvider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initialUser = getInitialUser();
    setUser(initialUser);
  }, []);

  // login method
  const login = (userData) => {
    if (userData && (userData.id || userData._id)) {
      try {
        const serialized = JSON.stringify(userData);
        localStorage.setItem("user", serialized);
        setUser(userData);
      } catch (err) {
        console.error("Failed to serialize userData:", err);
      }
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  // logout method
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // refresh method
  const refreshUser = () => {
    const refreshed = getInitialUser();
    setUser(refreshed);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};