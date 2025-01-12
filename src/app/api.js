import {backendAPI} from './baseAPI'

export const getData = async (url) => {
  try {
    const response = await backendAPI.get(url)
    return response
  } catch (error) {
    console.log('error', error)
    return error
  }
}

export const postData = async (url, payload) => {
  try {
    const response = await backendAPI.post(url, payload)
    return response
  } catch (error) {
    console.log('error', error)
    return error
  }
}
