import Axios from 'axios';

const API_URL = process.env.URL || 'http://localhost:8000/api';

const createInstance = (URL) => {
  const instance = Axios.create({
    baseURL: URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('studentManagment') || ''}`,
    },
  });

  instance.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${localStorage.getItem('studentManagment') || ''}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return instance;
};

export const backendAPI = createInstance(API_URL);
