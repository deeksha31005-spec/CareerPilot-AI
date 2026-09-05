import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api/auth';

/**
 * AuthProvider Component
 * Manages user authentication state, JWT storage in localStorage, login, registration, and logout
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('careerpilot_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('careerpilot_token') || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync token to default Axios auth header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  /**
   * User Registration Handler
   */
  const register = async (name, email, password, targetRole) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        targetRole
      });

      const data = response.data;
      setUser(data);
      setToken(data.token);
      localStorage.setItem('careerpilot_user', JSON.stringify(data));
      localStorage.setItem('careerpilot_token', data.token);

      setLoading(false);
      return { success: true, user: data };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  /**
   * User Login Handler
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      const data = response.data;
      setUser(data);
      setToken(data.token);
      localStorage.setItem('careerpilot_user', JSON.stringify(data));
      localStorage.setItem('careerpilot_token', data.token);

      setLoading(false);
      return { success: true, user: data };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Invalid email or password.';
      return { success: false, message };
    }
  };

  /**
   * User Logout Handler
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('careerpilot_user');
    localStorage.removeItem('careerpilot_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
