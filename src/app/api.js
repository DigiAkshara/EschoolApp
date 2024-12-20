import { backendAPI } from "./baseAPI";

export const getData = async (url) => {
    const response = await backendAPI.get(url);
    return response;
}

export const postData = async (url, payload) => {
  console.log(payload);
  
  const response = await backendAPI.post(url, payload);
  return response;
}