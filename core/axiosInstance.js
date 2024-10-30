import axios from 'axios';
import { getToken, clearToken } from './authService.js';

export function createAxiosInstance(baseURL) {
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.request.use(async (config) => {
    try {
      const token = await getToken();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        clearToken();
        try {
          const token = await getToken();
          error.config.headers.Authorization = `Bearer ${token}`;
          return instance(error.config);
        } catch (tokenError) {
          return Promise.reject(tokenError);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
