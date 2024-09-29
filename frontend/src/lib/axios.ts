import { apiUrl } from '@/lib/config';
import axiosInstance, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const axios = axiosInstance.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

axios.interceptors.response.use(
    (response) => {
        return response.data.data;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

export default axios;
