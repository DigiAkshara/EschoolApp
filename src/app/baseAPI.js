import Axios from 'axios';

const API_URL = process.env.URL || 'http://192.168.1.11:8000/api';

const createInstance = (URL) => {
  const instance = Axios.create({
    baseURL: URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('studentManagment') || ''}`,
      ['X-Academic-Year']: localStorage.getItem("academicYear")
    },
  });

  instance.interceptors.request.use(
    (config) => {
      config.headers['X-Academic-Year'] = localStorage.getItem("academicYear")
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
