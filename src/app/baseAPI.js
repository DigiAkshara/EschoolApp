import Axios from 'axios'

const API_URL = process.env.URL || 'http://localhost:8000/api' //192.168.1.11 or localhost

const createInstance = (URL) => {
  const instance = Axios.create({
    baseURL: URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('studentManagement') || ''}`,
      ['X-Academic-Year']: localStorage.getItem('academicYear'),
    },
  })

  instance.interceptors.request.use(
    (config) => {
      config.headers['X-Academic-Year'] = localStorage.getItem('academicYear')
      config.headers.Authorization = `Bearer ${
        localStorage.getItem('studentManagement') || ''
      }`
      return config
    },
    (error) => Promise.reject(error),
  )

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
  )

  return instance
}

export const backendAPI = createInstance(API_URL)
