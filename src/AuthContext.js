import React, { createContext, useState, useEffect } from 'react';
import { getData, removeData } from './utils/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    const user = await getData('user');
    setIsLoggedIn(!!user);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const logout = async () => {
    await removeData('user');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
