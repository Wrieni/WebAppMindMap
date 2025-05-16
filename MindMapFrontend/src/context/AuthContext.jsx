import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get('https://localhost:7204/api/Auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error('Auth check failed:', err); 
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  // В вашем AuthContext.jsx
  const login = async (email, password) => {
    try {
      const response = await axios.post('https://localhost:7204/api/Auth/login', { email, password });
      
      // Проверьте структуру ответа
      console.log('Login response:', response.data); 
      
      if (response.data.user && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user); // Критически важно!
        return true;
      }
      return false;
    } catch (error) {
      console.error('Ошибка входа:', error);
      return false;
    }
  };

  const register = async (formData) => {
    const res = await axios.post('https://localhost:7204/api/Auth/register', formData);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);