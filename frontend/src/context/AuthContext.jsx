import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('njp_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('njp_user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('njp_user');
    delete api.defaults.headers.common['Authorization'];
  };

  const updateUser = (updated) => {
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem('njp_user', JSON.stringify(merged));
  };

  const isHR = user?.role === 'hr' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading, isHR, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
