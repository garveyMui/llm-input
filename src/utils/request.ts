// src/utils/requestUtils.ts
import axios from 'axios';
import llmService from '@/assets/APIKey.json';
// 一个简单的工具函数来处理错误
export const handleError = (error: any) => {
    if (error.response) {
        // 服务器返回的错误响应
        console.error('API Error:', error.response.data);
    } else if (error.request) {
        // 请求没有返回响应
        console.error('No response received:', error.request);
    } else {
        // 其他错误
        console.error('Error', error.message);
    }
};

// 封装一个重试请求的函数
export const retryRequest = async (request: any, retries: number = 3) => {
    let attempt = 0;
    while (attempt < retries) {
        try {
            const response = await request();
            return response;
        } catch (error) {
            if (attempt === retries - 1) throw error;
            attempt++;
        }
    }
};

export const request = axios.create({
    baseURL: llmService.baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${llmService.apiKey}`,
    },
});

request.interceptors.request.use((config) => {
    // 可根据需要在请求发出前修改请求配置
    return config;
});

request.interceptors.response.use(
    (response) => response,
    (error) => {
        // 错误处理
        return Promise.reject(error);
    }
);
