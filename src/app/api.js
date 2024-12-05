import { backendAPI } from "./baseAPI";

export const getData = async (url) => {
    const response = await backendAPI.get(url);
    return response.data;
}

export const postData = async (url, payload) => {
  const response = await backendAPI.post(url, payload);
  return response;
}