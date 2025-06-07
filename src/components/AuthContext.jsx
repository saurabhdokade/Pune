import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("access_token") || null);

  useEffect(() => {
    if (token) {
      setUser({ token });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (access_token, userData = null) => {
    localStorage.setItem("access_token", access_token);
    setToken(access_token);
    setUser(userData ? { ...userData, token: access_token } : { token: access_token });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);