import axios from 'axios';
import api from './axios-clent';
import { jwtDecode } from 'jwt-decode';

export type TokenResponse = {
    token?: string;
    message?: string;
    error?: string;
};

// utility function to check if a token is quasi-expired
export const isTokenAboutToExpire = (token: string | null): boolean => {
    if (!token) return false;
    const { exp } = jwtDecode<{ exp: number }>(token);
    const now = Math.floor(Date.now() / 1000);
    return exp - now < 60; // 60 seconds before expiration
};

export const getToken = async (accessToken: string): Promise<TokenResponse> => {
    return axios
        .post('/auth/code-begin', { code: accessToken })
        .then(response => {
            if (response.status === 200) {
                return response.data as TokenResponse;
            } else {
                return { error: `Authentication failed ${response.statusText}` };
            }
        })
        .catch(error => {
            return { error: `Error reaching the server: ${error.message}` };
        });
};

export const refreshToken = async (): Promise<TokenResponse> => {
    return api.post('/auth/refresh-token').then(response => response.data as TokenResponse);
};
