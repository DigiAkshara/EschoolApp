import Axios from 'axios'
const API_URL = process.env.API_URL || 'https://eschoolapi.onrender.com/api' //192.168.1.11 or localhost or https://eschoolapi.onrender.com

const createInstance = (URL) => {
  const instance = Axios.create({
    baseURL: URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('studentManagement') || ''}`,
      'X-Academic-Year': localStorage.getItem('academicYear'),
      'X-Branch': localStorage.getItem('branchId'),
      'X-Device': "webApp",
    },
  })

  instance.interceptors.request.use(
    (config) => {
      config.headers['X-Academic-Year'] = localStorage.getItem('academicYear')
      config.headers['X-Branch'] = localStorage.getItem('branchId')
      config.headers['X-Device'] = "webApp"
      config.headers.Authorization = `Bearer ${localStorage.getItem('studentManagement') || ''
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
