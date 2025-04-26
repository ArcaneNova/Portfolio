import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI } from '../utils/api';

// Create an auth context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing user session on load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        
        // First check if we have a user in localStorage
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          // Set the user from localStorage first for immediate UI update
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            console.log('User restored from localStorage:', parsedUser);
            
            // Then verify with the server in the background
            try {
              const response = await authAPI.getProfile();
              if (response.data.success && response.data.data) {
                // Update with fresh data from server
                setUser(response.data.data);
                console.log('User verified with server:', response.data.data);
              }
            } catch (profileError) {
              console.warn('Could not verify user with server, using localStorage data:', profileError.message);
              // We'll keep using the stored user data and not log out
            }
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
            // Invalid stored user data, clear it
            localStorage.removeItem('user');
          }
        } else {
          // No token or user in localStorage
          setUser(null);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        // Don't clear token/user here - only if specifically unauthorized
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
        setError(err.response?.data?.message || 'Authentication check failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(credentials);
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
    }
  };

  // Auth context value
  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for accessing auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth; 