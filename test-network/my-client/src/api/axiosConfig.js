import axios, { AxiosError } from "axios";
import {clearStorage, getAccessToken, getRefreshToken, setAccessToken,setRefreshToken, getUser, setUser} from '../utils/LocalStorage'

export const instance = axios.create({
    baseURL: "http://192.168.137.129:1111/api/v1",
});

instance.interceptors.request.use(
    function (config) {
        config.timeout = 5000;
        const accessToken = getAccessToken();
        config.headers.Authorization = `Bearer ${accessToken}`;

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

async function refreshAccessToken() {
    try {
        const refreshToken = getRefreshToken();
        if(!refreshToken) {
            throw new Error('refresh Token no exists');
        }
        const response = await instance('/refreshToken', {
            method: 'POST',
            data: {
                refreshToken: refreshToken
            }
        }
        );
        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);
        return newAccessToken
    } catch (err) {
      throw err;
    }
  }

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const accessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return await instance(originalRequest);
      }
      return Promise.reject(error);
    }
  );