import React, { createContext, useState, useEffect } from 'react';
import { getAuthUser, saveAuthUser, getUsers, saveUsers } from '../utils/localStorage';
import { initializeMockData } from '../utils/mockData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize mock data on first load
    initializeMockData();
    
    // Check if user is already logged in
    const user = getAuthUser();
    if (user) {
      setAuthUser(user);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      setAuthUser(userWithoutPassword);
      saveAuthUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (email, password, name, phone, role) => {
    const users = getUsers();
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      email,
      password,
      name,
      phone,
      role,
      address: ''
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    setAuthUser(userWithoutPassword);
    saveAuthUser(userWithoutPassword);

    return { success: true, user: userWithoutPassword };
  };

  const logout = () => {
    setAuthUser(null);
    saveAuthUser(null);
  };

  const value = {
    authUser,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!authUser,
    isAdmin: authUser?.role === 'admin',
    isCustomer: authUser?.role === 'customer'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
