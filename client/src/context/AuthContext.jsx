import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      const storedUserData = localStorage.getItem('userData');
      
      console.log('Checking auth status, token exists:', !!token);
      console.log('Stored user data exists:', !!storedUserData);
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      // If we have stored user data, use it immediately
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          console.log('Using stored user data:', parsedUserData);
          setUser(parsedUserData);
        } catch (err) {
          console.error('Error parsing stored user data:', err);
        }
      }

      try {
        // Verify token with backend
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('authToken');
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        setError('Failed to verify authentication');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    // Store both the token and the complete user data
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('Stored user data in localStorage:', userData);
  };

  const logout = () => {
    setUser(null);
    // Clear both token and user data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    // Optionally call a logout endpoint
    fetch('/api/auth/logout', { method: 'POST' }).catch(err => {
      console.error('Logout error:', err);
    });
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
