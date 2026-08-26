/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const storedToken = token || localStorage.getItem('token');
    if (storedToken && storedToken !== 'null' && storedToken !== 'undefined') {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        const res = await axios.get('http://13.51.201.78:5000/api/auth/me');
        const userData = res.data.user;
        if (userData && userData._id && !userData.id) {
          userData.id = userData._id;
        }
        setUser(userData);
        return userData;
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    } else {
      setUser(null);
      setLoading(false);
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    let isMounted = true;
    const initUser = async () => {
      const storedToken = token || localStorage.getItem('token');
      if (storedToken && storedToken !== 'null' && storedToken !== 'undefined') {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const res = await axios.get('http://13.51.201.78:5000/api/auth/me');
          const userData = res.data.user;
          if (userData && userData._id && !userData.id) {
            userData.id = userData._id;
          }
          if (isMounted) setUser(userData);
        } catch (err) {
          console.error('Failed to fetch user:', err);
          if (isMounted) {
            setUser(null);
            setToken(null);
          }
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        delete axios.defaults.headers.common['Authorization'];
      }
    };
    initUser();
    return () => { isMounted = false; };
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
    <AuthContext.Provider value={{ user, token, login, logout, loading, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
