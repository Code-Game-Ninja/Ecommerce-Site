import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to validate token
  const validateToken = (token) => {
    if (!token) return false;
    
    try {
      // Check if token is expired by decoding it
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        // Token is expired
        return false;
      }
      
      return true;
    } catch (error) {
      // Invalid token format
      return false;
    }
  };

  // Function to clear auth state
  const clearAuthState = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData && validateToken(token)) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    } else if (token) {
      // Token exists but is invalid, clear it
      clearAuthState();
    }
    
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    clearAuthState();
  };

  // Check if user is a vendor
  const isVendor = () => {
    return user?.role === 'vendor' || user?.isVendor === true;
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
    isVendor,
    clearAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 