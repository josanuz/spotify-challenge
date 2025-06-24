/**
 * This file provides a default axios client configuration
 * that includes request and response interceptors.
 */
import axios from 'axios';
import { authenticationStore } from '../state/app-state';

/**
 * Default axios client configuration
 */
const api = axios.create({
    timeout: 30000,
});

/**
 * Request interceptor
 * This interceptor adds the Authorization header with the JWT token
 */
api.interceptors.request.use(request => {
    const currentToken = authenticationStore.getState().token;
    request.headers['Authorization'] = `Bearer ${currentToken}`;
    return request;
});

/*
 * Response interceptor
 * This interceptor handles 401 and 403 errors by redirecting to the login page
 */
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    },
);

export default api;
