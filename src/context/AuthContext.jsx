import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      console.log("📦 Token in localStorage:", storedToken); // Check localStorage directly
      try {
        const response = await api.get('/users/me');
        console.log("✅ /users/me response:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Invalid token, logging out.", error);
        logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // --- NEW FUNCTION ---
  // This allows any component to trigger a refresh of the user's data
  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  const value = {
    token,
    user,
    loading,
    login,
    logout,
    refreshUser, // <-- Expose the new function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};