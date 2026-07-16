/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await axios.get('/api/auth/me');
          const userData = res.data.user;
          if (userData && userData._id && !userData.id) {
            userData.id = userData._id;
          }
          setUser(userData);
        } catch (err) {
          console.error('Failed to fetch user:', err);
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      } else {
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = (tokenData, userData) => {
    localStorage.setItem('token', tokenData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;
    setToken(tokenData);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
