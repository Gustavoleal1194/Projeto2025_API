import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '../../types';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('yeti_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('yeti_token');
                    localStorage.removeItem('yeti_user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.get(url, config);
        return response.data;
    }

    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.post(url, data, config);
        return response.data;
    }

    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.put(url, data, config);
        return response.data;
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.delete(url, config);
        return response.data;
    }
}

export const apiClient = new ApiClient();
