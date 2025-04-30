import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Update this with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear the tokens, navigation will be handled by useAxiosAuth
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
    }
    return Promise.reject(error);
  }
);

export default instance; 