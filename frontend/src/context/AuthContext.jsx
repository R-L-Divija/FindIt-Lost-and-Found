import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('findit_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('findit_token') || null);
  const [loading, setLoading] = useState(true);

  // Synchronize user verification on mount if token exists
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('findit_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('findit_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification failed:', err.userMessage || err.message);
          // Token is likely invalid or expired
          signout();
        }
      }
      setLoading(false);
    };

    verifyAuth();

    // Event listener for unauthorized triggers from api interceptor
    const handleLogout = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('findit_token');
      localStorage.removeItem('findit_user');
    };

    window.addEventListener('findit_auth_logout', handleLogout);
    return () => window.removeEventListener('findit_auth_logout', handleLogout);
  }, []);

  const signin = async (email, password) => {
    const res = await authAPI.signin({ email, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('findit_token', res.token);
      localStorage.setItem('findit_user', JSON.stringify(res.user));
    }
    return res;
  };

  const signup = async (name, email, password) => {
    const res = await authAPI.signup({ name, email, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('findit_token', res.token);
      localStorage.setItem('findit_user', JSON.stringify(res.user));
    }
    return res;
  };

  const signout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('findit_token');
    localStorage.removeItem('findit_user');
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('findit_user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    signin,
    signup,
    signout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
