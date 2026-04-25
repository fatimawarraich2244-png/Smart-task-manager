import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

/**
 * AuthContext — Global authentication state management
 * Provides user info, login/register/logout functions, and loading states
 */
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('stm_token'));
  const [loading, setLoading] = useState(true);

  // On mount, check if we have a stored token and user
  useEffect(() => {
    const storedUser = localStorage.getItem('stm_user');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data);
    setToken(data.token);
    localStorage.setItem('stm_token', data.token);
    localStorage.setItem('stm_user', JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    setUser(data);
    setToken(data.token);
    localStorage.setItem('stm_token', data.token);
    localStorage.setItem('stm_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('stm_token');
    localStorage.removeItem('stm_user');
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('stm_user', JSON.stringify(newUser));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
