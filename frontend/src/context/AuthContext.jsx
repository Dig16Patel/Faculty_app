import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      // Get existing users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Check if email already exists
      if (registeredUsers.some(user => user.email === userData.email)) {
        return { success: false, error: 'Email already registered' };
      }

      // Create new user with unique ID
      const newUser = {
        ...userData,
        id: Date.now().toString(),
      };

      // Add to registered users
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      // Auto login after registration
      await login(newUser);

      return { success: true, data: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  const login = async (userData) => {
    try {
      // Set user data in localStorage
      localStorage.setItem('token', 'dummy-token-' + Date.now());
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userRole', userData.role);
      
      // Update state
      setUser(userData);
      
      // Return success with role for navigation
      return { 
        success: true, 
        data: userData,
        role: userData.role 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};