import { backendAPI } from "./baseAPI";

export const getData = async (url) => {
  try {
    const response = await backendAPI.get(url);
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

export const postData = async (url, payload) => {
  return await backendAPI.post(url, payload);
}