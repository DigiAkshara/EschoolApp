import {backendAPI} from './baseAPI'

export const getData = async (url) => {
  try {
    const response = await backendAPI.get(url)
    return response
  } catch (error) {
    throw error
  }
}

export const postData = async (url, payload) => {
  try {
    const response = await backendAPI.post(url, payload)
    return response
  } catch (error) {
    throw error
  }
}

export const updateData = async (url, payload) => {
  try {
    const response = await backendAPI.put(url, payload)
    return response
  } catch (error) {
    throw error
  }
}

export const deleteData = async (url, payload) => {
  try {
    const response = await backendAPI.delete(url, payload)
    return response
  } catch (error) {
    throw error
  }
}