// filepath: d:\Projects\telegram-like-chat\frontend\src\context\AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [socket, setSocket] = useState(null);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setSocket(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, socket, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
