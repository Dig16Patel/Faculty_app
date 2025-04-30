import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';

export const useAxiosAuth = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and user data
          logout();
          // Navigate to login
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Remove the interceptor when the component unmounts
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate, logout]);

  return axios;
}; 